## Servlet
O Servlet é uma classe Java que é executada em um servidor web. Ela recebe requests e dá respostas com base nessa requisição. É uma interface padrão para a criação de aplicações web.

Para usar o Servlet, é necessário criar uma classe que extenda a classe HttpServlet. Essa classe deve sobrescrever os métodos doGet e doPost, que são os métodos que recebem as requisições GET e POST, respectivamente.

## Classe EmbeddedJetty
    - Configura um servidor Jetty porta 8680
    - Cria o ServletHandler para lidar com solicitações HTTP
    - Dá start do servidor Jetty e espera até que ser fechado

## Classe HelloServlet
    - Implementa a lógica para responder a solicitações HTTP GET 
    - Se a mensagem for diferente de null, imprime a mensagem recebida
    - Se a mensagem for null imprime "New Hello Simple Servlet"

http://127.0.0.1:8680 print a default message

http://127.0.0.1:8680/?msg=”Hard workers welcome!” print the msg parameter

Coloquei estas classes todas no mesmo ficheiro path: lab2_1/src/main/java/ies/EmbeddedJetty.java

