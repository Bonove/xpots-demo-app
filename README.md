# XPOTS Voice Demo App

Een voice assistant applicatie met React frontend en Express backend, geïntegreerd met Retell AI.

## 📋 Vereisten

- **Node.js** (versie 18 of hoger)
- **npm** (of yarn)
- **Retell API Key** (haal op van https://platform.retellai.com/)

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Ga naar de Backend directory
cd Backend

# Installeer dependencies
npm install

# Maak een .env bestand aan
echo "RETELL_API_KEY=je_api_key_hier" > .env
echo "PORT=8080" >> .env

# Start de backend server
node index.js
```

De backend draait nu op `http://localhost:8080`

**Let op:** Zorg ervoor dat je een geldige Retell API key hebt ingesteld in het `.env` bestand!

### 2. Frontend Setup

Open een **nieuwe terminal** en voer uit:

```bash
# Ga naar de Frontend directory
cd Frontend

# Installeer dependencies
npm install

# Start de development server
npm run dev
```

De frontend draait nu op `http://localhost:3000` (standaard Vite poort)

## 📁 Project Structuur

Dit is een **monorepo** - één repository met twee aparte applicaties die onafhankelijk van elkaar deployed kunnen worden:

```
xparc-demo-app/
├── Backend/              # Express.js API server
│   ├── index.js          # Express server met Retell API integratie
│   ├── package.json
│   ├── .env              # Environment variables (niet in git)
│   └── README.md         # Backend-specifieke documentatie
│
├── Frontend/             # React/Vite applicatie
│   ├── src/
│   │   ├── App.tsx       # Hoofdcomponent
│   │   ├── components/   # React componenten
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utility functies
│   ├── package.json
│   └── vite.config.ts    # Vite configuratie
│
└── RENDER_DEPLOYMENT.md  # Deployment instructies voor Render.com
```

### Voordelen Monorepo

- **Gecentraliseerd:** Alle code in één repository
- **Onafhankelijk deploybaar:** Backend en Frontend kunnen apart gedeployed worden
- **Shared configuratie:** Gedeelde tooling en configuratie waar nodig
- **Eenvoudig versiebeheer:** Alle wijzigingen in één git history

## 🔧 Development Commands

### Backend

```bash
cd Backend

# Server starten
node index.js

# Of met npm (als je een start script toevoegt)
npm start
```

### Frontend

```bash
cd Frontend

# Development server starten
npm run dev

# Production build maken
npm run build

# Preview production build
npm run preview

# Code linten
npm run lint
```

## 🌐 API Endpoints

### Backend Endpoints

- **POST** `/create-web-call` - Maakt een nieuwe Retell web call aan
  - Body: `{ agent_id: string, metadata?: object, retell_llm_dynamic_variables?: object }`
  
- **GET** `/health` - Health check endpoint

## ⚙️ Environment Variables

### Backend (.env)

```env
RETELL_API_KEY=your_retell_api_key_here
PORT=8080
```

### Frontend

De frontend gebruikt standaard `http://localhost:8080` als backend URL. Je kunt dit overschrijven met een environment variable:

```env
VITE_BACKEND_URL=http://localhost:8080
```

## 🐛 Troubleshooting

### Backend start niet

- Controleer of poort 8080 beschikbaar is
- Zorg dat `.env` bestand bestaat met `RETELL_API_KEY`
- Controleer of alle dependencies geïnstalleerd zijn: `npm install`

### Frontend kan niet verbinden met backend

- Controleer of de backend draait op `http://localhost:8080`
- Controleer CORS instellingen in `Backend/index.js`
- Controleer de `VITE_BACKEND_URL` environment variable

### Retell API errors

- Controleer of je API key geldig is
- Controleer of je agent ID correct is ingevuld in de frontend
- Bekijk de backend console logs voor meer details

## 📝 Notities

- De backend gebruikt `dotenv` voor environment variables
- De frontend gebruikt Vite voor development en build tooling
- CORS is geconfigureerd voor `localhost:3000` en `https://xpots.onrender.com`

## 🚢 Deployment

Deze monorepo is ontworpen om backend en frontend **apart** te deployen:

### Render.com (Aanbevolen)

Zie [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) voor volledige instructies.

**Backend:** Deploy als Web Service (Node.js)
**Frontend:** Deploy als Static Site (Vite build)

### Andere Platforms

- **Vercel:** Frontend deploy (gebruik `Frontend/` als root directory)
- **Railway:** Backend deploy (gebruik `Backend/` als root directory)
- **Netlify:** Frontend deploy (gebruik `Frontend/dist` als publish directory)
- **Heroku:** Backend deploy (gebruik root directory met aangepast build command)

## 🔗 Links

- [GitHub Repository](https://github.com/Bonove/xpots-demo-app)
- [Retell AI Platform](https://platform.retellai.com/)
- [Retell API Documentatie](https://docs.retellai.com/)

