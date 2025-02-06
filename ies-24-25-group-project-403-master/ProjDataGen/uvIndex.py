from datetime import datetime
import math
import sys
import time
import random
import pika
import json
import logging
import os
from dotenv import load_dotenv

# Load environment variables from .env file in the parent directory
dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env')
load_dotenv(dotenv_path)
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("UV Index Sensor")  # Changed logger name to be more specific
logger.setLevel(logging.INFO)

class uvIndexSensor:

    def __init__(self, id, start_uv_index=None, sleep_time=10):
        # Load environment variables
        load_dotenv()
        
        # Get RabbitMQ configuration from environment variables
        self.rabbit_address = os.getenv('RABBITMQ_HOST', 'localhost')
        self.rabbit_port = int(os.getenv('RABBITMQ_PORT', '5672'))
        self.rabbit_user = os.getenv('RABBITMQ_USERNAME', 'myuser')
        self.rabbit_pass = os.getenv('RABBITMQ_PASSWORD', 'secret')

        if start_uv_index is None:
            self.start_uv_index = 0.0  # Fixed variable name from start_uv to start_uv_index
        else:
            self.start_uv_index = start_uv_index

        self.sleep_time = sleep_time
        self.type = 'UV_INDEX'
        self.id = id
        self.value = self.start_uv_index  # Fixed variable reference
        self.unit = 'UV'  # Added proper unit

        try:
            self.credentials = pika.PlainCredentials(self.rabbit_user, self.rabbit_pass)
            self.parameters = pika.ConnectionParameters(
                host=self.rabbit_address,
                port=self.rabbit_port,
                virtual_host='/',
                credentials=self.credentials
            )
            self.connection = pika.BlockingConnection(self.parameters)
            self.channel = self.connection.channel()
            
            self.queue_name = 'BeachControl'
            self.channel.queue_declare(queue=self.queue_name, durable=True)
            
        except pika.exceptions.AMQPConnectionError as error:
            logger.error(f"Failed to connect to RabbitMQ: {error}")
            raise

    def generate_uv_index(self, hour, minute,day_seed):
        """Generates UV index based on time of day."""
        uv_max = 11.0  # Maximum UV index value
        noise = 0.1    # Random variation

        time_fraction = hour + minute / 60.0
        if 6 <= hour <= 18:  
            uv_value = uv_max * math.sin((time_fraction - 6) * math.pi / 12) * (day_seed+0.1)
        else:
            return 0.0 

        uv_value += random.uniform(-noise, noise)

        return round(max(0.0, min(uv_value, 11.0)),2)
    def map_to_random(self,num):
        if 0 <= num <= 31:
            random.seed(num)  
            return random.uniform(0, 0.6) 
        else:
            raise ValueError("O número deve estar no intervalo de 0 a 31.")
    def run(self):
        try:
            while True:
                now = datetime.now()
                day_seed = self.map_to_random(now.day)
                current_hour = now.hour
                current_minute = now.minute

                self.value = self.generate_uv_index(current_hour, current_minute,day_seed)
                logger.info(f"UV Index: {self.value:.1f} {self.unit}")

                data = {
                    'type': self.type,
                    'id': self.id,
                    'value': round(self.value, 2),  # Round to 2 decimal places
                    'unit': self.unit,
                    'timestamp': datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%fZ')
                }
                
                self.channel.basic_publish(
                    exchange='',
                    routing_key=self.queue_name,
                    body=json.dumps(data),
                    properties=pika.BasicProperties(
                        delivery_mode=pika.spec.PERSISTENT_DELIVERY_MODE
                    )
                )

                time.sleep(self.sleep_time)

        except KeyboardInterrupt:
            logger.info("UV Index sensor stopping...")
        except pika.exceptions.AMQPConnectionError as error:
            logger.error(f"Lost connection to RabbitMQ: {error}")
        finally:
            if self.connection and not self.connection.is_closed:
                self.connection.close()
                logger.info("Closed RabbitMQ connection")

if __name__ == '__main__':
    id = sys.argv[1]
    start_uv_index = float(sys.argv[2]) if len(sys.argv) > 2 else None

    try:
        sensor = uvIndexSensor(id, start_uv_index)
        sensor.run()
    except Exception as e:
        logger.error(f"Error running UV Index sensor: {e}")