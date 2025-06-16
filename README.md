# AlDiaCAR: Personal Vehicle Management & Sustainability App

AlDiaCAR is a full-stack application designed to help individuals and households manage their personal vehicles with a focus on optimizing for sustainability. It provides tools for tracking maintenance, logging trips, and receiving recommendations on the most eco-friendly vehicle to use for a given journey.

This repository contains the source code for the Bachelor's Thesis "Design and development of a sustainability-focused app for optimizing personal vehicle usage".

## Project Structure

The project is organized as a monorepo:

-   `./`
    -   `package.json`: Root package file with scripts to run/test the entire project.
    -   `docker/`: Contains the `docker-compose.yaml` for managing services.
    -   `config/`: Configuration files for services (e.g., `mongo-express`).
    -   `src/`
        -   `backend/`: The Node.js, Express, and MongoDB backend REST API.
        -   `frontend/`: The React Native (Expo) mobile application.
    -   `tests/`
        -   `backend/`: Jest unit and integration tests for the API.
        -   `frontend/`: Playwright end-to-end tests for the user interface.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

-   [Node.js](https://nodejs.org/) (v22.x or later recommended)
-   [Docker](https://www.docker.com/products/docker-desktop/)
-   [Docker Compose](https://docs.docker.com/compose/install/)

## Getting started

> [!WARNING]
> Using localhost as the servers' address can cause issues with the cookies. If that happens you can try with the IP of the device the servers are being run on (you can find this with `ip a`).

### 1. Installation

Clone the repository and install all dependencies from the root directory. The root `package.json` is configured to automatically install dependencies for all workspaces (backend, frontend, tests).

```bash
git clone https://github.com/jseg380/Trabajo-Fin-Grado.git
cd Trabajo-Fin-Grado
npm install
```

### 2. Environment variables

The backend requires environment variables for configuration. Create a new file named `.env` inside the `src/backend/` directory and add the following content.

**File: `src/backend/.env`**
```
MONGODB_URI=mongodb://localhost:27017/aldiacardb
JWT_SECRET="a-secure-secret-key-for-development"
CLIENT_URL=http://localhost:3000
```

> [!NOTE]
> The `CLIENT_URL` is used for CORS. If you run the frontend on a different port or IP address (e.g., when accessing from a physical mobile device), you may need to add it to the `allowedOrigins` array in `src/backend/server.js`.

### 3. Running the application (Development)

The application consists of multiple services that need to be running for a complete development experience. It's recommended to run each command in a separate terminal window.

**A. Start Database Services**

This command uses Docker Compose to start the MongoDB database and the Mongo Express web interface.

```bash
docker-compose -f ./docker/docker-compose.yaml up mongo mongo-express
```

-   MongoDB will be accessible on `mongodb://localhost:27017`.
-   Mongo Express (a GUI for the database) will be available at [http://localhost:8081](http://localhost:8081).

**B. Start the Mock Car API**

This is a simple Node.js server that simulates an external API for fetching vehicle specifications.

```bash
node src/backend/mock-api/mock-car-api.js
```

-   The mock API will be running at [http://localhost:7500](http://localhost:7500).

**C. Start the Backend Server**

This command starts the main Node.js REST API server with hot-reloading.

```bash
npm run start:backend
```

-   The backend API will be running at [http://localhost:5000](http://localhost:5000).

**D. Start the Frontend Application**

This command starts the Expo development server for the React Native app.

```bash
npm run start:frontend
```

-   Expo will provide a QR code and URLs to run the app in a web browser, on an Android emulator, or on an iOS simulator.
-   It has been configured for Expo to use the 3000 port so by default the web version should be available at [http://localhost:3000](http://localhost:3000).

### 4. Seeding the database

To populate the database with a test user and sample data, you can use the initialization endpoint. Use a tool like `curl` or Postman to make a `POST` request:

```bash
curl -X POST http://localhost:5000/api/init-db
```

This will create a test user with the credentials:
-   **Email:** `test@example.com`
-   **Password:** `testPassword`

## Running the full Stack with docker

You can run the entire application stack (backend, frontend, database, and mongo-express) using a single Docker Compose command. This is useful for a quick demonstration but is still a development environment as it mounts your local source code.

```bash
docker-compose -f ./docker/docker-compose.yaml up
```

> [!NOTE]
> A true production deployment would involve building optimized Docker images for the frontend and backend instead of running `npm run dev`.

> [!WARNING]
> In production, it's indispensable to configure a reverse proxy (like Nginx or Caddy) to handle HTTPS, as sensitive data like passwords should never be transmitted over plain HTTP.

## Running tests

The project includes a comprehensive suite of tests for both the backend and frontend.

### Backend tests (Jest)

These tests validate the API endpoints and business logic. They run against an in-memory database and **do not require Docker or other services to be running.**

```bash
npm run test:backend
```

### Frontend End-to-End tests (Playwright)

These tests simulate real user interactions in a browser. **They require the backend and mock API servers to be running.** The Playwright configuration will automatically launch the frontend server.

1.  First, ensure the backend and mock API are running as described in the [development setup](#3-running-the-application-development).
2.  Then, run the Playwright tests:

```bash
npm run test:frontend
```

This will open the Playwright test runner and execute the tests defined in `tests/frontend/end-to-end/`.

### Run all tests

To run all available test suites (backend and frontend):

```bash
npm run test
```
