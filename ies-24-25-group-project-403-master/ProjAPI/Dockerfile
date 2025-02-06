# Etapa de Build
FROM maven:3.9.9 AS build

WORKDIR /ProjAPI

COPY pom.xml .

RUN mvn dependency:go-offline

COPY src ./src

RUN mvn package -DskipTests

# Etapa de Execução
FROM openjdk:21-jdk-slim

WORKDIR /ProjAPI

COPY --from=build /ProjAPI/target/*.jar ./app.jar

EXPOSE 8080

COPY run.sh run.sh
RUN ["chmod", "u+x", "./run.sh"]

CMD ["./run.sh"]
