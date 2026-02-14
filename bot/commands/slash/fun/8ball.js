/**
 * 🐉 TOOTHLESS - Comandi Fun
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// 8ball
module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('🎱 Fai una domanda alla palla magica')
    .addStringOption(opt => opt
      .setName('domanda')
      .setDescription('La tua domanda')
      .setRequired(true)),

  async execute(interaction) {
    const question = interaction.options.getString('domanda');
    const responses = [
      '✅ Certamente!',
      '✅ Sì, assolutamente!',
      '✅ Senza dubbio!',
      '🤔 Probabile...',
      '🤔 Forse...',
      '🤔 Non saprei...',
      '❌ Non credo proprio',
      '❌ Assolutamente no!',
      '❌ Le stelle dicono di no',
      '🎲 Chiedi di nuovo più tardi'
    ];

    const embed = new EmbedBuilder()
      .setTitle('🎱 Palla Magica')
      .setColor('#9B59B6')
      .addFields(
        { name: '❓ Domanda', value: question },
        { name: '🔮 Risposta', value: responses[Math.floor(Math.random() * responses.length)] }
      )
      .setFooter({ text: `Richiesto da ${interaction.user.username}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
