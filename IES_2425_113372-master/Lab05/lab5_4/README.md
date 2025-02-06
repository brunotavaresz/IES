Producer em Python (Geração de Citações)

    O script Python é responsável por gerar novas quotes aleatórias para filmes a cada 10 segundos e enviá-las para um Kafka topic.


A aplicação Spring Boot foi estendida para consumir as quotes enviadas para o Kafka topic e armazená-las no banco de dados.

a aplicação foi configurada para expor um WebSocket para o frontend, permitindo que as citações sejam enviadas para o navegador em tempo real.


No frontend em React, principais funcoes

    Exibir as últimas quotes recebidas.
    Atualizar a lista de quotes sem a necessidade de um refresh no navegador, usando WebSockets.

Para rodar toda a aplicação em containers Docker, foi criado um arquivo docker-compose.yml, que tem os serviços de Kafka, Spring Boot e a aplicação React. (docker-compose up)
 

O frontend React estará disponível em http://localhost:3000.

A API Spring Boot estará disponível em http://localhost:8080.