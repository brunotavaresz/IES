## Java Spring Boot
O Java Spring Boot é uma ferramenta open source que simplifica a utilização de estruturas baseadas em Java para criar microsserviços e aplicações Web.

## Spring Initialzr
O Spring initializr é uma das maneiras para iniciar um projeto Spring Boot.

Há várias de forma de começar o projeto Spring Boot mas eu preferi usar a extensão do vscode do SpringInitialzr pois acho que é mais prático e tem como vantagens colocar as dependencias automaticamente no pom por exemplo.

## Executar código

    ./mvnw spring-boot:run

## Informação util desta alinea
### Alterar a app porta

Alterar as configurações do servidor embutido do Spring Boot é muito simples. Basta adicionar a seguinte linha no arquivo application.properties:
    
    server.port=8081

o arquivo application.properties no meu caso encontra-se neste path:

    lab2_3/target/classes/application.properties