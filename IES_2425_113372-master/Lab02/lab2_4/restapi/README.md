# API REST para Quotes de Filmes/Shows

Para esta alinea, utilizei o Spring Boot. As dependências podem ser definidas no arquivo `pom.xml` (coloquei as dependencias pelo spring boot initializer automaticamente (Spring web)):

    <dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>

##
A classe Quote representa uma quote

A classe QuoteService fornece métodos para receber quotes e listas de shows

A classe QuoteController define os endpoints da API
##



## Links

Quote Aleatória: http://localhost:8080/api/quote

Lista de Shows: http://localhost:8080/api/shows

Quotes por Show: http://localhost:8080/api/quotes?show=Star%20Wars