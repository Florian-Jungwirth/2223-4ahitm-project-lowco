#EXPERIMENTAL
#Milos again, This shuold work in theory however I just don't know what Joshuas gonna do with this so this is as much as I'm gonna do tbh
#If you want to try this out, put the files in mavenCacheEXP into the root directory

# Base image with Maven to cache dependencies
FROM maven:3.8.4-openjdk-17 AS maven-cache

WORKDIR /app

# Copy only the pom.xml to cache dependencies
COPY ../pom.xml .
RUN mvn dependency:go-offline -B

# Continue building the image using this cache...
# Copy the rest of your project files and build the application

COPY .. .
RUN mvn package -DskipTests

# PostgreSQL setup
FROM postgres:14

# Copy setup files to the container
COPY ./setup-scripts /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432