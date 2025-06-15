# 🚀 ChatApp

A modern, full-stack chat application built with Java (Spring Boot) for the backend and Angular for the frontend. Containerized with Docker and ready for cloud deployment!

## Features

- 💬 Real-time messaging
- 🖥️ Responsive UI
- 🐳 Easy deployment with Docker

## Ideas for future features
- 🔒 Secure authentication
- 🗂️ Multi-room support

## TODO:
- Add mobile safe zones

## Tech Stack

- **Frontend:** Angular 20, TypeScript, RxJS
- **Backend:** Java 21, Spring Boot, Maven
- **CI/CD:** GitHub Actions, Docker, GitHub Container Registry

## Getting Started

### Prerequisites

- Docker
- Node
- Java 21
- Maven

### Local Development

1. **Clone the repo:**
   ```sh
   git clone https://github.com/simon-b64/chat_app.git
   cd chat_app
   
2. **Build and run the backend:**
   ```sh
   cd backend
   mvn clean install
   mvn run
   
3. **Build and run the frontend:**
   ```sh
   cd frontend
   npm install
   npm run start