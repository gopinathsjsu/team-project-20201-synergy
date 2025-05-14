# SYNERGY - BookTable

## Team Members
- Rajeev Ranjan Chaurasia
- Tushar Singh
- Jeevan Kurian

*(Consider linking to individual GitHub profiles if desired, e.g., [Rajeev Ranjan Chaurasia](https://github.com/rajeev-chaurasia))*

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture & Design](#architecture--design)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [CI/CD](#cicd)
- [Project Journals & Documentation](#project-journals--documentation)
- [Contributing](#contributing)
- [XP Core Values](#xp-core-values)

## Project Overview
SYNERGY, also known as BookTable, is a comprehensive online platform designed to streamline the restaurant reservation process for customers. It also provides restaurant managers with tools to manage their establishments and administrators with oversight capabilities. The system aims to enhance the dining experience by offering features like location-based search, real-time booking, user profiles, and a review system.

## Features
-   **User Authentication:** Secure login and registration using AWS Cognito, featuring One-Time Password (OTP) for enhanced security.
-   **Restaurant Discovery:**
    -   Advanced search functionality with location-based queries (leveraging MySQL spatial functions and Google Maps API for geocoding).
    -   Nearby restaurant suggestions.
    -   View restaurant locations on Google Maps.
-   **Booking Management:**
    -   Seamless restaurant booking and cancellation flow.
    -   Real-time conflict detection for user bookings.
    -   Automated email notifications for booking confirmations and cancellations via AWS SES, using Thymeleaf for templating.
-   **User Experience:**
    -   Personalized customer homepage.
    -   Customer profile page to view and manage bookings.
    -   Intuitive UI for viewing restaurant details and available time slots.
-   **Restaurant Management Portal:**
    -   Restaurant managers can add and update restaurant details.
    -   Secure image uploads to AWS S3 using pre-signed URLs.
    -   Dashboard for managers to view and manage their establishments.
-   **Admin Portal:**
    -   Admin dashboard with analytics on reservation trends and popular restaurants.
    -   Restaurant approval and rejection workflow.
    -   Ability for admins to remove restaurants from the platform.
-   **Ratings and Reviews:**
    -   Users can submit ratings and reviews for restaurants.
    -   Display of average ratings and individual review comments.

## Tech Stack
-   **Frontend:** Next.js, React, Material-UI (MUI)
-   **Backend:** Spring Boot (Java 17), Gradle
-   **Database:** MySQL
-   **Authentication & Authorization:** AWS Cognito (JWTs via Spring Security OAuth2 Resource Server, OTP, Role-Based Access Control via `cognito:groups`)
-   **Cloud Services:**
    -   **Compute:** AWS Elastic Beanstalk (managing EC2, Load Balancers, Auto Scaling Groups)
    -   **Containerization:** Docker
    -   **Container Registry:** Amazon ECR (Elastic Container Registry)
    -   **Storage:** AWS S3 (Simple Storage Service for file storage like restaurant photos)
    -   **Email:** AWS SES (Simple Email Service)
    -   **Functions:** AWS Lambda (for custom Cognito authentication challenges)
-   **APIs & External Services:**
    -   Google Maps GeoAPI (Geocoding, Maps Display)
-   **Email Templating:** Thymeleaf

## Architecture & Design
Our project follows a RESTful API architecture with a modular design for both frontend and backend components. The backend is organized by feature and layer (controllers, services, repositories, etc.), while the frontend utilizes a component-based structure with React/Next.js.

Key architectural decisions include:
-   Use of AWS Cognito for managed authentication and user pool management.
-   JWTs passed via HTTP-only cookies (`api-token`) for secure session management.
-   Role-based access control (CUSTOMER, RESTAURANT_MANAGER, ADMIN) enforced via Cognito groups.
-   Deployment to AWS Elastic Beanstalk for a scalable and managed PaaS environment.
-   Containerization with Docker for consistency across environments.

For a detailed breakdown of our design choices, technologies, and architectural patterns, please see our **[Design Decisions Document](https://www.google.com/search?q=./project-journal/design-decision.md)**.

*(If you have a deployment diagram image file in your repository, for example, at `documentation/deployment-diagram.png`, you can embed it here. Make sure the path is correct relative to the README.md file at the root of your repository.)*
## Getting Started

### Prerequisites
-   Node.js (e.g., v18.x or v20.x - check `open-table-frontend/package.json` for specific engine requirements if any)
-   JDK 17 (or compatible Java 17 SDK)
-   Gradle (the project uses Gradle wrapper, so it will be downloaded automatically if not present globally)
-   Docker
-   AWS CLI (configured with necessary credentials and default region)
-   Access to a MySQL database instance.

**Environment Variables:**
Before running the application, you need to set up environment variables for both the backend and frontend.
-   **Backend (`backend/bookTable/src/main/resources/application.properties`):**
    -   `DB_URL`
    -   `DB_USERNAME`
    -   `DB_PASSWORD`
    -   `AWS_ACCESS_KEY_ID`
    -   `AWS_SECRET_ACCESS_KEY`
    -   `AWS_REGION`
    -   `SPRING_SECURITY_OAUTH2_JWT_ISSUER_URI` (e.g., `https://cognito-idp.us-west-1.amazonaws.com/YOUR_USER_POOL_ID`)
    -   `AWS_COGNITO_USER_POOL_ID`
    -   `AWS_COGNITO_CLIENT_ID`
    -   `AWS_COGNITO_CLIENT_SECRET`
    -   `AWS_COGNITO_REGION`
    -   `AWS_S3_BUCKET`
    -   `GOOGLE_API_KEY`
    -   `APP_BASE_URL` (e.g., `http://localhost:3000`)
    -   `AWS_SES_FROM_EMAIL`
-   **Frontend (`open-table-frontend/.env.local`):**
    -   `NEXT_PUBLIC_BASE_URL` (URL of your backend, e.g., `http://localhost:8080`)
    -   `NEXT_PUBLIC_PLACES_API_KEY` (Your Google Maps API Key)

### Backend Setup
```bash
# Navigate to the backend directory
cd backend/bookTable

# Grant execution permission to Gradle wrapper (if needed)
chmod +x ./gradlew

# Build the project (this will also run tests and generate coverage reports)
./gradlew clean build

# Run the application (ensure environment variables are set as per application.properties)
./gradlew bootRun
# Alternatively, run the built JAR from build/libs/
# java -jar build/libs/bookTable-*.jar
