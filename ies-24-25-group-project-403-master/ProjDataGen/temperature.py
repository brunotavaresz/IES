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
logger = logging.getLogger("Temperature Sensor")
logger.setLevel(logging.INFO)

class tempSensor:

   def __init__(self, id, start_temp=None, sleep_time=10):
       # Load environment variables
       load_dotenv()
       
       # Get RabbitMQ configuration from environment variables
       self.rabbit_address = os.getenv('RABBITMQ_HOST', 'localhost')
       self.rabbit_port = int(os.getenv('RABBITMQ_PORT', '5672'))
       self.rabbit_user = os.getenv('RABBITMQ_USERNAME', 'myuser')
       self.rabbit_pass = os.getenv('RABBITMQ_PASSWORD', 'secret')

       if start_temp is None:
           self.start_temp = 17.0
       else:
           self.start_temp = start_temp

       self.sleep_time = sleep_time
       self.type = 'TEMPERATURE'
       self.id = id
       self.value = self.start_temp
       self.unit = '°C'

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
           
           # Keep original queue name
           self.queue_name = 'BeachControl'
           self.channel.queue_declare(queue=self.queue_name, durable=True)
           
       except pika.exceptions.AMQPConnectionError as error:
           logger.error(f"Failed to connect to RabbitMQ: {error}")
           raise

   def generate_temperature(self, hour, minute):
       """Generates temperature based on time of day."""
       temp_media = 13.0
       amplitude = 11.0
       ruido = 0.05
       hora_pico = 8

       temperatura = temp_media + amplitude * math.sin((hour - hora_pico) * math.pi / 12)
       temperatura += (math.sin(minute * math.pi / 30) * 0.5)
       temperatura += random.uniform(-ruido, ruido)

       return round(max(-50.0, min(temperatura, 50.0)),2)


   
   def run(self):
       try:
           while True:
               now = datetime.now()
               current_hour = now.hour
               current_minute = now.minute

               self.value = self.generate_temperature(current_hour, current_minute)

               logger.info(f"Temperature: {self.value:.1f} °C")
               
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
           logger.info("\nStopping temperature sensor...")
       except pika.exceptions.AMQPConnectionError as error:
           logger.error(f"Lost connection to RabbitMQ: {error}")
       finally:
           if self.connection and not self.connection.is_closed:
               self.connection.close()
               logger.info("Closed RabbitMQ connection")

if __name__ == '__main__':
   id = sys.argv[1]
   start_temp = float(sys.argv[2]) if len(sys.argv) > 2 else None

   try:
       sensor = tempSensor(id, start_temp)
       sensor.run()
   except Exception as e:
       logger.error(f"Error running temperature sensor: {e}")