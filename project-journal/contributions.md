# 👥 Team Roles and Contributions

Our team worked collaboratively as full-stack developers, each taking ownership of specific features from design to deployment. Below is a summary of contributions, with particular emphasis on individual strengths and responsibilities.

---

## 👤 Tushar Singh – Full Stack Developer

Tushar focused significantly on frontend engineering, backend development, and integrating key user-facing functionalities, ensuring a seamless user experience from search to booking.

### 🚀 Key Contributions

* **UI Development & Frontend Engineering:**
    * Engineered and implemented a comprehensive UI Project Setup, including the **Dockerization of the frontend (Next.js/React) repository** for streamlined deployment and development.
    * Developed intuitive **Login and Registration UI components**.
    * Designed and implemented dynamic **Restaurant Search Functionality UI**, featuring robust integration with the **Google Maps API** for location-based searching and display.
    * Created an engaging **Customer Homepage UI** and integrated functionality for accessing the user's nearby location for personalized experiences.
    * Developed a user-centric **Customer Profile Page** and implemented **Restaurant Cards display** for clear information presentation.
    * Enabled users to **View Restaurant Locations directly on Google Maps** from the UI.

* **Backend Development & API Integration:**
    * Led the end-to-end development of the **Restaurant Booking and Cancellation Flow**, encompassing both UI and backend (Spring Boot) implementation.
    * Developed a **Fetch All Bookings API endpoint** to retrieve comprehensive booking data for users.
    * Enhanced the restaurant fetch API by adding a **Restaurant Booking Count field**, providing valuable insights into booking volumes on restaurant detail pages and cards.
    * Engineered the **Restaurant Details View (Full Stack)**, covering both UI and backend (Spring Boot) aspects, and integrated a feature to **View Restaurant Location on Google Maps**.

---

## 👤 Rajeev Ranjan Chaurasia – Full Stack Developer

Rajeev was instrumental in establishing the backend infrastructure, leading DevOps practices, contributing to UI development and implementing core backend services including authentication, restaurant management, and user profile functionalities.

### 🚀 Key Contributions

* **Backend Infrastructure & DevOps:**
    * Led the initial setup of the **Spring Boot backend project**.
    * Engineered the deployment strategy utilizing **AWS Elastic Beanstalk**, managing **EC2 instances**, **Load Balancers**, and **Auto Scaling Groups (ASG)** for resilient and scalable application hosting.
    * Implemented **Docker containerization** for the backend application, with images stored in **AWS ECR (Elastic Container Registry)**.
    * Established a **CI/CD pipeline using GitHub Actions** for automated build, testing (JaCoCo for coverage), Docker image creation, and deployment to Elastic Beanstalk.

* **Authentication & User Management (Backend):**
    * Developed the backend logic for user **login and registration functionalities**, leveraging **AWS Cognito** for user pool management.
    * Integrated **One-Time Password (OTP) support** for secure authentication, involving **AWS Lambda** functions for custom authentication challenges (Define, Create, and Verify Auth Challenge triggers in Cognito).
    * Implemented **role-based UI login redirection logic**, ensuring users (Customer, Restaurant Manager, Admin) are directed to appropriate application sections post-login based on Cognito groups.

* **Core Restaurant Functionality (Backend):**
    * Developed backend support for **restaurant search**, including location-based queries using MySQL spatial functions and **Google Maps API** for geocoding.
    * Implemented functionality for **nearby restaurant suggestions**.

* **Booking Management (Backend & Email):**
    * Integrated **AWS SES (Simple Email Service)** for sending automated booking confirmation and cancellation emails, using Thymeleaf for templating.
    * Developed the server-side logic to detect and **manage conflicting bookings** for users.

* **Restaurant Manager Portal (Full Stack):**
    * Developed UI (Next.js/React) and backend (Spring Boot) for restaurant managers.
    * Implemented features for managers to **add and update restaurant details**, including image uploads to **AWS S3** using pre-signed URLs.
    * Created the **restaurant dashboard** for managers to view and manage their establishments.

* **User Profile & Bookings View (Full Stack):**
    * Developed UI (Next.js/React) and corresponding backend APIs (Spring Boot) for users to view their profile information.
    * Implemented the functionality for users to **list and view their past and upcoming bookings**.

---

## 👤 Jeevan Kurian – Full Stack Developer

Jeevan was pivotal in defining project requirements, developing comprehensive admin functionalities, and implementing the user ratings and reviews system across the full stack.

### 🚀 Key Contributions

* **Project Requirements & Documentation:**
    * Spearheaded the creation and maintenance of **project requirements documentation using Confluence**, ensuring clarity and alignment for the development team.

* **Admin Portal & Workflow (Full Stack):**
    * Designed and implemented the **Admin Dashboard UI (Next.js/React) and corresponding backend APIs (Spring Boot)**.
    * Developed core **admin workflows** including:
        * **Restaurant Approval/Rejection:** Enabling admins to review and manage the approval status of restaurant submissions.
        * **Restaurant Removal:** Providing functionality for admins to remove restaurants from the platform.
        * **Viewing All Restaurants & Pending Approvals:** UI and backend for listing and managing all restaurants and those awaiting approval.
    * Implemented **analytics display on the Admin Dashboard** for insights into reservation trends and popular restaurants.

* **Ratings and Reviews System (Full Stack):**
    * Developed the **backend services (Spring Boot) for managing user ratings and reviews** for restaurants.
    * Integrated the **ratings and reviews display into the frontend UI (Next.js/React)** on restaurant detail pages.
    * Ensured users can view average ratings and individual review comments.

---
