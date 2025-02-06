Receber Mensagens do Producer Python

    A aplicação Spring Boot foi configurada para mensagens do tópico lab05_113372, que é o mesmo tópico utilizado pelo produtor Python.

Capacidade de Enviar e Receber Mensagens

    A aplicação foi configurada com um KafkaProducer e um KafkaConsumer para enviar e receber mensagens entre o Spring Boot e o consumidor Python. 

A classe Message é a estrutura de dados utilizada para armazenar as informações enviadas no formato JSON, que serão deserializadas pelo Spring Kafka.

O KafkaProducer é responsável por enviar mensagens para o Kafka, usando o KafkaTemplate. A mensagem é enviada para o tópico configurado (lab05_113372).

No KafkaConsumer o @KafkaListener é usado para as mensagens de um tópico específico (lab05_113372) e processa-as.

O arquivo application.properties foi configurado para conectar a aplicação Spring Boot ao servidor Kafka e configurar os serializadores e deserializadores adequados.


![alinea_a)](../images/lab05_3_a.png)

![alinea_b)](../images/lab05_3_b.png)

![alinea_d)](../images/lab05_3_d.png)