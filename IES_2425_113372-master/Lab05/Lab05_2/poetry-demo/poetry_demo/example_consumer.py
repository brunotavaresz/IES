import sys
import sys, types

m = types.ModuleType('kafka.vendor.six.moves', 'Mock module')
setattr(m, 'range', range)
sys.modules['kafka.vendor.six.moves'] = m

from kafka import KafkaConsumer, TopicPartition

# Kafka Configuration
bootstrap_servers = 'localhost:29092'  # Replace with your Kafka broker address
topic_name = 'lab05_113372'  # Replace with the topic you want to consume from

# Create a Kafka consumer instance
consumer = KafkaConsumer(
    topic_name,
    bootstrap_servers=bootstrap_servers,
    enable_auto_commit=True,
    auto_offset_reset='earliest'  # Start consuming from the beginning of the topic if no offset is stored
)
PARTITIONS = []
for partition in consumer.partitions_for_topic(topic_name):
    PARTITIONS.append(TopicPartition(topic_name, partition))
    
end_offsets = consumer.end_offsets(PARTITIONS)
print(end_offsets)

# Consume messages
for message in consumer:
    print(f"Received message: {message.value.decode('utf-8')}")  # Decode message from bytes