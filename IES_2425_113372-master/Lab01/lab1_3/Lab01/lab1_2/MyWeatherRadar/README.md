## 1.3 Gestão de Código Fonte usando Git

### Introdução ao git
O Git é um sistema de controlo de versão que permite manter um histórico completo das alterações feitas no nosso projeto.

## Inicialização de um Repositório

    git init: Inicializa um novo repositório Git local.

## Commits

    git add <arquivo>: Adiciona alterações de arquivos ao staging area.
    git add .: Adiciona todas as alterações de arquivos ao staging area.
    git commit -m "Mensagem do Commit": Cria um novo commit com as alterações no staging area.

## Status

    git status: Exibe o status atual do repositório.
    git log: Exibe o histórico de commits.
    git diff: Exibe as diferenças entre as alterações no working directory e o último commit.

## Ramificação

    git branch: Lista todas as ramificações.
    git branch <nome_da_ramificação>: Cria uma nova ramificação.
    git checkout <nome_da_ramificação>: Altera para uma ramificação existente.
    git merge <nome_da_ramificação>: Mescla as alterações de uma ramificação em outra.
    git branch -d <nome_da_ramificação>: Exclui uma ramificação.

## Clone

    git clone <url_do_repositório>: Clona um repositório Git remoto.
    git pull: Puxa as atualizações do repositório remoto.
    git push: Empurra os commits locais para o repositório remoto.

## .gitignore:

    ## maven
    target/
    log/
    pom.xml.tag
    pom.xml.releaseBackup
    pom.xml.versionsBackup
    pom.xml.next
    release.properties
    dependency-reduced-pom.xml
    buildNumber.properties
    .mvn/timing.properties
    .mvn/wrapper/maven-wrapper.jar

    ## Mac
    .DS_Store
    ...
    ...

Usei um template fornecido do guião para facilitar.

##
Na localização2, adiciona uma nova funcionalidade: suporte de logging usando Log4j 2.

A aplicação deve escrever logs para acompanhar operações e problemas.
    Utiliza uma biblioteca de logging como Log4j 2

        <?xml version="1.0" encoding="UTF-8"?>
        <Configuration status="WARN" monitorInterval="30">

        <!-- Logging Properties -->
        <Properties>
            <Property name="LOG_PATTERN">%d{yyyy-MM-dd'T'HH:mm:ss.SSSZ} %p %m%n</Property>
            <Property name="APP_LOG_ROOT">log</Property>
        </Properties>
            
        <Appenders>
            <RollingFile name="infoLog" fileName="${APP_LOG_ROOT}/app-info.log"
                filePattern="${basePath}/app-%d{yyyy-MM-dd}.log">
            <PatternLayout>
                <pattern>[%-5level] %d{yyyy-MM-dd HH:mm:ss.SSS} [%t] %c{1} - %msg%n</pattern>
            </PatternLayout>
            <Policies>
                <TimeBasedTriggeringPolicy interval="1" modulate="true" />
                <SizeBasedTriggeringPolicy size="10MB" />
            </Policies>
            <!-- Max 10 files will be created everyday -->
            <DefaultRolloverStrategy max="10">
                <Delete basePath="${basePathr}" maxDepth="10">
                <!-- Delete all files older than 30 days -->
                <IfLastModified age="30d" />
                </Delete>
            </DefaultRolloverStrategy>
            </RollingFile>
        </Appenders>
        <Loggers>
                <Root level="info" additivity="false">
                    <appender-ref ref="infoLog" />
                </Root>
            </Loggers>
        </Configuration>