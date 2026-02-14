# 🐉 Toothless Bot v3.0 - Versione Locale

Bot Discord completo con dashboard web per hosting sul tuo PC.

## 📋 Requisiti

- **Node.js** 18+ (https://nodejs.org/)
- **Python** 3.9+ (https://python.org/)
- **Git** (opzionale)

## 🚀 Installazione Rapida

### Windows
1. Doppio click su `install.bat`
2. Doppio click su `deploy-commands.bat` (solo la prima volta)
3. Doppio click su `start-all.bat`

### Linux/Mac
```bash
# Installa dipendenze
cd bot && npm install
cd ../backend && pip install -r requirements.txt
cd ../frontend && npm install

# Deploy comandi (solo prima volta)
cd bot && node deploy-commands.js

# Avvia tutto (in terminali separati)
cd backend && uvicorn server:app --port 8001
cd frontend && npm start
cd bot && node index.js
```

## ⚙️ Configurazione

### 1. Configura il Bot Discord
Modifica `bot/.env`:
```env
TOKEN=il_tuo_token
CLIENT_ID=il_tuo_client_id
CLIENT_SECRET=il_tuo_client_secret
```

### 2. Configura OAuth2 su Discord Developer Portal
1. Vai su https://discord.com/developers/applications
2. Seleziona la tua applicazione
3. OAuth2 > Redirects > Aggiungi: `http://localhost:3000/callback`

## 📂 Struttura

```
toothless-local/
├── bot/                 # Bot Discord (Node.js)
│   ├── commands/        # Comandi slash
│   ├── events/          # Eventi Discord
│   ├── utils/           # Utility JSON storage
│   ├── data/            # Dati salvati (JSON)
│   └── index.js         # Entry point bot
├── backend/             # API Dashboard (Python FastAPI)
│   ├── data/            # Configurazioni server
│   └── server.py        # API server
├── frontend/            # Dashboard Web (React)
│   └── src/
├── install.bat          # Installa tutto
├── deploy-commands.bat  # Registra comandi Discord
├── start-all.bat        # Avvia tutto
└── stop-all.bat         # Ferma tutto
```

## 🎮 Comandi Slash Configurazione

Configura il bot direttamente da Discord:
- `/config view` - Visualizza configurazione
- `/config welcomer` - Messaggi di benvenuto
- `/config log` - Canale log moderazione
- `/config tickets` - Sistema ticket
- `/config levels` - Sistema livelli/XP
- `/config prefix` - Prefisso comandi
- `/config reset` - Resetta tutto

## 🌐 URL Locali

- **Dashboard**: http://localhost:3000
- **API Backend**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs

## ❓ Troubleshooting

### "EADDRINUSE" - Porta già in uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <numero> /F
```

### Bot non si connette
- Verifica il TOKEN nel file `.env`
- Assicurati che il bot sia invitato nel server

### OAuth2 non funziona
- Aggiungi `http://localhost:3000/callback` nei Redirects su Discord Developer Portal

---

🐉 **Toothless Bot v3.0** - Made with ❤️
