/**
 * ========================================
 * 🐉 TOOTHLESS BOT v3.0.0
 * ========================================
 * Discord Bot con Dashboard e Configurazione via Slash Commands
 */

require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Events, REST, Routes, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

// Importa utility JSON
const { loadJSON, saveJSON, getGuildConfig, setGuildConfig } = require('./utils/jsonStorage');

// ========================================
// CONFIGURAZIONE CLIENT
// ========================================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration
  ]
});

client.commands = new Collection();
client.cooldowns = new Collection();

// ========================================
// CARICAMENTO COMANDI
// ========================================
const commandsPath = path.join(__dirname, 'commands', 'slash');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  const stat = fs.statSync(folderPath);
  
  if (stat.isDirectory()) {
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const command = require(filePath);
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`[CMD] Caricato: ${command.data.name}`);
      }
    }
  } else if (folderPath.endsWith('.js')) {
    const command = require(folderPath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      console.log(`[CMD] Caricato: ${command.data.name}`);
    }
  }
}

// ========================================
// EVENTI
// ========================================
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
    console.log(`[EVT] Caricato: ${event.name}`);
  }
}

// ========================================
// HANDLER INTERAZIONI
// ========================================
client.on(Events.InteractionCreate, async interaction => {
  // Slash Commands
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    // Cooldown check
    const { cooldowns } = client;
    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const defaultCooldown = 3;
    const cooldownAmount = (command.cooldown ?? defaultCooldown) * 1000;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return interaction.reply({
          content: `⏱️ Aspetta ${timeLeft.toFixed(1)} secondi prima di usare \`/${command.data.name}\` di nuovo.`,
          ephemeral: true
        });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
      // Passa contesto al comando
      const ctx = {
        client,
        isEphemeral: false,
        getConfig: () => getGuildConfig(interaction.guild.id),
        setConfig: (data) => setGuildConfig(interaction.guild.id, data)
      };
      await command.execute(interaction, ctx);
    } catch (error) {
      console.error(`[ERR] Comando ${interaction.commandName}:`, error);
      const errorMessage = { content: '❌ Si è verificato un errore!', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
  }

  // Autocomplete
  if (interaction.isAutocomplete()) {
    const command = client.commands.get(interaction.commandName);
    if (!command?.autocomplete) return;
    try {
      await command.autocomplete(interaction);
    } catch (error) {
      console.error('[ERR] Autocomplete:', error);
    }
  }

  // Buttons
  if (interaction.isButton()) {
    // Handle button interactions if needed
  }
});

// ========================================
// READY EVENT
// ========================================
client.once(Events.ClientReady, () => {
  console.log('\n========================================');
  console.log('🐉 TOOTHLESS BOT v3.0.0');
  console.log('========================================');
  console.log(`✅ Connesso come ${client.user.tag}`);
  console.log(`📊 Server: ${client.guilds.cache.size}`);
  console.log(`👥 Utenti: ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}`);
  console.log(`⚡ Comandi: ${client.commands.size}`);
  console.log('========================================\n');

  // Imposta attività
  client.user.setActivity('/help | Toothless v3.0', { type: ActivityType.Watching });
});

// ========================================
// EXPRESS API (per Dashboard)
// ========================================
const app = express();
app.use(cors());
app.use(express.json());

// API per ottenere info bot
app.get('/api/bot/status', (req, res) => {
  res.json({
    online: client.isReady(),
    guilds: client.guilds.cache.size,
    users: client.guilds.cache.reduce((a, g) => a + g.memberCount, 0),
    commands: client.commands.size,
    uptime: client.uptime
  });
});

// API per ottenere config guild
app.get('/api/guild/:guildId/config', (req, res) => {
  const config = getGuildConfig(req.params.guildId);
  res.json(config);
});

// API per aggiornare config guild
app.post('/api/guild/:guildId/config', (req, res) => {
  const config = setGuildConfig(req.params.guildId, req.body);
  res.json({ success: true, config });
});

const API_PORT = process.env.API_PORT || 3001;
app.listen(API_PORT, () => {
  console.log(`🌐 API Server attivo su porta ${API_PORT}`);
});

// ========================================
// LOGIN
// ========================================
client.login(process.env.TOKEN).catch(err => {
  console.error('❌ Errore login:', err.message);
  process.exit(1);
});
