import sys, types
from kafka import KafkaProducer
import json

m = types.ModuleType('kafka.vendor.six.moves', 'Mock module')
setattr(m, 'range', range)
sys.modules['kafka.vendor.six.moves'] = m

# Configuração do Kafka
bootstrap_servers = 'localhost:29092'
topic_name = 'lab05_113372'  
nMec = 113372 

producer = KafkaProducer(
    bootstrap_servers=bootstrap_servers,
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

# sequência de Fibonacci até um valor máximo
def generate_fibonacci_sequence(limit):
    sequence = []
    a, b = 0, 1
    while a <= limit:
        sequence.append(a)
        a, b = b, a + b
    return sequence

# sequência de Fibonacci até o nMec
fibonacci_sequence = generate_fibonacci_sequence(nMec)

# Enviar mensagens para o Kafka
try:
    for number in fibonacci_sequence:
        message = {'nMec': str(nMec), 'generatedNumber': number, 'type': 'fibonacci'}
        producer.send(topic_name, message)
        print(f"Mensagem enviada: {message}")

    producer.flush()
except Exception as e:
    print(f"Erro ao enviar mensagem: {e}")
finally:
    producer.close()
