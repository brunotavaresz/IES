### Comandos Básicos do Docker

- `docker pull`: Descarrega uma imagem Docker de um repositório, como o Docker Hub.
  
- `docker build`: Constrói uma imagem Docker a partir de um Dockerfile.

- `docker run`: Cria e inicia um novo container a partir de uma imagem. Você pode especificar portas, volumes e outras configurações.

- `docker ps`: Lista todos os containers em execução no sistema.

- `docker stop`: Para a execução de um container em execução.

- `docker rm`: Remove um container.

- `docker images`: Lista todas as imagens disponíveis no sistema.

- `docker rmi`: Remove uma imagem.

- `docker exec`: Executa um comando em um container em execução.


## 
O Docker é uma plataforma de virtualização de containers que simplifica o processo de criação, implantação e execução de apps em ambientes isolados e padronizados conhecidos como containers.
##


Imagem (Image): Uma imagem Docker é um pacote executável que inclui todo o necessário para executar um aplicativo, incluindo código, bibliotecas, dependências e configurações.

Container: Um Container Docker é uma instância em execução de uma imagem Docker. Os Container são isolados uns dos outros e da máquina host.

Dockerfile: Um Dockerfile é um arquivo de configuração que define como uma imagem Docker deve ser construída. Ele lista as instruções para instalar software, copiar arquivos e configurar o ambiente.

## Esta alinea
O Dockerfile descreve como construir a imagem Docker para a tua aplicação Flask, incluindo a instalação das dependências e a configuração do ambiente.

    Define /code como o local onde os arquivos da aplicação serão armazenados no container

    Instala as bibliotecas listadas no ficheiro requirements.txt

    Expõe a porta 5000 para que a aplicação possa ser acessada a partir de fora do container

    entre outras funcionalidades...

    code:
        # syntax=docker/dockerfile:1
        FROM python:3.10-alpine
        WORKDIR /code
        ENV FLASK_APP=app.py
        ENV FLASK_RUN_HOST=0.0.0.0
        RUN apk add --no-cache gcc musl-dev linux-headers
        COPY requirements.txt requirements.txt
        RUN pip install -r requirements.txt
        EXPOSE 5000
        COPY . .
        CMD ["flask", "run", "--debug"]


O ficheiro docker-compose.yml define como os serviços (containers) serão usados. No caso desta alinea, tenho dois serviços: o serviço web (Flask) e o Redis. Este ficheiro cria e conecta os containers necessários.

    services:
    web:
        build: .
        ports:
        - "8001:5000"
    redis:
        image: "redis:alpine"

ao fazer docker-compose up, oDocker Compose vai construir a imagem da minha aplicação Flask e lançar o container Flask (chamado web) e o container Redis.


