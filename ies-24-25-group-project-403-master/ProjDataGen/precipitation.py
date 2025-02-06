from datetime import datetime
import sys
import time
import random
import pika
import json
import os
import logging
from dotenv import load_dotenv

# Load environment variables from .env file in the parent directory
dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env')
load_dotenv(dotenv_path)
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("Precipitation Sensor")
logger.setLevel(logging.INFO)

class precipitationSensor:

    def __init__(self, id, start_precipitation=None, sleep_time=10):
        # Load environment variables
        load_dotenv()
        
        # Get RabbitMQ configuration from environment variables
        self.rabbit_address = os.getenv('RABBITMQ_HOST', 'localhost')
        self.rabbit_port = int(os.getenv('RABBITMQ_PORT', '5672'))
        self.rabbit_user = os.getenv('RABBITMQ_USERNAME', 'myuser')
        self.rabbit_pass = os.getenv('RABBITMQ_PASSWORD', 'secret')

        if start_precipitation is None:
            self.start_precipitation = 10  # Precipitação inicial aleatória em mm (0-1000 mm)
        else:
            self.start_precipitation = start_precipitation

        self.sleep_time = sleep_time
        self.type = 'PRECIPITATION'
        self.id = id
        self.value = self.start_precipitation
        self.unit = 'mm'

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

    def run(self):
        loopcounter=0
        loopcounter1=0
        heavy_change=0
        try:
            precipitation = self.start_precipitation

            while True:
                if loopcounter ==15:
                    loopcounter=0
                    heavy_change= random.uniform(-15, 15)  
                precipitation_change = random.uniform(-1, 1) +heavy_change


                if loopcounter1 >20 and loopcounter1 <30:
                    precipitation_change=0
                    if loopcounter1==30:
                        loopcounter1=0

                    

                    
                precipitation += precipitation_change

                
                precipitation = max(0.0, precipitation)

               
                precipitation = min(precipitation, 100.0)

                self.value = round(precipitation,2)
    
                logger.info(f"Precipitation: {self.value} {self.unit}")

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
    start_precipitation = float(sys.argv[2]) if len(sys.argv) > 2 else None
    try:
        sensor = precipitationSensor(id, start_precipitation)
        sensor.run()
    except Exception as e:
        logger.error(f"Error running sensor: {e}")