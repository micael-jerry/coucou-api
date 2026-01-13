# 🚀 Project Roadmap: "High-Level" Backend & Real-Time Mastery

This document outlines the step-by-step plan to transform the current backend into a professional-grade, scalable, and secure system. It is designed as a **Learning Path** to help you master these concepts.

---

## 🛠️ Phase 0: Real-Time (Socket.io) Best Practices
*Goal: Fix security gaps and prepare the socket layer for scalability.*

### 1. Robust Authentication & Guards
- **The Problem:** Currently, token extraction is manual in `handleConnection`.
- **The Fix:** Implement a dedicated `WsJwtGuard` using NestJS Guards.
- **Steps:**
    - [ ] Create `WsJwtGuard` that extends `AuthGuard('jwt')` but works for WebSockets.
    - [ ] Apply `@UseGuards(WsJwtGuard)` to the `SocketGateway` class.
    - [ ] **Result:** Clean, standard authentication logic reused from HTTP.
- **📚 Learning Resources:**
    - [📖 NestJS Docs: Gateways & Guards](https://docs.nestjs.com/websockets/gateways#security)
    - [🎥 Video: Secure WebSockets in NestJS](https://www.youtube.com/watch?v=5kEK83G5njo)
    - [📄 Article: NestJS WebSocket Authentication Best Practices](https://wanago.io/2021/01/25/api-nestjs-chat-websockets-authentication/)

### 2. Validation & Security (Room Management)
- **The Problem:** Users can join ANY conversation room just by emitting `joinConversation` with an ID, without checking if they belong to it.
- **The Fix:** Validate membership against the database before joining.
- **Steps:**
    - [ ] Inject `ConversationService` (or Prisma) into `SocketGateway`.
    - [ ] In `joinConversation`, check `prisma.conversation.findFirst({ where: { id: conversationId, members: { some: { userId: currentUser.id } } } })`.
    - [ ] Throw `WsException` if not authorized.
    - [ ] **Result:** No unauthorized eavesdropping.
- **📚 Learning Resources:**
    - [📖 Prisma Docs: Relations & Filtering](https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting)
    - [📖 NestJS Docs: Exception Filters (WsException)](https://docs.nestjs.com/websockets/exception-filters)

### 3. Scalability with Redis Adapter
- **The Problem:** `connectedUsers` is a `Map` in memory. If you restart the server, data is lost. If you add a second server instance, they won't share users.
- **The Fix:** Use Redis to manage socket state and broadcast events across instances.
- **Steps:**
    - [ ] Install `redis` and `@socket.io/redis-adapter`.
    - [ ] Configure the Redis Adapter in `SocketModule` (or `main.ts` depending on setup).
    - [ ] **Result:** The app becomes "Stateless" and horizontally scalable.
- **📚 Learning Resources:**
    - [📖 Socket.io Docs: Redis Adapter](https://socket.io/docs/v4/redis-adapter/)
    - [📖 NestJS Docs: Redis Adapter Setup](https://docs.nestjs.com/websockets/adapter)
    - [🎥 Video: Scaling Socket.io with Redis](https://www.youtube.com/watch?v=FvW8C4a5FvM)

### 4. DTO Validation
- **The Problem:** `conversationId` is treated as a raw string without validation.
- **The Fix:** Use `class-validator` and `ValidationPipe`.
- **Steps:**
    - [ ] Create `JoinConversationDto`.
    - [ ] Use `@UsePipes(new ValidationPipe())` at the gateway or global level.
- **📚 Learning Resources:**
    - [📖 NestJS Docs: Validation](https://docs.nestjs.com/techniques/validation)
    - [📄 Article: Class Validator with WebSockets](https://stackoverflow.com/questions/59362744/nestjs-websocket-validation-pipe)

---

## 🏗️ Phase 1: Architecture & Foundations (SOLID/Clean)
*Goal: Demonstrate architectural maturity.*

### 5. Docker Environment (DevOps)
- **Tooling:** Docker Compose
- **Steps:**
    - [ ] Create `docker-compose.yml`.
    - [ ] Add services: `postgres` (DB), `redis` (Cache/PubSub), `coucou-api` (Node app).
    - [ ] **Result:** `docker-compose up` sets up the entire environment in 1 command.
- **📚 Learning Resources:**
    - [📖 Docker Docs: Get Started](https://docs.docker.com/get-started/)
    - [🎥 Video: Docker for Node.js in 1 Hour](https://www.youtube.com/watch?v=9zUuZq56xRo)
    - [📄 Repo: NestJS Docker Compose Example](https://github.com/tomray/nestjs-docker-compose)

### 6. Clean Architecture Refactoring
- **Tooling:** Domain Driven Design (DDD) principles
- **Steps:**
    - [ ] Refactor one module (e.g., `Conversation`) to separate **Domain Entities** from **Prisma Models**.
    - [ ] Create a "Repository Interface" (e.g., `IConversationRepository`) and implement it with Prisma.
    - [ ] **Result:** Business logic becomes independent of the database framework.
- **📚 Learning Resources:**
    - [📖 Book: "Clean Architecture" by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
    - [📄 Blog: Khalil Stemmler - DDD & TypeScript](https://khalilstemmler.com/articles/software-design-architecture/domain-driven-design-vs-clean-architecture/)
    - [🎥 Video: Clean Architecture in NestJS](https://www.youtube.com/watch?v=8p_hSj7V5G0)

---

## 🚀 Phase 2: Scalability & Performance
*Goal: Show "Engineering" skills.*

### 7. Caching Strategy
- **Tooling:** Redis, `@nestjs/cache-manager`
- **Steps:**
    - [ ] Identify read-heavy endpoints (e.g., `GET /user/profile`, `GET /conversations`).
    - [ ] Implement *Cache-Aside* pattern: Check Redis -> If Miss, DB -> Write to Redis.
    - [ ] **Result:** Response times drop from ~50ms to ~2ms.
- **📚 Learning Resources:**
    - [📖 NestJS Docs: Caching](https://docs.nestjs.com/techniques/caching)
    - [📄 Article: Redis Cache Strategies](https://redis.io/learn/howtos/solutions/caching-architecture)

### 8. Asynchronous Processing (Queues)
- **Tooling:** BullMQ (uses Redis)
- **Steps:**
    - [ ] Move "Send Email" logic out of the request cycle.
    - [ ] Create a `MailQueue` producer and consumer.
    - [ ] **Result:** User registration returns immediately; email sends in background.
- **📚 Learning Resources:**
    - [📖 NestJS Docs: Queues (Bull)](https://docs.nestjs.com/techniques/queues)
    - [🎥 Video: Background Jobs with NestJS & BullMQ](https://www.youtube.com/watch?v=sI57h8p3FQI)

---

## 🛡️ Phase 3: Advanced Security
*Goal: Enterprise-grade security.*

### 9. Secure Session Management
- **Tooling:** Refresh Tokens
- **Steps:**
    - [ ] Store a hashed `refresh_token` in the database.
    - [ ] Short-lived Access Token (15m), Long-lived Refresh Token (7d).
    - [ ] Create `POST /auth/refresh` endpoint.
    - [ ] **Result:** Secure persistent login sessions.
- **📚 Learning Resources:**
    - [📄 Article: Refresh Tokens with NestJS & JWT](https://www.elvisduru.com/blog/nestjs-jwt-authentication-refresh-token) (Highly recommended)
    - [📖 Auth0: Refresh Token Best Practices](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/)

### 10. Rate Limiting
- **Tooling:** `@nestjs/throttler`
- **Steps:**
    - [ ] Configure global limit (e.g., 100 req/min).
    - [ ] **Result:** Protection against brute-force attacks.
- **📚 Learning Resources:**
    - [📖 NestJS Docs: Throttling](https://docs.nestjs.com/security/rate-limiting)

---

## 📊 Phase 4: Observability
*Goal: Production readiness.*

### 11. Monitoring Dashboard
- **Tooling:** Prometheus + Grafana
- **Steps:**
    - [ ] Expose `/metrics` endpoint using `@willsoto/nestjs-prometheus`.
    - [ ] Spin up Grafana in Docker.
    - [ ] Visualize: "Connected Sockets", "Requests per minute", "Error rate".
    - [ ] **Result:** Visual proof of system health.
- **📚 Learning Resources:**
    - [📄 Article: Monitoring NestJS with Prometheus & Grafana](https://dev.to/nestjs/monitoring-nestjs-apps-with-prometheus-and-grafana-1n96)
    - [🎥 Video: Grafana Crash Course](https://www.youtube.com/watch?v=Cqj_m02f8n4)
