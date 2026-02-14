/**
 * 🐉 TOOTHLESS - Daily Command
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getEconomy, setEconomy, loadJSON, saveJSON } = require('../../utils/jsonStorage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('🎁 Riscuoti il tuo bonus giornaliero'),

  cooldown: 86400, // 24 ore

  async execute(interaction) {
    const cooldowns = loadJSON('cooldowns.json');
    const key = `daily_${interaction.guild.id}_${interaction.user.id}`;
    const lastClaim = cooldowns[key] || 0;
    const now = Date.now();
    const cooldownTime = 24 * 60 * 60 * 1000; // 24 ore

    if (now - lastClaim < cooldownTime) {
      const remaining = cooldownTime - (now - lastClaim);
      const hours = Math.floor(remaining / (60 * 60 * 1000));
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('⏰ Cooldown Attivo')
            .setDescription(`Puoi riscuotere il daily tra **${hours}h ${minutes}m**`)
            .setColor('#ED4245')
        ],
        ephemeral: true
      });
    }

    const amount = Math.floor(Math.random() * 500) + 500; // 500-1000
    const economy = getEconomy(interaction.guild.id, interaction.user.id);
    economy.wallet += amount;
    setEconomy(interaction.guild.id, interaction.user.id, economy);

    cooldowns[key] = now;
    saveJSON('cooldowns.json', cooldowns);

    const embed = new EmbedBuilder()
      .setTitle('🎁 Bonus Giornaliero!')
      .setDescription(`Hai ricevuto **${amount.toLocaleString()}** 🪙!`)
      .setColor('#57F287')
      .addFields(
        { name: 'Nuovo Saldo', value: `\`${economy.wallet.toLocaleString()}\` 🪙`, inline: true }
      )
      .setFooter({ text: 'Torna domani per un altro bonus!' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
