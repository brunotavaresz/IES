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
logger = logging.getLogger("Wave height Sensor")
logger.setLevel(logging.INFO)

class waveHeightSensor:

    def __init__(self, id, start_wave_height=None, sleep_time=10):
        # Load environment variables
        load_dotenv()
        
        # Get RabbitMQ configuration from environment variables
        self.rabbit_address = os.getenv('RABBITMQ_HOST', 'localhost')
        self.rabbit_port = int(os.getenv('RABBITMQ_PORT', '5672'))
        self.rabbit_user = os.getenv('RABBITMQ_USERNAME', 'myuser')
        self.rabbit_pass = os.getenv('RABBITMQ_PASSWORD', 'secret')

        if start_wave_height is None:
            self.start_wave_height = 5  # Altura da onda inicial aleatória entre 0 e 30 metros
        else:
            self.start_wave_height = start_wave_height

        self.sleep_time = sleep_time
        self.type = 'WAVE_HEIGHT'
        self.id = id
        self.value = self.start_wave_height
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

    def run(self):
        loopcounter=0
        change=0
        try:
            wave_height = self.start_wave_height

            while True:
                loopcounter+=1


                if loopcounter ==10:
                    loopcounter=0
                    change=random.uniform(-0.2, 0.2)
                wave_height_change = random.uniform(-0.5, 0.5) +change

                wave_height += wave_height_change

                wave_height = max(0.0, wave_height)

                wave_height = round(min(wave_height, 30.0),2)

                self.value = wave_height

                logger.info(f"Wave Height: {self.value} {self.unit}")

               # Send data to RabbitMQ
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
    start_wave_height = float(sys.argv[2]) if len(sys.argv) > 2 else None

    try:
        sensor = waveHeightSensor(id, start_wave_height)
        sensor.run()
    except Exception as e:
        logger.error(f"Error running sensor: {e}")
    