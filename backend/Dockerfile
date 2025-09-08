# Step 1: Build the project
FROM maven:3.9.4-eclipse-temurin-21 AS build

WORKDIR /app
COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# Step 2: Run the application
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the built jar from the previous stage
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Set environment variable (optional, can be overridden in Render settings)
ENV JWT_SECRET=ChangeThisSecretKeyForProduction

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
