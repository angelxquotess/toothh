# 🐉 Toothless Bot v3.0

Bot Discord completo con dashboard web e configurazione via slash commands.

## 📦 Installazione

### Windows (Batch Files)
1. Esegui `install.bat` per installare le dipendenze
2. Configura il file `.env` con le tue credenziali
3. Esegui `deploy-commands.bat` per registrare i comandi
4. Esegui `start-bot.bat` per avviare il bot
5. (Opzionale) Esegui `start-all.bat` per avviare bot + dashboard

### Linux/Mac
```bash
npm install
npm run deploy
npm start
```

## ⚙️ Configurazione

Crea un file `.env` con:
```env
TOKEN=il_tuo_token_discord
CLIENT_ID=il_tuo_client_id
CLIENT_SECRET=il_tuo_client_secret
PREFIX=!
DASHBOARD_URL=http://localhost:3000
API_PORT=3001
```

## 🎮 Comandi Slash

### ⚙️ Configurazione (via Discord)
- `/config view` - Visualizza configurazione
- `/config welcomer` - Configura messaggi di benvenuto
- `/config log` - Configura canale log
- `/config tickets` - Configura sistema ticket
- `/config levels` - Configura sistema livelli
- `/config prefix` - Imposta prefisso
- `/config reset` - Resetta configurazione

### 💰 Economia
- `/balance` - Controlla saldo
- `/daily` - Bonus giornaliero
- `/work` - Lavora per guadagnare

### 🎮 Fun
- `/8ball` - Palla magica
- `/coinflip` - Lancia moneta
- `/dice` - Lancia dadi

### 🔧 Utility
- `/help` - Lista comandi
- `/ping` - Latenza bot

## 📁 Struttura
```
bot/
├── commands/
│   └── slash/
│       ├── config/    # Comandi configurazione
│       ├── economy/   # Comandi economia
│       └── fun/       # Comandi divertenti
├── events/            # Eventi Discord
├── utils/             # Utility (jsonStorage)
├── data/              # File JSON dati
├── index.js           # Entry point
├── deploy-commands.js # Script deploy
└── *.bat              # File batch Windows
```

## 🗃️ Storage JSON

Tutti i dati sono salvati in file JSON nella cartella `data/`:
- `guilds.json` - Configurazioni server
- `economy.json` - Dati economia
- `levels.json` - Dati livelli
- `warns.json` - Avvertimenti
- `cooldowns.json` - Cooldown comandi

## 🌐 Dashboard

La dashboard web permette di:
- Login con Discord OAuth2
- Configurare welcomer, log, tickets, livelli
- Visualizzare statistiche
- Gestire più server

---

🐉 **Toothless Bot v3.0** - Made with ❤️
