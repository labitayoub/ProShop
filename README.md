# 🛍️ ProShop - Plateforme E-Commerce de Produits Digitaux

Bienvenue dans le dépôt principal de **ProShop**. Ce projet est une application complète (Fullstack) permettant à des créateurs de vendre des produits digitaux (eBooks, logiciels, vidéos) et à des clients de les acheter et les télécharger de manière sécurisée.

L'application a été scindée en deux parties distinctes :
1. **Frontend :** Une application Next.js 15 (React) avec TailwindCSS v4, offrant une expérience UI/UX premium (Glassmorphism, animations fluides).
2. **Backend :** Une API robuste développée en NestJS (Node.js) orchestrant une base de données PostgreSQL via l'ORM Prisma.

---

## 🚀 Fonctionnalités Principales

*   **Authentification Sécurisée :** Gérée intégralement par **Auth0**. Seuls les utilisateurs connectés (JWT validé côté serveur) peuvent vendre, acheter ou télécharger.
*   **Tableau de Bord Vendeur :** Un formulaire interactif permettant l'upload sécurisé de fichiers très lourds (Image de couverture & ZIP/PDF).
*   **Catalogue Dynamique :** Une boutique rapide affichant tous les produits disponibles, générée côté serveur (SSR) pour des performances optimales et un SEO parfait.
*   **Achat en un clic :** (Sans Stripe) Les achats sont simulés instantanément et rattachés au compte utilisateur en base de données de manière transactionnelle.
*   **Bibliothèque & Téléchargements :** Un espace "My Purchases" pour retrouver ses acquisitions historiques. Les fichiers originaux des vendeurs sont cachés derrière un proxy sécurisé, empêchant tout accès non autorisé (vérification de la propriété du produit au moment du téléchargement).

---

## 🛠️ Stack Technique

### Frontend (`/frontend`)
*   **Framework :** Next.js 15 (App Router)
*   **Langage :** TypeScript
*   **Stylisation :** TailwindCSS v4
*   **Authentification :** `@auth0/nextjs-auth0`
*   **Composants & Icônes :** `lucide-react`

### Backend (`/backend`)
*   **Framework :** NestJS v11
*   **Langage :** TypeScript
*   **Base de Données :** PostgreSQL 15 (via Docker)
*   **ORM :** Prisma
*   **Authentification :** `passport-jwt` avec clés publiques dynamiques (JWKS Auth0)
*   **Gestion de Fichiers :** `multer` & `fs` (Streaming direct)

---

## ⚙️ Comment lancer le projet localement ?

### 1. Prérequis
- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) (Pour lancer PostgreSQL rapidement)
- Un compte [Auth0](https://auth0.com/) avec un "Application" et une "API" configurés.

### 2. Démarrer la Base de Données
À la racine du projet, lancez le conteneur Docker :
```bash
docker-compose up -d
```

### 3. Configurer et lancer le Backend (NestJS)
Ouvrez un terminal dans le dossier `/backend`.
```bash
cd backend
npm install
```
**Variables d'environnement :**
Créez ou modifiez le fichier `/backend/.env` avec vos informations Auth0 :
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/prosets?schema=public"
AUTH0_ISSUER_URL="https://votredomaine.eu.auth0.com"
AUTH0_AUDIENCE="votre-api-audience"
```
**Base de données & Lancement :**
```bash
npx prisma migrate dev
npm run start:dev
```
L'API écoutera sur `http://localhost:3001`.

### 4. Configurer et lancer le Frontend (Next.js)
Ouvrez un autre terminal dans le dossier `/frontend`.
```bash
cd frontend
npm install
```
**Variables d'environnement :**
Créez ou modifiez le fichier `/frontend/.env.local` avec vos identifiants Auth0 et le secret Next.js (vous pouvez utiliser `openssl rand -hex 32`):
```env
AUTH0_SECRET="une-chaine-longue-et-aleatoire"
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_ISSUER_BASE_URL="https://votredomaine.eu.auth0.com"
AUTH0_CLIENT_ID="votre-client-id"
AUTH0_CLIENT_SECRET="votre-client-secret"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```
**Lancement :**
```bash
npm run dev
```
Le Frontend écoutera sur `http://localhost:3000`.
