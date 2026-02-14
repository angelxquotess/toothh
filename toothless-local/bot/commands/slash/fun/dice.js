/**
 * 🐉 TOOTHLESS - Dice
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('🎲 Lancia uno o più dadi')
    .addIntegerOption(opt => opt
      .setName('numero')
      .setDescription('Numero di dadi da lanciare')
      .setMinValue(1)
      .setMaxValue(10)),

  async execute(interaction) {
    const count = interaction.options.getInteger('numero') || 1;
    const rolls = [];
    
    for (let i = 0; i < count; i++) {
      rolls.push(Math.floor(Math.random() * 6) + 1);
    }

    const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    const total = rolls.reduce((a, b) => a + b, 0);

    const embed = new EmbedBuilder()
      .setTitle('🎲 Lancio Dadi')
      .setDescription(
        `**Risultati:** ${rolls.map(r => diceEmojis[r - 1]).join(' ')}\n` +
        `**Valori:** ${rolls.join(' + ')} = **${total}**`
      )
      .setColor('#3498DB')
      .setFooter({ text: `Lanciati da ${interaction.user.username}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
