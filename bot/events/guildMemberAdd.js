/**
 * 🐉 TOOTHLESS - Event: Guild Member Add (Welcome)
 */

const { Events, EmbedBuilder } = require('discord.js');
const { getGuildConfig } = require('../utils/jsonStorage');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member, client) {
    const config = getGuildConfig(member.guild.id);
    
    if (!config.welcome?.enabled || !config.welcome?.channelId) return;

    const channel = member.guild.channels.cache.get(config.welcome.channelId);
    if (!channel) return;

    // Sostituisci variabili nel messaggio
    let message = config.welcome.message || 'Benvenuto {user}!';
    message = message
      .replace(/{user}/g, `<@${member.id}>`)
      .replace(/{username}/g, member.user.username)
      .replace(/{server}/g, member.guild.name)
      .replace(/{memberCount}/g, member.guild.memberCount);

    const embed = new EmbedBuilder()
      .setTitle('👋 Benvenuto!')
      .setDescription(message)
      .setColor('#57F287')
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `Membro #${member.guild.memberCount}` })
      .setTimestamp();

    try {
      await channel.send({ embeds: [embed] });

      // Assegna ruolo automatico
      if (config.welcome.roleId) {
        const role = member.guild.roles.cache.get(config.welcome.roleId);
        if (role) {
          await member.roles.add(role);
        }
      }
    } catch (error) {
      console.error('[WELCOME] Errore:', error.message);
    }
  }
};
