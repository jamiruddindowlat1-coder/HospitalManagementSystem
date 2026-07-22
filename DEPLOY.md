# ☁️ Hospital Management System - Cloud Deployment Guide

This guide details how to build and deploy your Hospital Management System (HMS) using Docker and Docker Compose to local environments or major cloud providers.

---

## 🐋 1. Local Run via Docker Compose

To start all services (SQL Server, Backend, Frontend) with a single command:

1. Ensure you have **Docker** and **Docker Compose** installed.
2. In the project root, run:
   ```bash
   docker-compose up --build -d
   ```
3. Once running, access the services:
   - **Frontend UI:** http://localhost:80
   - **Backend API:** http://localhost:5151
   - **Swagger Docs:** http://localhost:5151/swagger

---

## ☁️ 2. Cloud Deployment (AWS / Azure / Render)

### **A. Azure Container Apps / Web App for Containers (Easiest)**
1. **Azure SQL Database:** Set up a managed Azure SQL server and database. Obtain the connection string.
2. **Registry:** Push your Docker images to **Azure Container Registry (ACR)**.
   ```bash
   # Build & tag backend
   docker build -t <acr-name>.azurecr.io/hms-backend:latest ./HospitalManagement.API
   docker push <acr-name>.azurecr.io/hms-backend:latest

   # Build & tag frontend
   docker build -t <acr-name>.azurecr.io/hms-frontend:latest ./hospital-frontend
   docker push <acr-name>.azurecr.io/hms-frontend:latest
   ```
3. **Deploy:** Deploy the backend Container App, configure environment variables:
   - `ConnectionStrings__DefaultConnection` -> set to Azure SQL Connection String.
4. Deploy the frontend Container App and point its API base URL to your backend container URL.

### **B. AWS ECS (Elastic Container Service) with Fargate**
1. Host your database on **AWS RDS (SQL Server)**.
2. Upload build images to **AWS ECR (Elastic Container Registry)**.
3. Configure an ECS Task Definition with two containers: `hms-backend` and `hms-frontend`.
4. Deploy using an Application Load Balancer (ALB) routing public traffic to the frontend and backend.

### **C. Render / Railway (Simplified cloud hosting)**
1. Create a PostgreSQL or MySQL service (or spin up a SQL Server instance).
2. Create a Web Service pointing to your GitHub Repository for `HospitalManagement.API` (set Build Type to Docker).
3. Create a Static Web Service pointing to `hospital-frontend` (set Build Type to Docker).
4. Provide environment variables for database connections dynamically.

---

## 🔒 Security Best Practices
- **Passwords:** Change the default SQL Server password (`YourStrong@Pass123`) in production.
- **SSL Certificates:** Run frontend and backend traffic over HTTPS.
- **CORS:** Restrict CORS origins in the Backend's `Program.cs` to only match your production frontend URL.
