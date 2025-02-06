## IpmaApiClient
    Responsável pela lógica remota da Api da parte do Cliente

## AnyCityForecast
    Responsável pela lógica de interação com o utilizador


### Para rodar o jar é importante isto no pom

    <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.8.1</version>
        <configuration>
          <source>21</source>
          <target>21</target>
        </configuration>
      </plugin>
    </plugins>
    </build>