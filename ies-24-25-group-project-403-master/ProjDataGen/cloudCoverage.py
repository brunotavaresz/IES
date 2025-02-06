import sys
import time
import random
import pika
import json
import os
from datetime import datetime
import logging
from dotenv import load_dotenv

# Load environment variables from .env file in the parent directory
dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env')
load_dotenv(dotenv_path)
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("Cloud Coverage Sensor")
logger.setLevel(logging.INFO)

class cloudCoverageSensor:

    def __init__(self, id, start_cloud_cover=None, sleep_time=10):
        # Load environment variables
        load_dotenv()
        
        # Get RabbitMQ configuration from environment variables
        self.rabbit_address = os.getenv('RABBITMQ_HOST', 'localhost')
        self.rabbit_port = int(os.getenv('RABBITMQ_PORT', '5672'))
        self.rabbit_user = os.getenv('RABBITMQ_USERNAME', 'myuser')
        self.rabbit_pass = os.getenv('RABBITMQ_PASSWORD', 'secret')

        if start_cloud_cover is None:
            self.start_cloud_cover = random.uniform(0, 100)  # Random initial cloud coverage between 0 and 100%
        else:
            self.start_cloud_cover = start_cloud_cover

        self.sleep_time = sleep_time
        self.type = 'CLOUD_COVERAGE'
        self.id = id
        self.value = self.start_cloud_cover
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
        
    def generate_cloud_coverage(self):
        """Generates cloud coverage with gradual fluctuation."""
        max_variation = 2  
        variation = random.uniform(-max_variation, max_variation)
        new_coverage = self.value + variation
        return round(max(0.0, min(new_coverage, 100.0)),2)
    
    def run(self):
        try:
            while True:
                self.value = self.generate_cloud_coverage()
                logger.info(f"Cloud Coverage: {self.value:.1f}%")
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
    start_cloud_cover = float(sys.argv[2]) if len(sys.argv) > 2 else None

    try:
        sensor = cloudCoverageSensor(id, start_cloud_cover)
        sensor.run()
    except Exception as e:
        logger.error(f"Error running sensor: {e}")