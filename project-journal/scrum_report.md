# SYNERGY - Scrum Report

## 📅 Sprint 1: Planning and Project Setup
---

#### Scrum Meeting 1 

**Tushar Singh**
* **In Progress:**
    * "Next JS project skeleton setup": Initialized Next.js project, reviewed default folder structure.
    * "Design SignUp/SignIn Modal": Began requirements gathering for modal content and user flow.
* **Next:**
    * Define core folder structure for Next.js, set up basic routing placeholders.
    * Sketch initial UI flows for SignUp/SignIn modal.
* **Blocked:**
    * None.

**Rajeev Ranjan Chaurasia**
* **In Progress:**
    * "AWS Cloud Infrastructure Setup": Initial AWS account review, identified key services (IAM, S3 for planning, Cognito basics).
    * "System Architecture Design": Drafted high-level diagram of FE, BE, DB; discussed preliminary tech stack.
* **Next:**
    * Outline basic IAM roles, plan S3 bucket for project assets.
    * Refine system architecture: detail major components and interactions.
* **Blocked:**
    * None.

**Jeevan Kurian**
* **In Progress:**
    * "Define Product Requirements & Documentation": Set up Confluence, created pages for Product Vision & Sprint 1 Goals.
* **Next:**
    * Draft initial user stories for User Authentication & basic Restaurant Display.
    * Outline key entities for initial database schema.
* **Blocked:**
    * None.

**Sofia Silva**
* **In Progress:**
    * "Design Customer Home Page": Researched similar platforms, sketched initial layout concepts.
    * "Design Restaurant View Page": Began gathering display requirements for restaurant details.
* **Next:**
    * Develop low-fidelity wireframes for Customer Home Page in Figma.
    * Sketch initial layouts for Restaurant View Page.
* **Blocked:**
    * None.

#### Scrum Meeting 2

**Tushar Singh**
* **Completed:**
    * "Next JS project skeleton setup": Core folder structure (components, pages, utils, styles) established. Basic routing for placeholder pages configured.
    * "Design SignUp/SignIn Modal": Sketched UI flows for login, registration, and OTP input fields.
* **Next:**
    * Finalize Next.js skeleton: Integrate ESLint, Prettier, and basic Material-UI theming setup.
    * Translate SignUp/SignIn modal sketches into low-fidelity wireframes in Figma.
* **Blocked:**
    * None.

**Rajeev Ranjan Chaurasia**
* **Completed:**
    * "AWS Cloud Infrastructure Setup": Basic S3 bucket for project documentation/assets created.
    * "System Architecture Design": Version 0.1 of architecture document completed and shared on Confluence. Outlines frontend-backend separation, proposed database type (MySQL), and key AWS services (Cognito, S3, placeholder for EB).
* **Next:**
    * Finalize planning for basic AWS Cognito User Pool (required attributes, password policy).
    * Start "Backend Project Setup and CI/CD integration to AWS": Initialize Spring Boot project with Gradle.
* **Blocked:**
    * None.

**Jeevan Kurian**
* **Completed:**
    * "Define Product Requirements & Documentation": Drafted user stories for Login, Signup, OTP flow, Viewing Restaurant List, and Viewing Restaurant Details on Confluence.
* **Next:**
    * Refine user stories with acceptance criteria based on team discussion.
    * Document high-level data flow for authentication and restaurant viewing.
* **Blocked:**
    * Waiting for Sofia's initial page designs to ensure requirements align.

**Sofia Silva**
* **Completed:**
    * "Design Customer Home Page": Developed low-fidelity wireframes in Figma, detailing key sections (search bar, featured restaurants, categories).
    * "Design Restaurant View Page": Sketched detailed layout concepts showing placement for restaurant images, description, map placeholder, and reviews section placeholder.
* **Next:**
    * Develop low-fidelity wireframes for Restaurant View Page.
    * Start "Design Booking Confirmation Page": Brainstorm key information elements needed.
* **Blocked:**
    * Awaiting more specific data field requirements for Restaurant View Page from Jeevan.

#### Scrum Meeting 3

**Tushar Singh**
* **Completed:**
    * "Next JS project skeleton setup": ESLint, Prettier configured. Basic Material-UI theme provider integrated.
    * "Design SignUp/SignIn Modal": Low-fidelity wireframes for Login, Registration, and OTP screens created in Figma.
* **Next:**
    * Review other Figma designs from Sofia (Home, Restaurant View) to understand overall UI direction for Sprint 2 component planning.
* **Blocked:**
    * None.

**Rajeev Ranjan Chaurasia**
* **Completed:**
    * "AWS Cloud Infrastructure Setup": Initial planning for AWS Cognito User Pool attributes and password policies finalized and documented.
    * "Backend Project Setup": Initialized Spring Boot project using Spring Initializr with Gradle; Core dependencies (Spring Web, Spring Security placeholder) added. Basic package structure created.
* **Next:**
    * Continue "Backend Project Setup and CI/CD integration to AWS": Create placeholder for GitHub Actions workflow with basic Java build and placeholder test steps.
* **Blocked:**
    * None.

**Jeevan Kurian**
* **Completed:**
    * "Define Product Requirements & Documentation": Refined user stories with acceptance criteria. Documented high-level data flow diagrams for core features on Confluence.
* **Next:**
    * Create initial ERD (Entity Relationship Diagram) based on defined entities (User, Restaurant) and their core attributes.
    * Start drafting high-level requirements for Admin functionalities for future sprints.
* **Blocked:**
    * None.

**Sofia Silva**
* **Completed:**
    * "Design Restaurant View Page": Developed low-fidelity wireframes in Figma, detailing layout for all key sections (images, info, map, reviews placeholder).
    * "Design Booking Confirmation Page": Sketched layout options showing booking summary, confirmation message, and potential next actions.
* **Next:**
    * Develop high-fidelity mockups for Customer Home Page based on approved wireframes.
    * Refine wireframes for Booking Confirmation page and start developing low-fidelity mockups.
* **Blocked:**
    * None.

---

#### Scrum Meeting 4

**Tushar Singh**
* **Completed:**
    * Reviewed Sofia's high-fidelity mockups for Customer Home Page.
    * Identified common UI patterns for reusable component planning for Sprint 2.
* **Next:**
    * Collaborate with Sofia on finalizing design details for interactive elements based on her upcoming high-fidelity designs.
* **Blocked:**
    * Waiting for Sofia's finalized high-fidelity designs for Restaurant View and Booking Confirmation.

**Rajeev Ranjan Chaurasia**
* **Completed:**
    * "Backend Project Setup and CI/CD integration to AWS": Created initial file in GitHub repository with stubs for Java setup, Gradle build.
* **Next:**
    * Finalize basic GitHub Actions workflow: Add placeholder test execution step.
    * Research Spring Boot integration points with AWS Cognito for token validation.
* **Blocked:**
    * None.

**Jeevan Kurian**
* **Completed:**
    * Created initial ERD for Users and Restaurants and documented on Confluence.
    * Started drafting high-level requirements for Admin functionalities.
* **Next:**
    * Refine ERD to include Bookings and Reviews entities based on initial scope.
    * Detail user stories for Admin: View pending restaurants, Approve/Reject restaurant.
* **Blocked:**
    * None.

**Sofia Silva**
* **Completed:**
    * Developed high-fidelity mockups for Customer Home Page in Figma.
    * Refined wireframes for "Design Booking Confirmation Page" and started converting to low-fidelity mockups.
* **Next:**
    * Develop high-fidelity mockups for Restaurant View Page.
    * Start designing a consistent style for shared UI components (buttons, cards).
* **Blocked:**
    * None.

#### Scrum Meeting 5

**Tushar Singh**
* **Completed:**
    * Collaborated with Sofia on design consistency for SignUp/SignIn modal and Customer Home Page.
* **Next:**
    * Review Sofia's upcoming high-fidelity designs for Restaurant View and Booking Confirmation pages.
    * Prepare a list of core UI components needed for Sprint 2 development based on designs.
* **Blocked:**
    * Waiting for Sofia's complete set of high-fidelity mockups for Sprint 1 scope.

**Rajeev Ranjan Chaurasia**
* **Completed:**
    * "Backend Project Setup and CI/CD integration to AWS": Finalized basic GitHub Actions workflow with a placeholder test execution step.
* **Next:**
    * Document the chosen System Architecture and initial AWS infrastructure plan on Confluence.
    * Plan basic AWS Elastic Beanstalk application setup steps (manual for now, automation focus in later sprints).
* **Blocked:**
    * None.

**Jeevan Kurian**
* **Completed:**
    * Refined ERD to include Bookings and Reviews entities, documented relationships on Confluence.
    * Detailed user stories for Admin roles: View pending restaurants, Approve/Reject restaurant, with acceptance criteria.
* **Next:**
    * Define initial requirements for the Restaurant Manager role (e.g., ability to add a new restaurant, view their own restaurants).
    * Document API contract stubs for planned Admin approval endpoints on Confluence (for Sprint 2 development).
* **Blocked:**
    * None.

**Sofia Silva**
* **Completed:**
    * Developed high-fidelity mockups for Restaurant View Page in Figma.
    * Designed key common UI components: Restaurant Card for listings, and styled Date/Time Picker concepts.
* **Next:**
    * Finalize high-fidelity mockups for the "Design Booking Confirmation Page".
    * Design UI for a basic Admin dashboard focusing on the list of pending restaurant approvals and action buttons.
* **Blocked:**
    * None.

---

#### Scrum Meeting 6 

**Tushar Singh**
* **Completed:**
    * Reviewed final designs from Sofia for Restaurant View and Booking Confirmation pages.
    * Created a preliminary list of reusable React components to be built in Sprint 2.
* **Next:**
    * Prepare for detailed knowledge session with Sofia regarding all UI designs and Figma assets.
* **Blocked:**
    * None.

**Rajeev Ranjan Chaurasia**
* **Completed:**
    * Documented the finalized System Architecture and initial AWS infrastructure plan (Cognito, S3, EB placeholder) on Confluence.
    * Manually created a basic AWS Elastic Beanstalk application and a sample environment in the AWS console for familiarization.
* **Next:**
    * Outline database connection configuration strategy for Spring Boot to MySQL (for implementation in Sprint 2).
    * Plan basic User entity structure for local DB (to store details beyond Cognito).
* **Blocked:**
    * None.

**Jeevan Kurian**
* **Completed:**
    * Defined initial requirements for Restaurant Manager role: Add Restaurant (basic fields), View Owned Restaurants.
    * Documented API contract stubs for Admin approval/rejection endpoints on Confluence.
* **Next:**
    * Finalize all Sprint 1 documentation (requirements, initial schemas, high-level API stubs).
    * Assist team in Sprint 1 review and prepare for Sprint 2 planning.
* **Blocked:**
    * None.

**Sofia Silva**
* **Completed:**
    * Finalized high-fidelity mockups for "Design Booking Confirmation Page".
    * Created initial high-fidelity mockups for Admin dashboard (pending approvals list and key action buttons).
* **Next:**
    * Compile all Figma design files into an organized structure.
    * Create a comprehensive style guide overview and component library summary on Confluence based on designs.
* **Blocked:**
    * None.


## 📅 Sprint 2: Core Feature Implementation 

#### Scrum Meeting 1 

**Tushar Singh**
* **In Progress:**
    * Developing React components for SignUp/SignIn modal based on his designs, integrating Material-UI.
    * Setting up frontend AuthContext for managing login state and user roles.
* **Next:**
    * Implement client-side API calls to backend auth endpoints (send/verify OTP).
    * Implement UI for OTP verification input.
* **Blocked:**
    * Waiting for finalized backend auth API endpoints from Rajeev.

**Rajeev Ranjan Chaurasia**
* **In Progress:**
    * Implementing backend User entity and repository for storing user details locally post-Cognito registration.
    * Developing Spring Security configuration for robust JWT validation from AWS Cognito.
* **Next:**
    * Finalize User entity and expose basic User Profile API endpoint.
    * Implement core backend logic for "Add Restaurant" by managers (saving details to DB, planning S3 integration).
* **Blocked:**
    * None.

**Jeevan Kurian**
* **In Progress:**
    * Implementing backend service and repository methods for Admin.
    * Developing backend service method for Admin to approve restaurant.
* **Next:**
    * Expose API endpoints for get pending restaurants and approve restaurants.
    * Start backend implementation for User Review submission (saving to DB).
* **Blocked:**
    * None.

#### Scrum Meeting 2

**Tushar Singh**
* **Completed:**
    * Implemented client-side API calls to `/api/auth/otp/send`. UI for OTP input developed.
* **In Progress:**
    * Integrating with `/api/auth/otp/verify` endpoint. Implementing user state update in AuthContext (isLoggedIn, role, basic profile info).
    * Developing static UI for Customer Homepage based on Sofia's designs, including placeholders for dynamic content.
* **Next:**
    * Complete OTP verification flow and implement role-based redirection after login.
    * Start developing static UI for Restaurant View Page.
* **Blocked:**
    * Clarification on exact payload for OTP verify response from Rajeev.

**Rajeev Ranjan Chaurasia**
* **Completed:**
    * Backend User entity and repository for local user details implemented. Basic `/api/auth/profile` endpoint created.
    * Spring Security JWT validation filter integrating with AWS Cognito JWKS endpoint is functional.
* **In Progress:**
    * Implementing core backend logic for `RestaurantService.addRestaurant()` (saving basic details, address, cuisine from manager input).
    * Developing `/api/manager/presigned-url` endpoint for generating S3 pre-signed URLs for restaurant photo uploads.
* **Next:**
    * Integrate S3 photo URL (key) saving into the `addRestaurant` flow.
    * Start backend development for Restaurant Search (keyword and initial location-based query planning).
* **Blocked:**
    * None.

**Jeevan Kurian**
* **Completed:**
    * Backend API endpoints for Admin: `/api/admin/restaurants/pending` (GET) and `/api/admin/restaurants/{id}/approve` (POST) are functional.
* **In Progress:**
    * Implementing backend logic for user review submission and saving reviews to the database (Review entity, repository, service method).
    * Designing UI for Admin to view the list of pending restaurants and trigger approval/rejection.
* **Next:**
    * Expose API endpoint for submitting reviews (`/api/restaurants/{id}/reviews` POST).
    * Develop Admin UI for listing pending restaurants and integrating approval actions.
* **Blocked:**
    * None.

#### Scrum Meeting 3

**Tushar Singh**
* **Completed:**
    * End-to-end OTP verification flow integrated with backend. User state (isLoggedIn, role) updated in AuthContext. Role-based redirection after login implemented.
    * Developed static UI for Customer Homepage with placeholders.
* **In Progress:**
    * Developing static UI for Restaurant View Page using Sofia's designs.
    * Planning UI for Restaurant Manager: "Add Restaurant" form.
* **Next:**
    * Integrate dynamic data fetching for nearby suggestions on Customer Homepage (placeholder for now).
    * Implement UI for image uploads (main & additional photos) in "Add Restaurant" form.
* **Blocked:**
    * Waiting for backend API for fetching restaurant details (for Restaurant View Page).

**Rajeev Ranjan Chaurasia**
* **Completed:**
    * Backend API endpoint `/api/manager/presigned-url` for S3 image uploads is implemented and tested.
    * `RestaurantService.addRestaurant()` now includes saving the main photo URL (S3 key) to the database.
* **In Progress:**
    * Developing backend for Restaurant Search: Implementing keyword search (name, cuisine, description) and initial geospatial search capabilities using MySQL `ST_Distance_Sphere`.
* **Next:**
    * Expose `/api/home/restaurants/search` endpoint with keyword and location parameters.
    * Implement backend logic for nearby restaurant suggestions based on user's current location.
* **Blocked:**
    * None.

**Jeevan Kurian**
* **Completed:**
    * Backend logic for user review submission (saving to DB) is complete. API endpoint `/api/restaurants/{id}/reviews` (POST) is functional.
* **In Progress:**
    * Developing Admin UI for listing pending restaurants, calling the backend API to fetch data.
* **Next:**
    * Implement UI actions (approve/reject buttons) in Admin pending list, linking to backend APIs.
    * Start backend logic for fetching and displaying existing reviews for a given restaurant.
* **Blocked:**
    * None.

---

#### Scrum Meeting 4

**Tushar Singh**
* **Completed:**
    * Static UI for Restaurant View Page largely complete.
    * Developed UI for Restaurant Manager: "Add Restaurant" form (basic fields: name, address, cuisine, description).
* **In Progress:**
    * Implementing UI for image uploads (main & additional photos) for "Add Restaurant" form, including interaction with S3 pre-signed URL flow.
    * Starting UI for customer booking section on Restaurant View Page (date, time, party size selectors).
* **Next:**
    * Connect "Add Restaurant" form (including S3 image key handling) to the backend API.
    * Test Add Restaurant flow end-to-end from UI to backend.
* **Blocked:**
    * Finalizing payload structure for Add Restaurant API with Rajeev.

**Rajeev Ranjan Chaurasia**
* **Completed:**
    * Backend for Restaurant Search by keyword and location is functional. `/api/home/restaurants/search` endpoint exposed and tested.
* **In Progress:**
    * Implementing backend logic for nearby restaurant suggestions (`/api/home/restaurants/nearby`).
    * Developing core backend logic for booking creation (`/api/booking/create`), including initial table availability checks based on party size and existing bookings.
* **Next:**
    * Finalize booking creation logic, ensure data validation, and integrate email (SES) for sending booking confirmations.
    * Begin backend implementation for Restaurant Manager: "Update Restaurant" functionality (basic details).
* **Blocked:**
    * None.

**Jeevan Kurian**
* **Completed:**
    * Admin UI for listing pending restaurants is functional, successfully fetching and displaying data from the backend.
* **In Progress:**
    * Implementing UI actions (approve/reject buttons) for the Admin pending restaurant list, integrating with the respective backend APIs.
    * Implementing backend logic for fetching all reviews for a specific restaurant (`/api/restaurants/{id}/reviews` GET).
* **Next:**
    * Expose API endpoint to get reviews for a restaurant.
    * Start UI development for displaying reviews on the Restaurant View Page.
* **Blocked:**
    * None.

#### Scrum Meeting 5

**Tushar Singh**
* **Completed:**
    * UI for image uploads in "Add Restaurant" form implemented; frontend successfully calls backend for pre-signed URLs and prepares S3 keys for submission.
    * UI for customer booking section (date, time, party size selectors) on Restaurant View Page is complete.
* **In Progress:**
    * Connecting the full "Add Restaurant" form to Rajeev's backend API; performing initial integration testing.
    * Implementing frontend logic to call `/api/booking/create` and handle the response.
* **Next:**
    * Develop the Booking Confirmation page UI based on Sofia's designs.
    * Start UI development for the Customer Profile page, focusing on listing user's bookings.
* **Blocked:**
    * Waiting for finalized booking API response structure from Rajeev for the confirmation page.

**Rajeev Ranjan Chaurasia**
* **Completed:**
    * Backend for nearby restaurant suggestions (`/api/home/restaurants/nearby`) is functional and tested.
    * Core booking creation logic (`/api/booking/create`) implemented with validation and saving to DB.
* **In Progress:**
    * Integrating AWS SES for sending booking confirmation emails automatically after a successful booking.
    * Started backend implementation for "Update Restaurant" functionality (allowing managers to update basic details like name, description, cuisine).
* **Next:**
    * Complete and test SES integration for booking confirmations.
    * Enhance "Update Restaurant" backend to handle updates for operating hours, table configurations, and main/additional photos (S3 key management).
* **Blocked:**
    * None.

**Jeevan Kurian**
* **Completed:**
    * UI actions (approve/reject buttons) in Admin pending restaurant list are functional and integrated with backend APIs.
    * Backend logic for fetching reviews for a restaurant is complete. API endpoint `/api/restaurants/{id}/reviews` (GET) is functional.
* **In Progress:**
    * Developing UI components for displaying reviews (list of individual reviews, average rating display) on the Restaurant View Page.
* **Next:**
    * Integrate review display components into the main Restaurant View Page.
    * Design backend for Admin analytics dashboard (e.g., total bookings, most popular restaurants).
* **Blocked:**
    * Requires Restaurant View Page structure from Tushar to integrate review display.

#### Scrum Meeting 6 (e.g., Friday, Mar 24)

**Tushar Singh**
* **Completed:**
    * "Add Restaurant" form (FE) fully connected to backend; Restaurant Managers can successfully add new restaurants with images. End-to-end flow tested.
    * Frontend logic to call `/api/booking/create` implemented; users can initiate a booking from the UI.
* **In Progress:**
    * Developing Booking Confirmation page UI to display details of the successful booking.
    * Developing UI for Customer Profile page, specifically the section for listing user's bookings.
    * Connecting Customer Homepage search bar and nearby suggestions feature to live backend APIs.
* **Next:**
    * Integrate dynamic data into Booking Confirmation page from API response.
    * Connect Customer Profile page to backend API for fetching the user's bookings.
* **Blocked:**
    * Waiting for API endpoint from Rajeev to fetch a user's specific bookings.

**Rajeev Ranjan Chaurasia**
* **Completed:**
    * AWS SES integration for sending booking confirmation emails is complete and tested.
    * Backend for "Update Restaurant" now supports updating basic restaurant details (name, description, cuisine type).
* **In Progress:**
    * Enhancing "Update Restaurant" backend to allow managers to update operating hours, table configurations, and manage main/additional photos (including deleting old S3 objects if replaced).
    * Developing backend logic for booking cancellation (`/api/booking/cancel/{bookingId}`) and integrating SES for cancellation emails.
* **Next:**
    * Finalize all aspects of "Update Restaurant" functionality.
    * Implement backend logic for handling and checking for conflicting bookings.
* **Blocked:**
    * None.

**Jeevan Kurian**
* **Completed:**
    * UI components for displaying reviews (list of reviews, average rating) on the Restaurant View Page are developed and integrated. Data is fetched from the backend.
* **In Progress:**
    * Designing backend queries and service logic for Admin analytics dashboard (total bookings in a period, most popular restaurants).
    * Planning UI for Admin dashboard to display these analytics.
* **Next:**
    * Implement backend API endpoints for Admin analytics.
    * Start UI development for Admin analytics dashboard.
* **Blocked:**
    * None.

---
---

## 📅 Sprint 3: Feature Completion & Initial DevOps
---

#### Scrum Meeting 1 

**Tushar Singh**
* **Completed:**
    * Booking Confirmation page UI now dynamically displays details from the booking API response.
    * Customer Homepage search bar and nearby suggestions features are connected to live backend APIs and displaying results.
* **In Progress:**
    * Connecting Customer Profile page UI to the backend API (`/api/booking/fetch`) to display a list of the user's bookings.
    * Designing UI for Restaurant Manager: "Edit Restaurant" form, pre-filling with existing data.
* **Next:**
    * Implement functionality on Profile page for users to cancel their bookings.
    * Develop the "Edit Restaurant" form UI.
* **Blocked:**
    * Waiting for backend API to fetch specific restaurant details for pre-filling the "Edit Restaurant" form (Rajeev/Jeevan).

**Rajeev Ranjan Chaurasia**
* **Completed:**
    * "Update Restaurant" backend functionality now supports updates to operating hours, table configurations, and management of main/additional photos (including S3 object deletion for replaced photos).
    * Backend for booking cancellation (`/api/booking/cancel/{bookingId}`) implemented, including SES integration for sending cancellation emails.
* **In Progress:**
    * Developing backend logic for detecting and checking for conflicting bookings (`/api/booking/check-conflicts` endpoint).
    * Starting Dockerization of the Spring Boot backend application (`Dockerfile` creation).
* **Next:**
    * Finalize and test the conflicting booking check endpoint.
    * Integrate Docker build process into the GitHub Actions CI/CD pipeline.
* **Blocked:**
    * None.

**Jeevan Kurian**
* **Completed:**
    * Backend queries and service logic for Admin analytics dashboard (total bookings, most popular restaurants for a period) are implemented.
* **In Progress:**
    * Developing API endpoints to expose Admin analytics data.
    * Developing UI for Admin dashboard to display these analytics (charts, tables).
* **Next:**
    * Finalize Admin analytics APIs and integrate with the dashboard UI.
    * Implement backend logic for Admin to view all restaurants and remove (soft delete) a restaurant.
* **Blocked:**
    * None.

#### Scrum Meeting 2

**Tushar Singh**
* **Completed:**
    * Customer Profile page UI successfully fetches and displays a list of the user's bookings.
* **In Progress:**
    * Implementing UI functionality on the Profile page for users to cancel their bookings, calling the backend cancellation API.
    * Developing the "Edit Restaurant" form UI for managers, including fields for all restaurant details.
* **Next:**
    * Connect "Edit Restaurant" form to backend API for fetching details to pre-fill the form.
    * Implement UI for the conflicting booking modal.
* **Blocked:**
    * Backend API for fetching full restaurant details specifically for manager edit view (Jeevan might have `/api/manager/restaurants/{id}`).

**Rajeev Ranjan Chaurasia**
* **Completed:**
    * Backend logic for detecting and checking conflicting bookings (`/api/booking/check-conflicts`) is implemented and tested.
    * Dockerfile for the Spring Boot backend application created and tested locally.
* **In Progress:**
    * Integrating Docker image build and push to AWS ECR (Elastic Container Registry) into the GitHub Actions CI/CD pipeline.
    * Refining unit tests for booking and restaurant management services.
* **Next:**
    * Complete ECR integration in CI/CD pipeline.
    * Begin planning for deployment to AWS Elastic Beanstalk from CI/CD.
* **Blocked:**
    * None.

**Jeevan Kurian**
* **Completed:**
    * API endpoints for Admin analytics data are functional.
* **In Progress:**
    * Developing UI for Admin dashboard to display analytics using charts and tables.
    * Implementing backend logic for Admin to view all restaurants and perform a soft delete.
* **Next:**
    * Finalize Admin analytics dashboard UI and integrate with APIs.
    * Expose API endpoint for Admin to remove (soft delete) a restaurant.
    * Develop UI for Admin to view all restaurants and trigger removal.
* **Blocked:**
    * None.

#### Scrum Meeting 3

**Tushar Singh**
* **Completed:**
    * UI functionality on Profile page for users to cancel bookings is implemented and integrated with the backend.
    * "Edit Restaurant" form UI for managers is developed, ready for data pre-fill.
* **In Progress:**
    * Connecting "Edit Restaurant" form to backend API to fetch and pre-fill existing restaurant data.
    * Developing the UI for the conflicting booking modal based on backend API response.
* **Next:**
    * Connect "Edit Restaurant" form to the backend update API.
    * Test conflicting booking flow from UI.
* **Blocked:**
    * None.

**Rajeev Ranjan Chaurasia**
* **Completed:**
    * Docker image build and push to AWS ECR integrated into the GitHub Actions CI/CD pipeline.
    * Added more unit tests for booking conflict logic and restaurant update services.
* **In Progress:**
    * Planning deployment strategy to AWS Elastic Beanstalk from CI/CD (Dockerrun.aws.json, EB CLI commands).
    * Reviewing security configurations for Cognito and Spring Security.
* **Next:**
    * Implement initial deployment script/steps for Elastic Beanstalk in GitHub Actions.
    * Conduct a security review of authentication and authorization endpoints.
* **Blocked:**
    * None.

**Jeevan Kurian**
* **Completed:**
    * Admin analytics dashboard UI is developed and integrated with backend APIs, displaying key metrics.
    * Backend logic for Admin to view all restaurants and perform a soft delete is implemented. API endpoint `/api/admin/restaurants/{id}` (DELETE) created.
* **In Progress:**
    * Developing UI for Admin to view all restaurants and trigger the remove (soft delete) action.
* **Next:**
    * Finalize Admin "All Restaurants" view and integrate remove functionality.
    * Conduct thorough testing of all Admin portal features.
* **Blocked:**
    * None.

---
---

## 📅 Sprint 4: Deployment, E2E Testing & Refinements

---

#### Scrum Meeting 1

**Tushar Singh**
* **Completed:**
    * "Edit Restaurant" form successfully fetches and pre-fills data from backend; connected to update API for submitting changes (including photos).
    * UI for conflicting booking modal developed and integrated with backend check.
* **In Progress:**
    * Thorough end-to-end testing of Customer user flow: Signup -> Login -> Search -> View Restaurant -> Book -> View Profile -> Cancel Booking.
    * Testing conflicting booking scenario from UI.
* **Next:**
    * Identify and fix UI bugs from customer flow testing.
    * Start E2E testing of Restaurant Manager flow.
* **Blocked:**
    * None.

**Rajeev Ranjan Chaurasia**
* **Completed:**
    * Initial script/steps for deploying the backend Docker container from ECR to AWS Elastic Beanstalk via GitHub Actions is implemented.
    * Security review of authentication and authorization endpoints completed; minor adjustments made.
* **In Progress:**
    * Testing and refining the Elastic Beanstalk deployment process from CI/CD. Ensuring environment variables and configurations are correctly applied.
    * Implementing backend health check endpoint (`/actuator/health`).
* **Next:**
    * Stabilize EB deployment from CI/CD.
    * Monitor deployed application logs on EB for issues.
    * Write unit tests for any new or significantly modified backend services.
* **Blocked:**
    * Initial deployment attempts to EB might require troubleshooting.

**Jeevan Kurian**
* **Completed:**
    * Admin UI for viewing all restaurants and triggering remove (soft delete) action is functional.
    * Thorough testing of all Admin portal features (pending approvals, all restaurants, analytics dashboard) completed.
* **In Progress:**
    * Documenting Admin portal functionalities and workflows on Confluence.
    * Participating in E2E testing, focusing on how Admin actions impact Restaurant Manager and Customer views.
* **Next:**
    * Finalize Admin documentation.
    * Assist in testing reviews and ratings system across different user roles.
* **Blocked:**
    * None.

#### Scrum Meeting 2

**Tushar Singh**
* **Completed:**
    * Identified and fixed several UI bugs from customer flow E2E testing. Conflicting booking flow tested and working.
* **In Progress:**
    * End-to-end testing of Restaurant Manager flow: Login -> Dashboard -> Add Restaurant (with images) -> View Restaurant -> Edit Restaurant -> View updated details.
    * Addressing UI inconsistencies and improving responsiveness on key pages.
* **Next:**
    * Fix UI bugs from manager flow testing.
    * E2E testing of Admin portal UI.
    * Gather screenshots for UI documentation.
* **Blocked:**
    * None.

**Rajeev Ranjan Chaurasia**
* **Completed:**
    * Backend deployment to AWS Elastic Beanstalk via GitHub Actions is stable and successfully deploying new versions.
    * Backend health check endpoint (`/actuator/health`) implemented and integrated with EB health monitoring.
* **In Progress:**
    * Monitoring deployed application logs and performance on Elastic Beanstalk.
    * Finalizing backend code documentation (JavaDocs, Confluence API docs).
    * Ensuring all AWS service configurations (Cognito, S3, SES, RDS, EB) are documented.
* **Next:**
    * Perform load testing preparations/scripts (if time permits).
    * Conduct final security pass on deployed backend.
* **Blocked:**
    * None.

**Jeevan Kurian**
* **Completed:**
    * Admin portal functionalities documentation on Confluence finalized.
    * Participated in E2E testing, verifying data consistency when Admin approves/removes restaurants.
* **In Progress:**
    * Testing review submission and display functionality across all relevant pages (Restaurant View, potentially User Profile).
    * Documenting the review and rating system architecture and API usage.
* **Next:**
    * Finalize review system documentation.
    * Collaborate on creating a comprehensive test plan and recording E2E test results.
* **Blocked:**
    * None.

#### Scrum Meeting 3

**Tushar Singh**
* **Completed:**
    * Fixed UI bugs identified during Restaurant Manager flow testing.
    * Completed E2E testing of Admin portal UI (approvals, viewing all restaurants, analytics).
* **In Progress:**
    * Final UI polish across all application sections: ensuring consistent styling, clear error messages, intuitive navigation.
    * Gathering screenshots and recording short video clips of UI flows for documentation and demo.
* **Next:**
    * Address any final UI bugs found during polish phase.
    * Prepare frontend components and pages for final review.
    * Contribute to user guide documentation.
* **Blocked:**
    * None.

**Rajeev Ranjan Chaurasia**
* **Completed:**
    * Monitored deployed backend on Elastic Beanstalk; application stable.
    * Finalized backend code documentation (JavaDocs) and high-level API documentation on Confluence.
    * Documented AWS service configurations (Cognito, S3, RDS, EB, SES) for handover/maintenance.
* **In Progress:**
    * Conducting a final security pass on all exposed backend API endpoints and AWS resource policies.
    * Preparing deployment scripts and instructions for final documentation.
* **Next:**
    * Final review of all backend code and configurations.
    * Assist team with any backend-related issues during final E2E testing.
* **Blocked:**
    * None.

**Jeevan Kurian**
* **Completed:**
    * Testing of review submission and display functionality completed.
    * Documentation for the review and rating system (architecture, API usage, UI interaction) finalized on Confluence.
* **In Progress:**
    * Collaborating with the team on creating a comprehensive E2E test plan, logging results, and tracking bugs.
    * Starting to draft sections of the final project report related to Admin functionalities, reviews, and overall system testing.
* **Next:**
    * Complete E2E test result documentation.
    * Finalize contributions to the project report.
    * Prepare for demo scripting.
* **Blocked:**
    * None.

---
---

## 📅 Sprint 5: Final Polish, Documentation & Demo Prep

---
#### Scrum Meeting 1

**Tushar Singh**
* **Completed:**
    * Addressed final UI bugs found during the polish phase from Sprint 4.
    * Prepared all frontend components and pages for final internal review.
* **In Progress:**
    * Creating user guide documentation for customer-facing features (Search, Booking, Profile).
    * Recording video walkthroughs of key frontend user flows.
* **Next:**
    * Create user guide for Restaurant Manager portal UI.
    * Collaborate on final presentation slides for frontend sections.
* **Blocked:**
    * None.

**Rajeev Ranjan Chaurasia**
* **Completed:**
    * Final security pass on deployed backend and AWS resources completed.
    * Final review of all backend code, configurations, and CI/CD pipeline.
* **In Progress:**
    * Preparing detailed backend technical documentation (architecture, API endpoints, deployment instructions, AWS service configuration details).
    * Assisting team with any last-minute backend-related bug fixes or performance tuning.
* **Next:**
    * Finalize all backend and deployment documentation.
    * Prepare backend/DevOps sections for the final project presentation.
* **Blocked:**
    * None.

**Jeevan Kurian**
* **Completed:**
    * E2E test results documented; all major bugs tracked and re-tested.
    * Finalized contributions to the project report regarding Admin, Reviews, and Testing sections.
* **In Progress:**
    * Preparing demo script covering all key functionalities across user roles.
    * Creating user guide documentation for the Admin portal.
* **Next:**
    * Finalize demo script and user guides.
    * Collaborate on creating the final project presentation slides.
* **Blocked:**
    * None.

#### Scrum Meeting 2

**Tushar Singh**
* **Completed:**
    * User guide for customer-facing features drafted.
    * Video walkthroughs of customer and restaurant manager UI flows recorded.
* **In Progress:**
    * Drafting user guide for the Restaurant Manager portal UI.
    * Preparing slides for the frontend sections of the final project presentation.
* **Next:**
    * Finalize all frontend documentation and presentation materials.
    * Conduct dry-run of frontend demo parts.
* **Blocked:**
    * None.

**Rajeev Ranjan Chaurasia**
* **Completed:**
    * Backend technical documentation (architecture, API details, deployment) finalized.
* **In Progress:**
    * Preparing slides and talking points for backend, DevOps, and AWS infrastructure for the final presentation.
    * Ensuring deployed environment is stable and performing well for the demo.
* **Next:**
    * Finalize all backend/DevOps presentation materials.
    * Conduct dry-run of backend/deployment demo parts.
* **Blocked:**
    * None.

**Jeevan Kurian**
* **Completed:**
    * Demo script covering all key features drafted.
    * User guide for the Admin portal drafted.
* **In Progress:**
    * Collaborating with Tushar and Rajeev on creating the full slide deck for the final project presentation.
    * Refining demo script for clarity and flow.
* **Next:**
    * Finalize all documentation and presentation materials.
    * Lead practice sessions for the final demo.
* **Blocked:**
    * None.

#### Scrum Meeting 3

**Tushar Singh**
* **Completed:**
    * User guide for Restaurant Manager portal UI drafted.
    * Frontend sections for final presentation slides completed.
* **In Progress:**
    * Reviewing all frontend documentation for completeness and clarity.
    * Practicing frontend demo segments.
* **Next:**
    * Final polish on all frontend deliverables.
    * Participate in full team demo rehearsals.
* **Blocked:**
    * None.

**Rajeev Ranjan Chaurasia**
* **Completed:**
    * Backend and DevOps sections for final presentation slides completed.
    * Deployed environment confirmed stable for demo.
* **In Progress:**
    * Reviewing all backend and deployment documentation.
    * Practicing backend/deployment demo segments.
* **Next:**
    * Final polish on all backend/DevOps deliverables.
    * Participate in full team demo rehearsals.
* **Blocked:**
    * None.

**Jeevan Kurian**
* **Completed:**
    * Final project presentation slide deck compiled and reviewed with the team.
    * Demo script finalized.
* **In Progress:**
    * Leading full team practice sessions for the final demo.
    * Reviewing all project documentation (user guides, technical docs, Confluence pages).
* **Next:**
    * Ensure all project artifacts are organized and ready for submission.
    * Coordinate final demo logistics.
* **Blocked:**
    * None.

---

#### Scrum Meeting 4

* **Completed:**
    * First full dry-run of the project demonstration.
    * Reviewed all user guides and technical documentation; identified areas for minor improvements.
* **In Progress:**
    * Refining demo flow and individual speaking parts based on dry-run feedback.
    * Making final edits to documentation for clarity and completeness.
* **Next:**
    * Second full demo dry-run.
    * Finalize all documentation artifacts.
* **Blocked:**
    * None.

#### Scrum Meeting 5

* **Completed:**
    * Second full dry-run of project demonstration completed; timing and transitions improved.
    * Final edits to all project documentation (user guides, Confluence, technical docs) completed.
* **In Progress:**
    * Individual practice of demo segments.
    * Preparing for potential Q&A during the demo.
    * Final check of the deployed application environment.
* **Next:**
    * Final team run-through of the demo.
    * Package all project deliverables for submission.
* **Blocked:**
    * None.

#### Scrum Meeting 6

* **Completed:**
    * Final team run-through of the project demonstration.
    * All project documentation and artifacts packaged for submission.
    * Deployed application environment confirmed stable and ready.
* **Next:**
    * Project Demonstration on May 11th.
* **Blocked:**
    * None.

---

