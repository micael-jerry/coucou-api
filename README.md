<div align="center">
  <a href="https://github.com/micael-jerry/coucou-api">
    <h1>Coucou API</h1>
  </a>
  <p>
    The backend API for Coucou, a real-time chat application inspired by modern messaging platforms.
  </p>
</div>

## 🚀 Introduction

**Coucou API** provides the core backend services for the Coucou chat application. It handles user authentication, real-time messaging, conversation management, and more. Built with a modern and scalable architecture using NestJS, it's designed to be robust, efficient, and easy to maintain.

This project is currently under development and serves as the foundation for a full-featured messenger client.

## ✨ Features

- **User Authentication**: Secure sign-up and login with JWT-based authentication.
- **Real-time Messaging**: WebSocket integration for instant message delivery.
- **Conversation Management**: Create and manage conversations between users.
- **Database Management**: Uses Prisma ORM for predictable and reliable database interactions.
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation for clear and easy API testing.
- **Containerized Development**: Docker support for a consistent and easy-to-set-up development environment.

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [JWT](https://jwt.io/) (JSON Web Tokens)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Email Service**: [Resend](https://resend.com/) (for transactional emails)
- **CI/CD**: [GitHub Actions](https://github.com/features/actions)
- **Deployment**: [Koyeb](https://www.koyeb.com/)
- **Development Environment**: [Docker](https://www.docker.com/)

## 🔗 Related Projects

- **[Coucou App (Front-End)](https://github.com/micael-jerry/coucou-app)**: The front-end client for the Coucou messenger, built with modern web technologies.

## 📊 Database Schema

The database schema is managed with Prisma. Below is the physical data model (PDM) of the database.

![Database Schema](docs/mpd.png)

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v22.x or later)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://www.docker.com/get-started)

### 1. Clone the Repository

```bash
git clone https://github.com/micael-jerry/coucou-api.git
cd coucou-api
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory by copying the template:

```bash
cp .env.template .env
```

Update the `.env` file with your local database credentials and a JWT secret.

```env
# .env
NODE_ENV="dev" # possible value [prod, dev, test]
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET_KEY="your-super-secret-key"
RESEND_API_KEY="resend-api-key"
FRONT_END_BASE_URL="https://front-end-base-url.com"
```

### 4. Start the Database

You can use the provided `docker-compose.yml` to easily spin up a PostgreSQL database.

```bash
docker-compose up -d
```

### 5. Run Database Migrations

Apply the database schema using Prisma Migrate.

```bash
pnpm prisma migrate dev
```

## ධ Running the Application

### Development Mode

To run the application in development mode with hot-reloading:

```bash
pnpm run start:dev
```

The server will start on `http://localhost:3000` (or the port specified in `src/main.ts`).

### Production Mode

To build and run the application for production:

```bash
pnpm run build
pnpm run start:prod
```

## 🧪 Testing

This project uses Jest for end-to-end testing. The test suite resets the database before running to ensure a clean environment.

To run the e2e tests:

```bash
pnpm run test:e2e
```

## 📖 API Documentation

Once the application is running, you can access the auto-generated Swagger API documentation at:

[**http://localhost:PORT/api**](http://localhost:PORT/api)

This interface allows you to explore and interact with all the available API endpoints.

## 🔌 Websocket

The WebSocket gateway provides real-time communication for features like instant messaging. It uses `socket.io` and authenticates clients using the same JWT provided by the REST API.

The client must connect to the socket server with the `Authorization` header containing the bearer token.

![Socket Gateway](docs/socket-gateway.png)

### Events

- **Client Emits:**
  - `joinConversation` (payload: `string` - conversationId): To join a specific conversation room.
  - `leaveConversation` (payload: `string` - conversationId): To leave a conversation room.

- **Server Emits:**
  - `newMessage` (payload: `Message`): When a new message is sent in a joined conversation.
  - `newConversation` (payload: `ConversationEntity`): When the user is added to a new conversation.

## ☁️ Deployment

This API is deployed on [Koyeb](https://www.koyeb.com/) using its native Git-driven deployment. The `Dockerfile` is provided to facilitate a consistent local development environment.

The `start:migrate:prod` script is the recommended command for Koyeb's run configuration to ensure migrations are applied before the application starts.
