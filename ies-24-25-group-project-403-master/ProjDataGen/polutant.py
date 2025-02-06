import sys
import time
import random
import pika
import json
import os
import logging
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file in the parent directory
dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env')
load_dotenv(dotenv_path)
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("DataHandler")
logger.setLevel(logging.INFO)

class PollutantSensor:

    def __init__(self, id, sleep_time=10):
        # Load environment variables
        load_dotenv()
        
        # Get RabbitMQ configuration from environment variables
        self.rabbit_address = os.getenv('RABBITMQ_HOST', 'localhost')
        self.rabbit_port = int(os.getenv('RABBITMQ_PORT', '5672'))
        self.rabbit_user = os.getenv('RABBITMQ_USERNAME', 'myuser')
        self.rabbit_pass = os.getenv('RABBITMQ_PASSWORD', 'secret')

        self.sleep_time = sleep_time
        self.type_oil = 'OIL'
        self.type_algae = 'ALGAE'
        self.type_chemicals = 'CHEMICALS'
        self.type_bacteria = 'BACTERIA'
        self.id = id
        self.unit = 'ppm'  # Partes por milhão (ppm) para as concentrações

        # Inicializando as concentrações dos poluentes (normalmente nulas)
        self.oil_concentration = 0.0
        self.algae_concentration = 0.0
        self.chemicals_concentration = 0.0
        self.bacteria_concentration = 0.0

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

    def generate_pollutant_concentration(self):
        """Gera as concentrações de poluentes, com a maioria sendo nulas e picos esporádicos."""
        # Chance de algum poluente ter um valor não nulo (geralmente muito baixo)
        chance_oil = random.random()
        chance_algae = random.random()
        chance_chemicals = random.random()
        chance_bacteria = random.random()

        if chance_oil < 0.09:
            self.oil_concentration += random.uniform(1, 6) 
        else:
            self.oil_concentration -= 0.2

        if chance_algae < 0.09: 
            self.algae_concentration += random.uniform(1, 7) 
        else:
            self.algae_concentration -= 0.2

        if chance_chemicals < 0.09:
            self.chemicals_concentration += random.uniform(1, 8)
        else:
            self.chemicals_concentration -= 0.2
            
        if chance_bacteria < 0.1:
            self.bacteria_concentration += random.uniform(1, 15)
        else:
            self.bacteria_concentration -= 0.5
            
        self.chemicals_concentration=max(0.0, self.chemicals_concentration)
        self.oil_concentration=max(0.0, self.oil_concentration)
        self.algae_concentration=max(0.0, self.algae_concentration)
        self.bacteria_concentration=max(0.0, self.bacteria_concentration)



    def run(self):
        try:
            while True:
                # Gera as concentrações dos poluentes
                self.generate_pollutant_concentration()
                logger.info(f"Generating pollutant data for sensor {self.id}...")

                # Envia dados de cada poluente com suas concentrações
                pollutants = [
                {'pType': self.type_oil, 'id': self.id, 'value': self.oil_concentration, 'unit': self.unit,'timestamp': datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%fZ')},
                {'pType': self.type_algae, 'id': self.id, 'value': self.algae_concentration, 'unit': self.unit,'timestamp': datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%fZ')},
                {'pType': self.type_chemicals, 'id': self.id, 'value': self.chemicals_concentration, 'unit': self.unit,'timestamp': datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%fZ')},
                {'pType': self.type_bacteria, 'id': self.id, 'value': self.bacteria_concentration, 'unit': self.unit,'timestamp': datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%fZ')}
                ]

                # Publica os dados de poluentes no RabbitMQ
                for pollutant in pollutants:
                    self.channel.basic_publish(
                    exchange='',
                    routing_key=self.queue_name,
                    body=json.dumps(pollutant),
                    properties=pika.BasicProperties(delivery_mode=pika.spec.PERSISTENT_DELIVERY_MODE)
                    )

                logger.info(f"Oil: {self.oil_concentration:.2f} ppm, Algae: {self.algae_concentration:.2f} ppm, "
                  f"Chemicals: {self.chemicals_concentration:.2f} ppm, Bacteria: {self.bacteria_concentration:.2f} ppm")

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

    
    try:
        sensor = PollutantSensor(id, sleep_time=10)  # Envia dados a cada 60 segundos
        sensor.run()
    except Exception as e:
        logger.error(f"Error running sensor: {e}")
