## Tomcat

Server-side programming e servidores de aplicação, como o Tomcat, são conceitos essenciais no desenvolvimento de aplicações web. O Tomcat é um servidor de aplicações web de código aberto desenvolvido pela Apache Software Foundation, projetado para executar aplicações Java. É um servidor web que oferece suporte a servlets e fornece um ambiente de execução para aplicações web em Java.

### passo a passo desta alinea (usei vscode)

    - Criar aplicação Jakarta EE (iniciei dando download ao zip presente no guião) 
    - Implementei um servlet java que imprime uma mensagem personalizada com base em parâmetros passados na URL
    - Deploy do ficheiro .war
    - Configuração do docker-compose 
    - Depois fiz docker-compose up (para fazer isto só consegui dando um clique no botão direito em cima do arquivo do docker-compose, isto no vscode, pois no terminal não estava a conseguir)
    - Por fim acedemos ao endereço:
    
        http://localhost:8888/hello-servlet (error)
        http://127.0.0.1:8080/JakartaWebStarter-1.0-SNAPSHOT/hello-servlet (message)

    e verificamos os dois links num dará erro e no outro aparecerá a mensagem esperada