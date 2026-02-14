/**
 * 🐉 TOOTHLESS - Event: Message XP (Levels)
 */

const { Events, EmbedBuilder } = require('discord.js');
const { getGuildConfig, getLevels, setLevels } = require('../utils/jsonStorage');

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    const config = getGuildConfig(message.guild.id);
    if (!config.levels?.enabled) return;

    // Cooldown XP (1 messaggio ogni 60 secondi conta)
    const cooldownKey = `xp_${message.guild.id}_${message.author.id}`;
    if (!client.xpCooldowns) client.xpCooldowns = new Map();
    
    const now = Date.now();
    const lastXp = client.xpCooldowns.get(cooldownKey) || 0;
    if (now - lastXp < 60000) return; // 60 secondi cooldown

    client.xpCooldowns.set(cooldownKey, now);

    // Calcola XP
    const xpMin = config.levels.xpMin || 15;
    const xpMax = config.levels.xpMax || 25;
    const xpGained = Math.floor(Math.random() * (xpMax - xpMin + 1)) + xpMin;

    const userLevels = getLevels(message.guild.id, message.author.id);
    userLevels.xp += xpGained;
    userLevels.totalXp += xpGained;

    // Calcola se level up
    const xpNeeded = 100 * (userLevels.level + 1); // Formula semplice
    if (userLevels.xp >= xpNeeded) {
      userLevels.level += 1;
      userLevels.xp -= xpNeeded;

      // Annuncia level up
      if (config.levels.announceChannelId) {
        const channel = message.guild.channels.cache.get(config.levels.announceChannelId);
        if (channel) {
          const embed = new EmbedBuilder()
            .setTitle('⭐ Level Up!')
            .setDescription(`Congratulazioni <@${message.author.id}>! Sei salito al livello **${userLevels.level}**!`)
            .setColor('#FFD700')
            .setThumbnail(message.author.displayAvatarURL())
            .setTimestamp();

          channel.send({ embeds: [embed] }).catch(() => {});
        }
      }
    }

    setLevels(message.guild.id, message.author.id, userLevels);
  }
};
