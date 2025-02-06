# MyWeatherRadar - Lab 1.2

## 1. Visão Geral
Este projeto utiliza o **Maven** para a automação do processo de build de uma aplicação Java que obtém previsões meteorológicas através da API do IPMA.

## 2. Estrutura do Projeto
A estrutura básica do projeto foi gerada usando o **Maven Archetype Quickstart**, que configura um projeto simples em Java.

Comando para gerar o projeto:
```bash
mvn archetype:generate -DgroupId=ies -DartifactId=lab1_2 -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
```


## 3. POM
O ficheiro pom.xml contém todas as configurações essenciais do projeto, incluindo as dependências necessárias.

```bash
versão:
<maven.compiler.release>17</maven.compiler.release>
```

Dependências Adicionadas

Foram adicionadas as bibliotecas necessárias para consumir a API e trabalhar com JSON:

    Retrofit: Usada para fazer requisições HTTP à API.
    Gson: Utilizada para converter as respostas da API em objetos Java.

```bash
<dependencies>
  <dependency>
    <groupId>com.squareup.retrofit2</groupId>
    <artifactId>retrofit</artifactId>
    <version>2.9.0</version>
  </dependency>
  <dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.11.0</version>
  </dependency>
</dependencies>
```