# Document Scanning System

A full-stack application that allows users to upload documents, scan them for keywords, and find similar documents based on content matching. The system supports user authentication, credit management, and administrative analytics. Additionally, a Dockerized Flask microservice (Yake REST API) is integrated for keyword extraction.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Docker Integration](#docker-integration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Frontend Scripts](#frontend-scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The Document Scanning System enables users to:

- Register and log in to access personalized features.
- Upload documents through a user-friendly interface.
- Scan documents to extract keywords via an external Flask microservice.
- View matching documents based on keyword similarity.
- Manage credits for scanning requests.
- Admin users can access analytics and approve credit requests.

This project is built with Node.js and Express on the backend (using SQLite as the database) and vanilla HTML, CSS, and JavaScript on the frontend. The keyword extraction service is built with Flask and is Dockerized for ease of deployment.

---

## Features

- **User Authentication:** Secure registration, login, and logout with session management and JWT-based authorization.
- **Document Upload:** Manual parsing of multipart form-data to handle file uploads.
- **Document Scanning:** Deducts user credits and uses the Dockerized Flask service for keyword extraction.
- **Document Matching:** Compares document tags to determine similarity between documents.
- **Admin Analytics:** Displays user scan counts, credit requests, and overall user metrics.
- **Credit Management:** Allows users to request and receive credits to continue scanning documents.
- **Docker Integration:** Runs a Flask-based keyword extraction API in a Docker container.

---

## Technologies

- **Backend:**
  - Node.js
  - Express.js
  - SQLite
  - bcryptjs (for password hashing)
  - jsonwebtoken (for JWT handling)
- **Frontend:**
  - HTML5
  - CSS3
  - Vanilla JavaScript
- **Keyword Extraction Service:**
  - Python (Flask)
  - Docker (containerized service)
- **Utilities:**
  - Custom middleware for authentication and role-based access
  - Utility scripts for credit management and text matching

---

## Project Structure

```plaintext
project-root/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── documentController.js
│   │   ├── scanController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── jsonBodyParser.js
│   ├── models/
│   │   └── models.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── userRoutes.js
│   │   ├── documentRoutes.js
│   │   ├── scanRoutes.js
│   │   └── creditRoutes.js
|   |── uploads/
│   ├── utils/
│   │   ├── creditManager.js
│   │   └── textMatching.js
│   ├── app.js
│   └── server.js
├── frontend/
    ├── index.html
    ├── login.html
    ├── register.html
    ├── profile.html
    ├── admin.html
    ├── matches.html
    ├── scripts/
    │   ├── login.js
    │   ├── register.js
    │   ├── profile.js
    │   ├── admin.js
    │   ├── matches.js
    │   └── upload.js
    └── styles/
        └── styles.css
```

## Setup and Installation

- **Clone the Repository:**

```
git clone https://github.com/yourusername/document-scanning-system.git
cd document-scanning-system
```

- **Install Backend Dependencies:**
  Navigate to the backend folder and install the necessary packages:

```
cd backend
npm install
```

- **Setup the Database:**
  The project uses SQLite. The database is automatically initialized using the provided schema in models.js.

- **Run the Server:**
  From the backend folder, start the server:

```
node server.js
```

- **Access the Frontend:**
  Open your browser and navigate to the frontend files (e.g., open frontend/index.html). You can also use a live server extension or any local server tool to serve the frontend.

## Docker Integration

- The keyword extraction service is built with Flask and is containerized using Docker. The following log indicates a successful Dockerized deployment:

```
2025-03-09 16:11:07  * Serving Flask app "yake-rest-api" (lazy loading)
2025-03-09 16:11:07  * Environment: production
2025-03-09 16:11:07    WARNING: Do not use the development server in a production environment.
2025-03-09 16:11:07    Use a production WSGI server instead.
2025-03-09 16:11:07  * Debug mode: on
2025-03-09 16:11:07  * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
2025-03-09 16:11:07  * Restarting with stat
2025-03-09 16:11:07  * Debugger is active!
2025-03-09 16:11:07  * Debugger PIN: 753-113-429
```

- **How to Run the Docker Container**
  - Ensure Docker is installed on your system.
  - Navigate to the docker folder (if your Dockerfile and docker-compose.yml are located there):
  ```
  cd docker
  ```
  - Build and run the Docker container:
  ```
  docker-compose up --build
  ```
  This command builds the Docker image and starts the container, making the Flask-based keyword extraction service available on port 5000.

## Usage

- **User Registration & Login:** Navigate to the Register or Login pages to create an account or log in.
- **Profile Management:** Once logged in, access your profile to upload documents, scan them, or request additional credits.
- **Document Scanning:** Upload documents to trigger scanning and keyword extraction.
- **Document Matching:** View matching documents based on similarity scores.
- **Admin Dashboard:** Admin users can view analytics, manage users, and approve credit requests.

## API Endpoints

- **Authentication**

  - POST /auth/register – Register a new user.
  - POST /auth/login – Login a user.
  - DELETE /auth/logout – Logout a user.

- **User**

  - GET /user/profile – Retrieve user profile and associated documents.
  - POST /user/request – Request additional credits.

- **Documents**

  - POST /scanUpload – Upload a document for scanning.
  - GET /matches/:docId – Retrieve matching documents based on a document ID.

- **Scans**

  - POST /scan – Scan a document and extract keywords.

- **Admin**
  - GET /admin/analytics – Get analytics data (scan counts, users, credit requests).
  - POST /admin/approve-credit-requests – Approve pending credit requests.

## Frontend Scripts

- **login.js:** Handles user login functionality.
- **register.js:** Handles user registration functionality.
- **profile.js:** Manages profile operations, including document upload and scanning.
- **admin.js:** Controls the admin dashboard and analytics display.
- **matches.js:** Fetches and displays document matching data.
- **upload.js:** Manages additional functionalities for document uploads.

## Contributing

Contributions are welcome! Please fork the repository, create a new branch for your feature or bug fix, and submit a pull request.

- Fork the repo.
- Create your feature branch: git checkout -b feature/my-feature
- Commit your changes: git commit -am 'Add some feature'
- Push to the branch: git push origin feature/my-feature
- Submit a pull request.

## License

- This project is licensed under the MIT License. See the LICENSE file for details.

```
This README.md file offers a comprehensive guide to the project, including its structure, installation, usage, and Docker integration for the Flask-based keyword extraction service. Adjust paths and URLs as needed to match your specific repository details.
```
