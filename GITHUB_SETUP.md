# GitHub Repository Setup

## Stap 1: Maak een nieuwe repository aan op GitHub

1. Ga naar [GitHub.com](https://github.com) en log in
2. Klik op het **"+"** icoon rechtsboven → **"New repository"**
3. Vul in:
   - **Repository name:** `xparc-demo-app` (of een andere naam)
   - **Description:** "XPOTS Voice Demo App - React frontend with Retell AI integration"
   - **Visibility:** Kies Public of Private
   - **DON'T** initialiseer met README, .gitignore of license (we hebben die al)
4. Klik **"Create repository"**

## Stap 2: Push je code naar GitHub

Na het aanmaken van de repository krijg je instructies. Voer deze commando's uit in je terminal:

```bash
cd /Users/tristanvandoorn@makerlab.nl/Documents/xparc-demo-app

# Voeg de remote repository toe (vervang USERNAME en REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Of met SSH (als je SSH keys hebt ingesteld):
# git remote add origin git@github.com:USERNAME/REPO_NAME.git

# Push naar GitHub
git branch -M main
git push -u origin main
```

## Stap 3: Verifieer

Ga naar je GitHub repository pagina en controleer of alle bestanden er staan.

## Wat is er al gecommit?

✅ Alle source code (Backend en Frontend)
✅ README.md met setup instructies
✅ RENDER_DEPLOYMENT.md met deployment guide
✅ .gitignore bestanden
✅ Package.json bestanden

❌ **NIET gecommit:**
- `node_modules/` (wordt genegeerd)
- `.env` bestanden (wordt genegeerd)
- Build outputs (`dist/`, `build/`)
- Logs en temporary files

## Volgende stappen

Na het pushen naar GitHub kun je:
1. De repository koppelen aan Render.com voor deployment
2. Collaborators toevoegen
3. Issues en project management instellen

