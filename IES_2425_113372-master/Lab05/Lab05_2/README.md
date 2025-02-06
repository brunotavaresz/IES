Arquivo: example_producer.py

    O produtor faz uma sequência de Fibonacci no Kafka até o valor de nMec, neste formato

        {
            "nMec": "113372",
            "generatedNumber": 0,
            "type": "fibonacci"
        }

    para gerar os numeros fibonacci ate ao nmec usa esta função generate_fibonacci_sequence(nMec)


Arquivo: example_consumer.py

    O consumidor lê todas as mensagens do tópico desde o início e exibe as informações no formato

        Received message: nMec=113372, generatedNumber=0, type=fibonacci


para rodar é preciso usar o poetry shell ( tive que mudar a versao para python 3.10 )

importante tambem criar o topico antes no kafka