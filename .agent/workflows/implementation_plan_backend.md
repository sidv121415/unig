---
description: Plan for integrating Spring Boot backend for User Management and Favorites
---

# Hybrid Architecture Plan: React (RAWG) + Spring Boot (User Data)

This plan outlines how to add a Spring Boot backend to handle "User Logic" (Login, Favorites, My Games) while maintaining direct access to RAWG for general game data.

## 1. Architecture Overview

```mermaid
graph TD
    User[Browser / React App]
    
    subgraph Frontend Logic
        User -->|1. Get Games (Public)| RAWG_API[RAWG API]
        User -->|2. Login / Save Favorites| Spring_Boot[Spring Boot Backend]
    end
    
    subgraph Backend Logic
        Spring_Boot -->|Stores User Info| DB[(Database H2/MySQL)]
    end
```

### Key Decisions
*   **Public Data**: Continued usage of `api.rawg.io` for browsing, searching, and viewing game details.
*   **Private Data**: Spring Boot handles user accounts and lists of saved games.
*   **Data Stored**: We will store the `game_id`, `name`, and `background_image` in our local database. usage: When a user views their "Favorites" page, we load data from our backend. When they click a favorite, we fetch full details from RAWG using the `game_id`.

## 2. Database Schema

We need two primary entity concepts: **Users** and **Favorites**.

### Table: `users`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | Long (PK) | Auto-increment |
| `username` | String | Unique |
| `password` | String | Encrypted (BCrypt) |

### Table: `favorites`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | Long (PK) | Auto-increment |
| `user_id` | Long (FK) | Links to User |
| `game_id` | Integer | ID from RAWG |
| `title` | String | Cached name for display |
| `image_url` | String | Cached banner for display |
| `added_at` | Timestamp | For sorting |

## 3. Spring Boot Components (Backend)

We will create a standard 3-layer architecture:

1.  **Controllers (`/api`)**:
    *   `AuthController`: `/auth/register`, `/auth/login`
    *   `FavoritesController`: `/api/favorites` (GET, POST, DELETE)
2.  **Services**: Business logic to handle mapping and validation.
3.  **Repositories**: Interfaces extending `JpaRepository` to talk to the DB.
4.  **Security**: `Spring Security` + `JWT` (JSON Web Token) filter. This ensures only logged-in users can save games.

### API Endpoints

| Method | Endpoint | Purpose | Params/Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Create account | `{username, password}` |
| `POST` | `/auth/login` | Login | `{username, password}` -> Returns JWT |
| `GET` | `/api/favorites` | List my games | Header: `Authorization: Bearer <token>` |
| `POST` | `/api/favorites` | Add game | `{gameId, title, imageUrl}` |
| `DELETE` | `/api/favorites/{id}` | Remove game | Path var: `id` (RAWG ID) |

## 4. Frontend Integration (React)

We will need to add a few things to the React app:

1.  **New File**: `src/service/backendClient.ts`
    *   Similar to `apiClient.ts` but points to `http://localhost:8080`.
    *   Automatically attaches the JWT token from `localStorage` to every request.
2.  **Auth Context**: A React Context to store the `user` object and `login/logout` functions so buttons specifically change (e.g., "Login" becomes "My Profile").
3.  **UI Updates**:
    *   **NavBar**: Add a `Login` button (or simple modal).
    *   **Game Card**: Add a "Heart" icon. Unfilled = not favorite, Red = favorite.
    *   **Favorites Page**: A new grid page that displays games fetched from *our* backend.

## 5. Implementation Steps

1.  **Initialize Backend**: Create `backend/` folder with Spring Initializr (Web, JPA, H2/MySQL, Security, Lombok).
2.  **Setup Security**: Implement JWT generation and validation logic.
3.  **Create Entities**: Define `User` and `Favorite` Java classes.
4.  **Build API**: Write the Controllers and simple Service methods.
5.  **Connect Frontend**: Write the `backendClient` in React and test the connection.
