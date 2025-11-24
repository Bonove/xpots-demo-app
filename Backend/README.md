# Backend Setup

## Environment Variables

De backend heeft een `.env` bestand nodig met de volgende variabelen:

### Vereiste variabelen:

```env
RETELL_API_KEY=your_retell_api_key_here
```

### Optionele variabelen:

```env
PORT=8080
```

## Setup instructies:

1. Maak een `.env` bestand aan in de Backend directory
2. Voeg je Retell API key toe:
   ```env
   RETELL_API_KEY=je_api_key_hier
   ```
3. De API key kun je ophalen op: https://platform.retellai.com/

**Let op:** Het `.env` bestand staat al in `.gitignore` en wordt niet gecommit naar git.

## Server starten:

```bash
# Installeer dependencies (eerste keer)
npm install

# Start de server
npm start
# Of direct:
node index.js
```

De server draait standaard op poort 8080 (of de poort die je in PORT hebt ingesteld).

## API Endpoints

- **POST** `/create-web-call` - Maakt een nieuwe Retell web call aan
  - Vereist: `agent_id` in request body
  - Optioneel: `metadata`, `retell_llm_dynamic_variables`
  
- **GET** `/health` - Health check endpoint

Zie de hoofdbestand [README.md](../README.md) voor volledige setup instructies.

