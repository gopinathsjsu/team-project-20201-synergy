# Use official openjdk image as base image
FROM openjdk:17-jdk-slim AS base

# Set working directory in container
WORKDIR /app

# Copy the jar file from the target folder to the container
COPY build/libs/bookTable-0.0.1-SNAPSHOT.jar app.jar

# Expose the port Spring Boot is running on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
