# Step 1: Build the project
FROM maven:3.9.4-eclipse-temurin-21 AS build

WORKDIR /app
COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# Debug: List files in /app/target to verify the jar file is generated
RUN ls -l /app/target

# Step 2: Run the application
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the correct jar file from build stage
COPY --from=build /app/target/sharenest-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Set environment variable (can be overridden later)
ENV JWT_SECRET=ChangeThisSecretKeyForProduction

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
