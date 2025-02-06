from datetime import datetime
import sys
import time
import random
import pika
import json
import math
import os
import logging
from dotenv import load_dotenv



# Load environment variables from .env file in the parent directory
dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env')
load_dotenv(dotenv_path)
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("Tide Height Sensor")
logger.setLevel(logging.INFO)

class tideHeightSensor:

    def __init__(self, id, start_tide_height=None, sleep_time=10):
        # Load environment variables
        load_dotenv()
        
        # Get RabbitMQ configuration from environment variables
        self.rabbit_address = os.getenv('RABBITMQ_HOST', 'localhost')
        self.rabbit_port = int(os.getenv('RABBITMQ_PORT', '5672'))
        self.rabbit_user = os.getenv('RABBITMQ_USERNAME', 'myuser')
        self.rabbit_pass = os.getenv('RABBITMQ_PASSWORD', 'secret')

        if start_tide_height is None:
            self.start_tide_height = 2  # Altura inicial da maré aleatória entre -5 e 15 metros
        else:
            self.start_tide_height = start_tide_height

        self.sleep_time = sleep_time
        self.type = 'TIDE_HEIGHT'
        self.id = id
        self.value = self.start_tide_height
        self.unit = 'm'

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
            
            # Keep the original queue name as requested
            self.queue_name = 'BeachControl'
            self.channel.queue_declare(queue=self.queue_name, durable=True)
            
        except pika.exceptions.AMQPConnectionError as error:
            logger.error(f"Failed to connect to RabbitMQ: {error}")
            raise

    def generate_tide_height(self, hour, minute):
        """Gera a altura da maré baseada na hora do dia."""
        tide_media = 2.5 
        amplitude = 2.0  
        ruido = 0.0005     

        time_fraction = hour + minute / 60.0

        altura = tide_media + amplitude * math.sin((time_fraction / 6) * math.pi)

        altura += random.uniform(-ruido, ruido)
        return round(max(0.0, min(altura, 5.0)),2)
    def run(self):
        try:
            while True:
                now = datetime.now()
                current_hour = now.hour
                current_minute = now.minute

                self.value = self.generate_tide_height(current_hour, current_minute)

                logger.info(f"Tide Height: {self.value} {self.unit}")

                # Enviar dados para o RabbitMQ
                data = {
                    'type': self.type,
                    'id': self.id,
                    'value': self.value,
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
            logger.info("Sensor stopping...")
        except pika.exceptions.AMQPConnectionError as error:
            logger.error(f"Lost connection to RabbitMQ: {error}")
        finally:
            if self.connection and not self.connection.is_closed:
                self.connection.close()
                logger.info("Closed RabbitMQ connection")


if __name__ == '__main__':
    id = sys.argv[1]
    start_tide_height = float(sys.argv[2]) if len(sys.argv) > 2 else None

    try:
        sensor = tideHeightSensor(id, start_tide_height)
        sensor.run()
    except Exception as e:
        logger.error(f"Error running sensor: {e}")


