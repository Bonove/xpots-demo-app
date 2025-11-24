# Render.com Deployment Guide

## Overzicht

Voor deze XPOTS Voice Demo App heb je **2 services** nodig op Render.com:

1. **Web Service** - Voor de Express.js backend
2. **Static Site** - Voor de React/Vite frontend

---

## 1. Backend: Web Service

### Service Type
Kies: **Web Service** (globe icon)

### Configuratie

**Name:** `xpots-voice-backend` (of een naam naar keuze)

**Environment:** `Node`

**Build Command:**
```bash
cd Backend && npm install
```

**Start Command:**
```bash
cd Backend && npm start
```

**Root Directory:** Laat leeg (of `Backend` als je de hele repo gebruikt)

### Environment Variables

Voeg de volgende environment variables toe in Render dashboard:

```
RETELL_API_KEY=je_retell_api_key_hier
PORT=10000
```

**Let op:** Render gebruikt automatisch de `PORT` environment variable. Je hoeft deze niet handmatig in te stellen, maar je kunt `10000` gebruiken als fallback.

### Aanbevolen Instellingen

- **Instance Type:** Free tier is voldoende voor development/testing
- **Auto-Deploy:** Yes (automatisch deployen bij git push)
- **Health Check Path:** `/health` (je hebt al een health endpoint)

---

## 2. Frontend: Static Site

### Service Type
Kies: **Static Site** (monitor icon met network symbol)

### Configuratie

**Name:** `xpots-voice-frontend` (of een naam naar keuze)

**Build Command:**
```bash
cd Frontend && npm install && npm run build
```

**Publish Directory:**
```
Frontend/dist
```

**Root Directory:** Laat leeg (of `Frontend` als je de hele repo gebruikt)

### Environment Variables

Voeg de volgende environment variable toe:

```
VITE_BACKEND_URL=https://xpots-voice-backend.onrender.com
```

**Let op:** Vervang `xpots-voice-backend` met de daadwerkelijke naam van je backend service. Render geeft elke service een URL zoals `https://[service-name].onrender.com`.

### Aanbevolen Instellingen

- **Auto-Deploy:** Yes
- **Pull Request Previews:** Optioneel (handig voor testing)

---

## 3. Backend CORS Update

Na het deployen van beide services, moet je de backend CORS configuratie updaten om de frontend URL toe te voegen.

Update `Backend/index.js`:

```javascript
app.use(cors({
   origin: [
       'http://localhost:3000',
       'https://xpots.onrender.com',
       'https://xpots-voice-frontend.onrender.com'  // Voeg je Render frontend URL toe
   ],
   methods: ['GET', 'POST', 'OPTIONS'],
   credentials: true,
   allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Let op:** Vervang `xpots-voice-frontend` met je daadwerkelijke frontend service naam.

---

## 4. Deployment Stappen

### Stap 1: Backend Deployen

1. Ga naar Render dashboard
2. Klik op "New +" → "Web Service"
3. Connect je Git repository
4. Vul de configuratie in zoals hierboven beschreven
5. Voeg environment variables toe (`RETELL_API_KEY`)
6. Klik "Create Web Service"
7. Wacht tot de build en deploy klaar zijn
8. Noteer de URL (bijv. `https://xpots-voice-backend.onrender.com`)

### Stap 2: Frontend Deployen

1. Ga naar Render dashboard
2. Klik op "New +" → "Static Site"
3. Connect dezelfde Git repository
4. Vul de configuratie in zoals hierboven beschreven
5. Voeg environment variable toe (`VITE_BACKEND_URL` met de backend URL uit stap 1)
6. Klik "Create Static Site"
7. Wacht tot de build en deploy klaar zijn
8. Noteer de URL (bijv. `https://xpots-voice-frontend.onrender.com`)

### Stap 3: Backend CORS Updaten

1. Update `Backend/index.js` met de frontend URL
2. Commit en push naar Git
3. Render zal automatisch opnieuw deployen

---

## 5. Troubleshooting

### Backend start niet

- Controleer of `RETELL_API_KEY` correct is ingesteld
- Controleer de logs in Render dashboard
- Zorg dat `npm start` script werkt lokaal

### Frontend kan niet verbinden met backend

- Controleer of `VITE_BACKEND_URL` correct is ingesteld
- Controleer of de backend URL bereikbaar is (test in browser)
- Controleer CORS instellingen in backend

### Build faalt

- Controleer of alle dependencies in `package.json` staan
- Controleer de build logs in Render dashboard
- Test de build lokaal eerst: `npm run build`

---

## 6. Kosten

- **Free Tier:** Beide services kunnen op de free tier draaien
  - Web Service: Kan na 15 minuten inactiviteit "slapen"
  - Static Site: Altijd beschikbaar, geen slaap modus
- **Paid Tier:** Voor production gebruik, overweeg betaalde tier voor:
  - Backend altijd beschikbaar (geen slaap modus)
  - Snellere response times
  - Meer resources

---

## 7. Alternatieve Setup (Optioneel)

Als je de backend altijd beschikbaar wilt hebben zonder slaap modus, kun je ook overwegen:

- **Private Service:** Als je de backend alleen intern wilt gebruiken
- **Background Worker:** Niet nodig voor deze app

Voor deze app zijn **Web Service** en **Static Site** de juiste keuzes.

