import os
from dotenv import load_dotenv
import pika
import requests
import logging
from multiprocessing import Process
import json
from datetime import datetime, timezone, timedelta

# Load environment variables from .env file in the parent directory
dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env')
load_dotenv(dotenv_path)
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("DataHandler")
logger.setLevel(logging.INFO)

SENSOR_SCRIPTS = {
   "TEMPERATURE": "temperature",
   "HUMIDITY": "humidity",
   "WATER_TEMPERATURE": "waterTemperature",
   "CLOUD_COVERAGE": "cloudCoverage",
   "UV_INDEX": "uvIndex",
   "WIND": "wind",
   "PRECIPITATION": "precipitation",
   "POLUTANT": "polutant",
   "WAVE_HEIGHT": "waveHeight",
   "TIDE_HEIGHT": "tideHeight"
}
SENSORS = []
processes = {}  # Global dictionary to store processes
handler = None


class APIHandler:
    def __init__(self):
       # Load credentials and parameters from environment variables
       self.port = int(os.getenv('PORT', 8080))  
       self.baseUrl = os.getenv('BASE_URL', 'http://springboot')+":"+str(self.port)
       
       self.user = os.getenv('BEACHCONTROL_USER', 'admin@example.com') 
       self.password = os.getenv('PASSWORD', 'adminpassword')  
       self.token=''
       self.headers = {'Authorization': 'Bearer ' + self.token, 'Content-Type': 'application/json'}
       self.login()
   
    def login(self):
       url = self.baseUrl + "/apiV1/auth/login"
       logger.info("Logging in with user: "+self.user)
       logger.info("Password is: "+self.password)
       logger.info("URL: "+url)
       respones = requests.post(url, headers=self.headers, json={'email': self.user, 'password': self.password})
       
       if respones.status_code == 200:
           self.token = respones.json()['jwt']
           self.headers = {'Authorization': 'Bearer ' + self.token, 'Content-Type': 'application/json'}
           logger.info("Login success")
           return True
       else:
           logger.error("Login failed")
           logger.error("Error: "+str(respones.status_code))
           exit(1)

    def getAvailableDevices(self):
       url = self.baseUrl + "/apiV1/sensors?available=true"
       response = requests.get(url, headers=self.headers)
       if response.status_code == 200:
           return response.json()
       else:
           print("Error: "+str(response.status_code))
           exit(1)
           
    def getSensorLastData(self, sensorId):

        url = self.baseUrl + "/apiV1/sensors?id="+str(sensorId)
        response = requests.get(url, headers=self.headers)
        if response.status_code == 200:
            data=response.json().get("data")[0]
            if data["state"]["lastChecked"] is None:
                return None
            if datetime.now(timezone.utc)-datetime.fromisoformat(data["state"]["lastChecked"].replace('Z', '+00:00')) < timedelta(hours=1):
                return data["value"]
            else:
                return None
            
        else:
            print("Error: "+str(response.status_code))
            exit(1)

def run_sensor(id, type,startData):
    """Actually runs the sensor script."""
    if startData is None:
       os.system(f"python3 {type}.py {id}")
    else:
        os.system(f"python3 {type}.py {id} {startData}")

def startSensor(id, type,startData):
    """Starts a sensor process with the given id and type."""
    logger.info(f"Starting sensor with id: {id} and type: {type} with data: {startData}")
    process = Process(target=run_sensor, args=(id, type, startData))
    process.daemon = False  # Change to non-daemon process
    process.start()
    return process

def listen_for_commands():
   """Listens to RabbitMQ for start/stop commands."""
   try:
       # Create credentials object
       credentials = pika.PlainCredentials(
            username=os.getenv('RABBITMQ_DEFAULT_USER', 'myuser'),  # Match docker-compose
            password=os.getenv('RABBITMQ_DEFAULT_PASS', 'secret')
        )

       # Connection parameters with credentials
       parameters = pika.ConnectionParameters(
           host=os.getenv('RABBITMQ_HOST', 'rabbitmq'),
           port=int(os.getenv('RABBITMQ_PORT', '5672')),
           virtual_host='/',
           credentials=credentials
       )

       # Establish connection
       connection = pika.BlockingConnection(parameters)
       channel = connection.channel()

       # Declare queue
       channel.queue_declare(queue='sensor-control', durable=True)
       
       # Configure consumer
       channel.basic_consume(
           queue='sensor-control', 
           on_message_callback=process_control_message, 
           auto_ack=True
       )

       logger.info("Listening for sensor control messages...")
       channel.start_consuming()

   except pika.exceptions.AMQPConnectionError as error:
       logger.error(f"Failed to connect to RabbitMQ: {error}")
   except Exception as e:
       logger.error(f"Unexpected error: {e}")
   finally:
       try:
           if connection and not connection.is_closed:
               connection.close()
               logger.info("RabbitMQ connection closed")
       except NameError:
           pass
       
def process_control_message(ch, method, properties, body):
    try:
        global SENSORS, processes,handler
        sensor = json.loads(body)
        sensorId = sensor.get("sensorId")
        action = sensor.get("action")
        sensor_type = sensor.get("type")

        if not all([sensorId, action, sensor_type]):
            logger.error(f"Missing required fields in message: {sensor}")
            return

        if action == "start" and sensorId not in SENSORS:
            script_name = SENSOR_SCRIPTS.get(sensor_type)
            
            if script_name:
                lastData=handler.getSensorLastData(sensorId)
                process = startSensor(sensorId, script_name, lastData)
                processes[sensorId] = process
                SENSORS.append(sensorId)
            else:
                logger.error(f"Sensor type {sensor_type} not found")

        elif action == "stop" and sensorId in SENSORS:
            script_name = SENSOR_SCRIPTS.get(sensor_type)
            if sensorId in processes:
                logger.info(f"Stopping sensor {sensorId}")
                # Kill the process
                processes[sensorId].terminate()
                processes[sensorId].join(timeout=1.0)
                
                # Make sure the Python script is killed
                try:
                    os.system(f"pkill -f '{script_name}.py {sensorId}'")
                except Exception as e:
                    logger.error(f"Error killing process: {e}")
                # On some systems, you might need to use:
                # os.system(f"kill -9 $(ps aux | grep '{script_name}.py {sensorId}' | grep -v grep | awk '{{print $2}}')")
                
                del processes[sensorId]
                SENSORS.remove(sensorId)
                logger.info(f"Sensor {sensorId} stopped successfully")
            else:
                logger.error(f"Process for sensor {sensorId} not found")

    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON message received: {e}")
    except Exception as e:
        logger.error(f"Error processing message: {e}")

def main():
    global handler 
    handler = APIHandler()
    sensores = handler.getAvailableDevices()["data"]
      # Start the RabbitMQ listener in a separate process
    listener_process = Process(target=listen_for_commands)
    listener_process.start()
   
   
    for sensor in sensores:
       sensor_type = sensor["type"]
       script_name = SENSOR_SCRIPTS.get(sensor_type)
       
       if script_name:
           sensorId = sensor["sensorId"]
           startData=handler.getSensorLastData(sensorId)
           process = startSensor(sensorId, script_name, startData)
           processes[sensorId] = process
           SENSORS.append(sensorId)
       else:
           logger.error(f"Sensor type {sensor_type} not found")
    # Wait for the listener process to finish
    listener_process.join()



if __name__ == "__main__":
   main()