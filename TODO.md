# 🚀 Feuille de route — `coucou-api`

---

## Phase 0 — Temps réel WebSocket (Priorité 1)

> Les packages sont déjà installés : `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io`.

### Étape 0.1 — Créer le module Gateway

Créer le dossier `src/modules/gateway/` avec les fichiers suivants :

- `gateway.module.ts` — Module NestJS classique qui déclare et exporte le gateway et le service de session
- `app.gateway.ts` — Le gateway WebSocket principal
- `session.service.ts` — Service qui maintient la liste des sockets connectés
- `guards/ws-jwt.guard.ts` — Guard d'authentification WebSocket

📖 [NestJS Docs — Gateways](https://docs.nestjs.com/websockets/gateways)

---

### Étape 0.2 — SessionService

Créer un service injectable qui maintient une **map `userId → liste de socketIds`**.

- Méthodes à implémenter : `add`, `remove`, `getSockets`, `isOnline`
- Un même utilisateur peut avoir plusieurs sockets (multi-onglets)

> ⚠️ **Scalabilité :** En production multi-instances, remplacer la Map en mémoire par un **Redis Adapter**. L'interface reste identique.

📖 [Socket.io — Redis Adapter](https://socket.io/docs/v4/redis-adapter/)

---

### Étape 0.3 — WsJwtGuard

Créer un guard WebSocket (implémente `CanActivate`) qui :

1. Lit le JWT depuis `client.handshake.auth.token` ou le header `Authorization`
2. Le valide via `JwtService`
3. Attache le payload décodé à `client.data`
4. Déconnecte le socket et lève une exception si invalide

📖 [NestJS Docs — Guards WebSocket](https://docs.nestjs.com/websockets/gateways#security)  
📄 [Article : Auth WebSocket NestJS](https://wanago.io/2021/01/25/api-nestjs-chat-websockets-authentication/)

---

### Étape 0.4 — AppGateway

Créer le gateway principal (décoré avec `@WebSocketGateway`) qui implémente `OnGatewayConnection` et `OnGatewayDisconnect`.

**Logique de connexion (`handleConnection`) :**
- Extraire et valider le JWT
- Si invalide → déconnecter le socket immédiatement
- Si valide → enregistrer le socket dans `SessionService`

**Logique de déconnexion (`handleDisconnect`) :**
- Retirer le socket du `SessionService`

**Méthode publique `emitToUsers(userIds, event, payload)` :**
- Pour chaque userId, récupérer ses socketIds via `SessionService`
- Émettre l'événement ciblé via `server.to(socketId).emit(...)`
- Cette méthode sera appelée par les services HTTP après persistance en base

> 💡 **Principe clé :** Le gateway ne contient aucune logique métier. Les endpoints HTTP restent les déclencheurs. Les services injectent le gateway uniquement pour émettre.

---

### Étape 0.5 — Enregistrer GatewayModule dans AppModule

Ajouter `GatewayModule` dans les imports de `src/app.module.ts`.

---

### Étape 0.6 — Émettre `new_message` depuis MessageService

**Dans `message.module.ts`** : ajouter `GatewayModule` aux imports.

**Dans `message.service.ts`** : injecter `AppGateway`, puis après la sauvegarde du message appeler `emitToUsers` avec les IDs de tous les membres de la conversation et l'événement `new_message`.

> ⚠️ Note : `ConversationEntity.members` est typé `{ user: User }[]` — l'id est sur `member.user.id`.

---

### Étape 0.7 — Émettre `new_conversation` depuis ConversationService

**Dans `conversation.module.ts`** : ajouter `GatewayModule` aux imports.

**Dans `conversation.service.ts`** : injecter `AppGateway`, puis après la création de la conversation appeler `emitToUsers` avec les membres et l'événement `new_conversation`.

---

### Étape 0.8 — Émettre les événements depuis FriendRequestService

**Dans `friend-request.module.ts`** : ajouter `GatewayModule` aux imports.

**Dans `friend-request.service.ts`** : injecter `AppGateway`, puis :
- Après `sendFriendRequests` → émettre `friend_request` au **destinataire**
- Après `updateFriendRequestStatus` → émettre `friend_request_updated` à l'**expéditeur original**

---

### Récapitulatif des événements

| Événement | Déclencheur | Destinataires |
|-----------|-------------|---------------|
| `new_message` | `POST /messages` | Membres de la conversation |
| `new_conversation` | `POST /conversations` | Membres créés |
| `friend_request` | Envoi d'une demande | Utilisateur cible |
| `friend_request_updated` | Acceptation/rejet | Expéditeur original |

---

### Connexion côté client

Se connecter avec `io(url, { auth: { token: '<JWT>' } })` et écouter les événements ci-dessus.

---

## Phase 1 — Sécurité avancée

### Étape 1.1 — Refresh Tokens
- [ ] Stocker un `refresh_token` hashé en base sur le modèle `User`
- [ ] Access Token : courte durée (15min) — Refresh Token : longue durée (7j)
- [ ] Créer `POST /auth/refresh` pour obtenir un nouveau access token
- [ ] Créer `POST /auth/logout` pour invalider le refresh token

📄 [Article : Refresh Tokens NestJS](https://www.elvisduru.com/blog/nestjs-jwt-authentication-refresh-token)

### Étape 1.2 — Rate Limiting
- [ ] Installer `@nestjs/throttler`
- [ ] Configurer une limite globale (ex : 100 req/min)
- [ ] Appliquer des limites plus strictes sur les endpoints sensibles (`/auth/login`, `/auth/refresh`)

📖 [NestJS Docs — Throttling](https://docs.nestjs.com/security/rate-limiting)

---

## Phase 2 — Performance & Scalabilité

### Étape 2.1 — Mise en cache Redis
- [ ] Identifier les endpoints en lecture intensive (`GET /conversations`, etc.)
- [ ] Appliquer le pattern **Cache-Aside** : lire le cache d'abord, sinon DB, puis écrire dans le cache
- [ ] Invalider le cache lors des mutations

📖 [NestJS Docs — Caching](https://docs.nestjs.com/techniques/caching)

### Étape 2.2 — Queue pour les emails (BullMQ)
- [ ] Extraire la logique d'envoi d'email de `AuthService` vers un job asynchrone
- [ ] L'endpoint `/auth/register` retourne immédiatement, l'email part en arrière-plan

📖 [NestJS Docs — Queues BullMQ](https://docs.nestjs.com/techniques/queues)

---

## Phase 3 — Observabilité

### Étape 3.1 — Monitoring (Prometheus + Grafana)
- [ ] Exposer un endpoint `/metrics`
- [ ] Visualiser les métriques clés : sockets connectés, requêtes/min, taux d'erreur
- [ ] Intégrer à `docker-compose.yml`

📄 [Article : Monitoring NestJS + Prometheus + Grafana](https://dev.to/nestjs/monitoring-nestjs-apps-with-prometheus-and-grafana-1n96)

---

## Phase 4 — Fonctionnalités Originales & IA (Pour se démarquer) 🌟

L'objectif ici est de sortir du cadre classique "app de chat" et de montrer une capacité à intégrer des services modernes et des workflows complexes.

### Étape 4.1 — Intelligence Artificielle (Analyse & Résumé)
- [ ] Intégration d'un LLM intégré (ou API OpenAI/Mistral) pour résumer les conversations longues ou les "messages ratés".
- [ ] Analyse de sentiment en arrière-plan : nettoyage/avertissement en cas de messages toxiques ou système de "mood" général d'un groupe.
- [ ] *Smart Replies* : générer côté serveur des suggestions de réponses rapides contextuelles.

### Étape 4.2 — Traitement Asynchrone de Médias
- [ ] Transcriptions Vocales : Upload d'un mémo vocal → Déclenchement d'un job BullMQ → Utilisation de *Whisper API* pour transcrire l'audio en texte → Mise à jour du message en DB et notification WebSocket en temps réel.
- [ ] Génération de "Rich Link Previews" : Lorsqu'un lien est envoyé, un job récupère les *meta tags* (OpenGraph) de la page de façon asynchrone sans bloquer l'envoi du message, puis pousse la mise à jour au client.

### Étape 4.3 — Messages Éphémères (Cron Jobs)
- [ ] Ajouter une notion de TTL (Time To Live) sur les messages ("mode secret").
- [ ] Utiliser `@nestjs/schedule` (Cron) pour nettoyer périodiquement en base de données les messages expirés, ou utiliser l'expiration native si un cache Redis est utilisé.

---

## Phase 5 — Concepts Techniques Back-end Avancés 🚀🌍

Ces concepts démontreront une expertise technique pointue (niveau Intermédiaire/Senior), idéale pour un CV et pour valoriser l'application.

### Étape 5.1 — Moteur de Recherche Full-Text (Meilisearch / Elasticsearch)
- [ ] Synchroniser les entités `User` et `Message` depuis PostgreSQL vers un moteur de recherche spécialisé.
- [ ] Implémenter une recherche globale floue (typo tolerance) ultra-rapide côté backend (chercher un mot-clé dans tous les messages ou retrouver un profil facilement).

### Étape 5.2 — Architecture CQRS (Command Query Responsibility Segregation)
- [ ] Refactoriser les fonctionnalités clés (ex: le module Message) pour séparer clairement les flux de "Commandes" (envois, suppressions) et de "Queries" (récupération d'historiques).
- [ ] Utiliser `@nestjs/cqrs` avec des Event Handlers. Cela prouvera votre excellente maîtrise des architectures modulaires scalables.

### Étape 5.3 — WebRTC Signaling Server
- [ ] Préparer l'app pour des appels audio/vidéo peer-to-peer fluides.
- [ ] Le backend ne va pas streamer la vidéo mais agira comme **Serveur de Signalisation** (via les WebSockets existants) pour gérer de manière fiable l'échange des *Offers*, *Answers* et *ICE candidates* (le standard des télécoms temps réel).

### Étape 5.4 — Intégration GraphQL (Approche hybride)
- [ ] Maintenir le REST pour des endpoints simples (auth, etc.), mais exposer un endpoint GraphQL (`@nestjs/graphql` + Apollo) pour les arborescences de données complexes.
- [ ] *Très recherché en entreprise* : cela permet au client (mobile ou web) de définir lui-même la forme de l'historique de chat qu'il souhaite récupérer, en éliminant l'overfetching (récupération de données superflues).

---

## Phase 6 — Gamification & Architecture Événementielle 🎮

### Étape 6.1 — Système d'Achievements (EventEmitter)
- [ ] Utilisation intensive et élégante de `@nestjs/event-emitter`.
- [ ] Lors d'actions intéressantes (ex: envoi du 100ème message, profil entièrement complété, interactions multiples), le backend émet un événement interne totalement découplé.
- [ ] Un *listener* indépendant traite discrètement l'événement, débloque un "Badge" utilisateur en DB, puis déclenche un WebSocket qui affichera une animation (ex: pop-up de succès) côté front-end sans ralentir la navigation.
