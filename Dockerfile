# Build stage - Compile con memoria limitada
FROM registry.access.redhat.com/ubi9/openjdk-21:1.23 AS builder

WORKDIR /build

# Establecer opciones de Maven para memoria limitada
ENV MAVEN_OPTS="-Xmx512m -XX:+UseG1GC -XX:MaxGCPauseMillis=200"

# Copiar pom.xml y build wrapper
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn/

# Copiar código fuente
COPY src ./src
COPY mi-frontend ./mi-frontend

# Build con memoria limitada - skip tests
RUN chmod +x ./mvnw && \
    ./mvnw clean package -DskipTests -q && \
    ls -la target/quarkus-app/

# Runtime stage - Imagen final
FROM registry.access.redhat.com/ubi9/openjdk-21:1.23

ENV LANGUAGE='en_US:en'

WORKDIR /deployments

# Copiar artifacts del builder
COPY --from=builder /build/target/quarkus-app/lib/ /deployments/lib/
COPY --from=builder /build/target/quarkus-app/*.jar /deployments/
COPY --from=builder /build/target/quarkus-app/app/ /deployments/app/
COPY --from=builder /build/target/quarkus-app/quarkus/ /deployments/quarkus/

EXPOSE 8080
USER 185
ENV JAVA_OPTS_APPEND="-Dquarkus.http.host=0.0.0.0 -Djava.util.logging.manager=org.jboss.logmanager.LogManager"
ENV JAVA_APP_JAR="/deployments/quarkus-run.jar"

ENTRYPOINT [ "/opt/jboss/container/java/run/run-java.sh" ]
