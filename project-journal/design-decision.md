# Design Decisions
This document outlines the key design and architectural decisions made for this project.

---

## 1. Technology Stack

### Frontend
* **Technology**: Next.js, React
* **UI Library**: Material-UI (MUI)
* **Rationale**: *Component-based architecture (React), server-side rendering and routing (Next.js), pre-built UI components (Material-UI), large community support, team familiarity, etc.*

### Backend
* **Framework**: Spring Boot (Java 17)
* **Build Tool**: Gradle
* **Rationale**: *Robust framework for Java, scalability, extensive ecosystem, ease of creating RESTful services, strong community support, team expertise, etc.*

### Database
* **Type**: MySQL
* **Rationale**: *Relational integrity, ACID properties, performance needs, team familiarity, cost, existing infrastructure, data relationships, etc.*

---

## 2. Architecture

### API Design
* **Style**: RESTful APIs
* **CORS Configuration**: Enabled for frontend
* **Rationale**: *Standardization, statelessness, cacheability, suitability for client-server communication, ease of consumption by frontend, widely supported by tools and libraries, etc.*

### Modularity
* **Backend**: Organized by feature and layer (controllers, services, repositories, configs, models, mappers, utils, validators).
* **Frontend**: Component-based structure (React/Next.js).
* **Rationale**: *Separation of concerns, maintainability, testability, reusability, team collaboration, scalability of development, etc.*

---

## 3. Authentication & Authorization

* **Service**: AWS Cognito
* **Mechanism**: JWT (JSON Web Tokens) via Spring Security OAuth2 Resource Server.
    * **Details**: Tokens passed via HTTP-only cookies (`api-token`).
* **OTP (One-Time Password)**: Implemented for login/authentication.
* **Role-Based Access Control (RBAC)**: Uses `cognito:groups` for roles (CUSTOMER, RESTAURANT_MANAGER, ADMIN).
* **Rationale**: *Managed authentication service (Cognito benefits), industry-standard token format (JWT), security of HTTP-only cookies, multi-factor authentication capability (OTP), granular access control (RBAC), scalability of user management, etc.*

---

## 4. Cloud Provider & Services

### Primary Provider
* **Provider**: AWS (Amazon Web Services)

### Compute
* **Service**: AWS Elastic Beanstalk
* **Rationale**: *PaaS benefits, ease of deployment, scalability, managed environment, integration with other AWS services, reduced operational overhead compared to raw EC2, etc.*

### Containerization
* **Technology**: Docker
* **Container Registry**: Amazon ECR (Elastic Container Registry)
* **Rationale**: *Environment consistency across development, testing, and production; deployment efficiency; scalability; microservices-readiness; integration with ECR and Elastic Beanstalk, etc.*

### Storage
* **Service**: AWS S3 (Simple Storage Service)
    * **Purpose**: File storage (e.g., restaurant photos).
* **Rationale**: *Durability, scalability, cost-effectiveness, integration with other AWS services, ease of use for static assets, pre-signed URLs for secure uploads/downloads, etc.*

### External Services (Non-AWS)
* **Geocoding/Maps**: Google Maps GeoAPI
* **Rationale**: *Accuracy, feature set (geocoding, maps display), developer familiarity, API limits, cost, etc.*

### Infrastructure as Code (IaC)
* **Approach**: AWS Elastic Beanstalk manages infrastructure provisioning based on environment configuration.
    * **Note**: This differs from using a dedicated IaC tool like Terraform.
* **Rationale**: *Simplicity for common web application patterns, speed of deployment, AWS integration, team expertise, etc.*

---

## 5. CI/CD Pipeline

* **Platform**: GitHub Actions
* **Code Scanning**: GitHub CodeQL
* **Rationale**: *Automation benefits (build, test, deploy), integration with GitHub, consistency, speed of delivery, automated quality gates (tests, coverage, static analysis), etc.*

---

## 6. Email Service Integration

* **Service**: AWS Simple Email Service (SES)
* **Templating**: Thymeleaf
* **Rationale**: *Scalability of email sending, reliability, cost-effectiveness (especially if already in AWS ecosystem), deliverability, API features for integration. For Thymeleaf: server-side templating, integration with Spring Boot, dynamic email content, maintainability of templates, etc.*

---
