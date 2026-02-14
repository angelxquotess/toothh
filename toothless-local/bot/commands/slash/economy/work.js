/**
 * 🐉 TOOTHLESS - Work Command
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getEconomy, setEconomy, loadJSON, saveJSON } = require('../../utils/jsonStorage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('💼 Lavora per guadagnare monete'),

  async execute(interaction) {
    const cooldowns = loadJSON('cooldowns.json');
    const key = `work_${interaction.guild.id}_${interaction.user.id}`;
    const lastWork = cooldowns[key] || 0;
    const now = Date.now();
    const cooldownTime = 60 * 60 * 1000; // 1 ora

    if (now - lastWork < cooldownTime) {
      const remaining = cooldownTime - (now - lastWork);
      const minutes = Math.floor(remaining / (60 * 1000));

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('⏰ Sei stanco!')
            .setDescription(`Puoi lavorare di nuovo tra **${minutes} minuti**`)
            .setColor('#ED4245')
        ],
        ephemeral: true
      });
    }

    const jobs = [
      { name: 'Programmatore', emoji: '💻' },
      { name: 'Chef', emoji: '👨‍🍳' },
      { name: 'Medico', emoji: '👨‍⚕️' },
      { name: 'Streamer', emoji: '🎥' },
      { name: 'Artista', emoji: '🎨' },
      { name: 'Musicista', emoji: '🎵' },
      { name: 'Pilota', emoji: '✈️' },
      { name: 'Veterinario', emoji: '🐾' }
    ];

    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const amount = Math.floor(Math.random() * 300) + 100; // 100-400

    const economy = getEconomy(interaction.guild.id, interaction.user.id);
    economy.wallet += amount;
    setEconomy(interaction.guild.id, interaction.user.id, economy);

    cooldowns[key] = now;
    saveJSON('cooldowns.json', cooldowns);

    const embed = new EmbedBuilder()
      .setTitle('💼 Lavoro Completato!')
      .setDescription(`${job.emoji} Hai lavorato come **${job.name}** e hai guadagnato **${amount.toLocaleString()}** 🪙!`)
      .setColor('#57F287')
      .addFields(
        { name: 'Nuovo Saldo', value: `\`${economy.wallet.toLocaleString()}\` 🪙`, inline: true }
      )
      .setFooter({ text: 'Puoi lavorare di nuovo tra 1 ora' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
