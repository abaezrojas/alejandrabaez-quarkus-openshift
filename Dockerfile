# Multi-stage build en OpenShift
FROM registry.access.redhat.com/ubi9/openjdk-21:1.23 AS builder

WORKDIR /build

# Variables de entorno para compilación
ENV MAVEN_OPTS="-Xmx512m -XX:+UseG1GC"

# Copiar solo lo necesario para resolver dependencias
COPY pom.xml .
COPY .mvn/ .mvn/
COPY mvnw .

# Copiar código fuente
COPY src/ src/
COPY mi-frontend/ mi-frontend/

# Compilar con bash para evitar problemas de permisos
RUN bash mvnw -q clean package -DskipTests 2>&1

# Stage final - Runtime
FROM registry.access.redhat.com/ubi9/openjdk-21:1.23

ENV LANGUAGE='en_US:en'
WORKDIR /deployments

# Copiar artifacts compilados
COPY --from=builder /build/target/quarkus-app/lib/ /deployments/lib/
COPY --from=builder /build/target/quarkus-app/*.jar /deployments/
COPY --from=builder /build/target/quarkus-app/app/ /deployments/app/
COPY --from=builder /build/target/quarkus-app/quarkus/ /deployments/quarkus/

EXPOSE 8080
USER 185
ENV JAVA_OPTS_APPEND="-Dquarkus.http.host=0.0.0.0 -Djava.util.logging.manager=org.jboss.logmanager.LogManager"
ENV JAVA_APP_JAR="/deployments/quarkus-run.jar"

ENTRYPOINT [ "/opt/jboss/container/java/run/run-java.sh" ]
