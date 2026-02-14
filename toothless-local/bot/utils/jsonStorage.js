/**
 * 🐉 TOOTHLESS - JSON Storage Utility
 * Gestione persistenza dati con file JSON
 */

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data');

// Assicura che la cartella data esista
if (!fs.existsSync(DATA_PATH)) {
  fs.mkdirSync(DATA_PATH, { recursive: true });
}

/**
 * Carica un file JSON
 */
function loadJSON(filename, defaultValue = {}) {
  const filepath = path.join(DATA_PATH, filename);
  try {
    if (fs.existsSync(filepath)) {
      const data = fs.readFileSync(filepath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`[JSON] Errore caricamento ${filename}:`, error.message);
  }
  return defaultValue;
}

/**
 * Salva un file JSON
 */
function saveJSON(filename, data) {
  const filepath = path.join(DATA_PATH, filename);
  try {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`[JSON] Errore salvataggio ${filename}:`, error.message);
    return false;
  }
}

// Cache configurazioni guild
let guildConfigs = loadJSON('guilds.json');

/**
 * Ottiene configurazione di una guild
 */
function getGuildConfig(guildId) {
  if (!guildConfigs[guildId]) {
    guildConfigs[guildId] = {
      prefix: '!',
      welcome: { enabled: false, channelId: null, message: 'Benvenuto {user}!' },
      log: { enabled: false, channelId: null },
      tickets: { enabled: false, categoryId: null, supportRoleId: null },
      levels: { enabled: false, announceChannelId: null, xpMin: 15, xpMax: 25 },
      economy: { enabled: true, currency: '🪙' },
      autoroles: []
    };
    saveJSON('guilds.json', guildConfigs);
  }
  return guildConfigs[guildId];
}

/**
 * Imposta configurazione di una guild
 */
function setGuildConfig(guildId, data) {
  guildConfigs[guildId] = { ...guildConfigs[guildId], ...data };
  saveJSON('guilds.json', guildConfigs);
  return guildConfigs[guildId];
}

/**
 * Aggiorna parte della configurazione
 */
function updateGuildConfig(guildId, key, value) {
  const config = getGuildConfig(guildId);
  config[key] = { ...config[key], ...value };
  guildConfigs[guildId] = config;
  saveJSON('guilds.json', guildConfigs);
  return config;
}

// Economy Storage
let economyData = loadJSON('economy.json');

function getEconomy(guildId, userId) {
  if (!economyData[guildId]) economyData[guildId] = {};
  if (!economyData[guildId][userId]) {
    economyData[guildId][userId] = { wallet: 0, bank: 0, inventory: [] };
  }
  return economyData[guildId][userId];
}

function setEconomy(guildId, userId, data) {
  if (!economyData[guildId]) economyData[guildId] = {};
  economyData[guildId][userId] = data;
  saveJSON('economy.json', economyData);
  return data;
}

// Levels Storage
let levelsData = loadJSON('levels.json');

function getLevels(guildId, userId) {
  if (!levelsData[guildId]) levelsData[guildId] = {};
  if (!levelsData[guildId][userId]) {
    levelsData[guildId][userId] = { xp: 0, level: 0, totalXp: 0 };
  }
  return levelsData[guildId][userId];
}

function setLevels(guildId, userId, data) {
  if (!levelsData[guildId]) levelsData[guildId] = {};
  levelsData[guildId][userId] = data;
  saveJSON('levels.json', levelsData);
  return data;
}

// Warns Storage
let warnsData = loadJSON('warns.json');

function getWarns(guildId, userId) {
  if (!warnsData[guildId]) warnsData[guildId] = {};
  if (!warnsData[guildId][userId]) {
    warnsData[guildId][userId] = [];
  }
  return warnsData[guildId][userId];
}

function addWarn(guildId, userId, warn) {
  const warns = getWarns(guildId, userId);
  warns.push({ ...warn, id: Date.now(), timestamp: new Date().toISOString() });
  warnsData[guildId][userId] = warns;
  saveJSON('warns.json', warnsData);
  return warns;
}

function removeWarn(guildId, userId, warnId) {
  const warns = getWarns(guildId, userId);
  const index = warns.findIndex(w => w.id === warnId);
  if (index !== -1) {
    warns.splice(index, 1);
    warnsData[guildId][userId] = warns;
    saveJSON('warns.json', warnsData);
    return true;
  }
  return false;
}

function clearWarns(guildId, userId) {
  if (!warnsData[guildId]) warnsData[guildId] = {};
  warnsData[guildId][userId] = [];
  saveJSON('warns.json', warnsData);
  return true;
}

module.exports = {
  loadJSON,
  saveJSON,
  getGuildConfig,
  setGuildConfig,
  updateGuildConfig,
  getEconomy,
  setEconomy,
  getLevels,
  setLevels,
  getWarns,
  addWarn,
  removeWarn,
  clearWarns
};
