/**
 * 🐉 TOOTHLESS - Coinflip
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('🪙 Lancia una moneta'),

  async execute(interaction) {
    const result = Math.random() < 0.5 ? 'Testa' : 'Croce';
    const emoji = result === 'Testa' ? '🫨' : '🪙';

    const embed = new EmbedBuilder()
      .setTitle('🪙 Lancio Moneta')
      .setDescription(`La moneta gira in aria...\n\n${emoji} **${result}!**`)
      .setColor('#FFD700')
      .setFooter({ text: `Lanciata da ${interaction.user.username}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
