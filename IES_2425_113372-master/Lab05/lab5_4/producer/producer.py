from kafka import KafkaProducer
import json
import time
import random
from datetime import datetime
import logging
import requests
import os

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

bootstrap_servers = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'kafka:29092')
topic_name = 'quotes_topic'
API_URL = os.getenv('API_URL', 'http://app1:8080/movies')

quotes = [
    {
        "quote": "To infinity and beyond!",
        "character": "Buzz Lightyear"
    },
    {
        "quote": "There's no place like home",
        "character": "Dorothy Gale"
    },
    {
        "quote": "I'll have what she's having",
        "character": "Customer (When Harry Met Sally)"
    },
    {
        "quote": "Why so serious?",
        "character": "The Joker"
    },
    {
        "quote": "You can't handle the truth!",
        "character": "Colonel Jessup"
    }
]


def get_movie_ids():
    """Fetch all movie IDs from the API"""
    try:
        response = requests.get(API_URL)
        if response.status_code == 200:
            movies = response.json()
            return [movie['movieId'] for movie in movies]
        else:
            log.error(f"Failed to fetch movies. Status code: {response.status_code}")
            return []
    except requests.RequestException as e:
        log.error(f"Error fetching movies: {str(e)}")
        return []

def serialize_message(message):
    """Serialize message to JSON string"""
    return json.dumps(message).encode('utf-8')

try:
    producer = KafkaProducer(
        bootstrap_servers=bootstrap_servers,
        value_serializer=serialize_message
    )
    
    log.info("Started producing quotes")
    
    while True:
        movie_ids = get_movie_ids()
        
        if not movie_ids:
            log.error("No movies available")
            time.sleep(10)
            continue
        
        quote = random.choice(quotes)
        quote['movieId'] = random.choice(movie_ids)
        
        future = producer.send(topic_name, value=quote)
        
        record_metadata = future.get(timeout=10)
        
        log.info(f"Quote sent to {record_metadata.topic} "
                f"[partition: {record_metadata.partition}, offset: {record_metadata.offset}]")
        log.info(f"Quote: {quote}")
        
        time.sleep(10) # Sleep for 10 seconds

except KeyboardInterrupt:
    log.info("Stopping...")
except Exception as e:
    log.error(f"Error: {str(e)}")
finally:
    if 'producer' in locals():
        producer.close()
        log.info("Producer closed")