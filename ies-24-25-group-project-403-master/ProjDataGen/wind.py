from datetime import datetime
import math
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
logger = logging.getLogger("Wind Sensor")
logger.setLevel(logging.INFO)

class windSensor:

    def __init__(self, id, start_wind_speed=None,start_wind_direction=None ,sleep_time=10):
        # Load environment variables
        load_dotenv()
        
        # Get RabbitMQ configuration from environment variables
        self.rabbit_address = os.getenv('RABBITMQ_HOST', 'localhost')
        self.rabbit_port = int(os.getenv('RABBITMQ_PORT', '5672'))
        self.rabbit_user = os.getenv('RABBITMQ_USERNAME', 'myuser')
        self.rabbit_pass = os.getenv('RABBITMQ_PASSWORD', 'secret')
        self.wind_direction="NW"

        if start_wind_speed is None:
            self.start_wind_speed = 18  # Velocidade do vento inicial aleatória entre 0 e 200 km/h
        else:
            self.start_wind_speed = start_wind_speed
        if start_wind_direction is None:
            self.start_wind_direction = "NW"
        else:
            self.start_wind_direction = start_wind_direction

        self.sleep_time = sleep_time
        self.type = 'WIND'
        self.id = id
        self.value = self.start_wind_speed
        self.unit = 'km/h'

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


    def generate_wind_speed(self, hour, minute):
        """Gera a velocidade do vento baseada na hora e no minuto do dia."""
        speed_media = 20.0 
        amplitude = 18.0   
        ruido_base = 0.4   
        rajada_chance = 0.2 
        rajada_intensidade = 25.0  

        time_fraction = hour + minute / 60.0
        velocidade = speed_media + amplitude * math.sin((time_fraction - 15) * math.pi / 12)

        velocidade += random.uniform(-ruido_base, ruido_base)
        if random.random() < rajada_chance:
            velocidade += random.uniform(0, rajada_intensidade)

     
        return round(max(0.0, min(velocidade, 80.0)),2)
    def run(self):
        try:
            count=0
            while True:
                now = datetime.now()
                current_hour = now.hour
                count+=1
                current_minute = now.minute
                if count>60:
                    count=random.uniform(0, 30)
                    probability = random.random()
                    if probability <0.125:
                        self.wind_direction="N"
                    elif probability <0.25:
                        self.wind_direction="NE"
                    elif probability <0.375:
                        self.wind_direction="E"
                    elif probability <0.5:
                        self.wind_direction="SE"
                    elif probability <0.625:
                        self.wind_direction="S"
                    elif probability <0.75:
                        self.wind_direction="SW"
                    elif probability <0.875:
                        self.wind_direction="W"
                    else:
                        self.wind_direction="NW"
                self.value = self.generate_wind_speed(current_hour, current_minute)


                logger.info(f"Wind Speed: {self.value} {self.unit} Wind Direction: {self.wind_direction}")

                # Send data to RabbitM
                data = {
                    'type': self.type,
                    'id': self.id,
                    'value': self.value,
                    'unit': self.unit,
                    'direction': self.wind_direction,
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
    start_wind_speed = float(sys.argv[2]) if len(sys.argv) > 2 else None

    try:
        sensor = windSensor(id, start_wind_speed)
        sensor.run()
    except Exception as e:
        logger.error(f"Error running sensor: {e}")