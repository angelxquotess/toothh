/**
 * 🐉 TOOTHLESS - Comando /ping
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('🏓 Controlla la latenza del bot'),

  async execute(interaction, ctx) {
    const { client } = ctx;
    const sent = await interaction.reply({ content: '🏓 Calcolando...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(client.ws.ping);

    const embed = new EmbedBuilder()
      .setTitle('🐉 Pong!')
      .setColor(latency < 200 ? '#57F287' : latency < 500 ? '#FEE75C' : '#ED4245')
      .addFields(
        { name: '📡 Latenza Bot', value: `\`${latency}ms\``, inline: true },
        { name: '🌐 API Discord', value: `\`${apiLatency}ms\``, inline: true },
        { name: '⏱️ Uptime', value: `\`${Math.floor(client.uptime / 60000)} minuti\``, inline: true }
      )
      .setTimestamp();

    await interaction.editReply({ content: null, embeds: [embed] });
  }
};
