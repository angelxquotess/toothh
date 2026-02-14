/**
 * 🐉 TOOTHLESS - Balance Command
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getEconomy } = require('../../utils/jsonStorage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('💰 Controlla il tuo saldo')
    .addUserOption(opt => opt
      .setName('utente')
      .setDescription('Utente di cui controllare il saldo')),

  async execute(interaction) {
    const user = interaction.options.getUser('utente') || interaction.user;
    const economy = getEconomy(interaction.guild.id, user.id);
    const total = economy.wallet + economy.bank;

    const embed = new EmbedBuilder()
      .setTitle(`💰 Bilancio di ${user.username}`)
      .setColor('#FFD700')
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: '💵 Portafoglio', value: `\`${economy.wallet.toLocaleString()}\` 🪙`, inline: true },
        { name: '🏦 Banca', value: `\`${economy.bank.toLocaleString()}\` 🪙`, inline: true },
        { name: '📊 Totale', value: `\`${total.toLocaleString()}\` 🪙`, inline: true }
      )
      .setFooter({ text: 'Toothless Economy' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
