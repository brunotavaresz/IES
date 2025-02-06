
## Dockerfile

```
FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp
COPY target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

## Docker commands

### Build the image


```bash
docker build -t movie_quote_api .
```

### Run the image

```bash
docker run --network=host  -p 8080:8080 movie_quote_api
```

### Structure

* *Controller*
    * *Controller*
* *Service*
    * *Serv*
* *Repositories*
    * *MovieRepository*
    * *QuoteRepository*
* *Entities*
    * *Movie*
    * *Quote*
    * *NewQuote*


#### Comtroller & Service
The controller handles HTTP requests, calling the service layer to handle the persistence logic. 


#### Repository & Entities
Data is stored in the repositories, using both the *Movie* and the *Quote* class.  
The *NewQuote* class is an auxiliary class for the persistence logic. No data is stored in that form.
