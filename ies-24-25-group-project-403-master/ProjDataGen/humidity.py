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
logger = logging.getLogger("Humidity Sensor")
logger.setLevel(logging.INFO)

class humSensor:

    def __init__(self, id, start_humi = None, spleep_time = 10):
        # Load environment variables
        load_dotenv()

        # Get RabbitMQ configuration from environment variables
        self.rabbit_address = os.getenv('RABBITMQ_HOST', 'localhost')
        self.rabbit_port = int(os.getenv('RABBITMQ_PORT', '5672'))
        self.rabbit_user = os.getenv('RABBITMQ_USERNAME', 'myuser')
        self.rabbit_pass = os.getenv('RABBITMQ_PASSWORD', 'secret')

        if start_humi is None:
            self.start_humi = random.uniform(20, 80)
        else:
            self.start_humi = start_humi

        self.spleep_time = spleep_time
        self.type = 'HUMIDITY'
        self.id = id
        self.value = self.start_humi
        self.unit = '%'

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
        try:
            humi_start=float(self.start_humi)

            while True:
                humi_change = random.random() / 10
                chance = random.random()
                humi_dif =humi_start - float(self.start_humi)

                up_down = (0.5 +(0.5* (humi_dif/3))) 

                if chance < up_down:
                    humi_start = humi_start - humi_change
                else:
                    humi_start = humi_start + humi_change
                self.value = round(humi_start,2)

                logger.info(f"Humidity updated: {self.value}")
                
                
                data = {'type': self.type, 'id': self.id, 'value': self.value, 'unit': self.unit,
                   'timestamp': datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%fZ')}
                
                
                
                self.channel.basic_publish(
                    exchange='',
                    routing_key=self.queue_name,
                    body=json.dumps(data),
                    properties=pika.BasicProperties(
                        delivery_mode=pika.spec.PERSISTENT_DELIVERY_MODE
                    )
                )

                time.sleep(self.spleep_time)

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
    start_humi = sys.argv[2] if len(sys.argv) > 2 else None

    sensor = humSensor(id, start_humi)
    sensor.run()