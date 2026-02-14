/**
 * 🐉 TOOTHLESS - Comando /help
 * Mostra tutti i comandi disponibili
 */

const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('📚 Mostra tutti i comandi disponibili')
    .addStringOption(opt => opt
      .setName('categoria')
      .setDescription('Categoria specifica')
      .setRequired(false)
      .addChoices(
        { name: '🛡️ Moderazione', value: 'moderation' },
        { name: '💰 Economia', value: 'economy' },
        { name: '🎮 Fun', value: 'fun' },
        { name: '🔧 Utility', value: 'utility' },
        { name: '⚙️ Config', value: 'config' }
      )),

  async execute(interaction, ctx) {
    const { client } = ctx;
    const category = interaction.options.getString('categoria');

    const categories = {
      config: {
        emoji: '⚙️',
        title: 'Configurazione',
        color: '#57F287',
        description: 'Configura il bot via Discord',
        commands: [
          { name: '/config view', desc: 'Visualizza configurazione corrente' },
          { name: '/config welcomer', desc: 'Configura messaggi di benvenuto' },
          { name: '/config log', desc: 'Configura canale log moderazione' },
          { name: '/config tickets', desc: 'Configura sistema ticket' },
          { name: '/config levels', desc: 'Configura sistema livelli' },
          { name: '/config prefix', desc: 'Imposta prefisso comandi' },
          { name: '/config reset', desc: 'Resetta configurazione' }
        ]
      },
      moderation: {
        emoji: '🛡️',
        title: 'Moderazione',
        color: '#ED4245',
        description: 'Comandi per gestire il server',
        commands: [
          { name: '/ban', desc: 'Banna un utente' },
          { name: '/kick', desc: 'Espelli un utente' },
          { name: '/timeout', desc: 'Metti in timeout' },
          { name: '/warn', desc: 'Gestisci avvertimenti' },
          { name: '/clear', desc: 'Elimina messaggi' }
        ]
      },
      economy: {
        emoji: '💰',
        title: 'Economia',
        color: '#FFD700',
        description: 'Sistema economico',
        commands: [
          { name: '/balance', desc: 'Controlla saldo' },
          { name: '/daily', desc: 'Bonus giornaliero' },
          { name: '/work', desc: 'Lavora per guadagnare' },
          { name: '/pay', desc: 'Trasferisci monete' }
        ]
      },
      fun: {
        emoji: '🎮',
        title: 'Fun',
        color: '#9B59B6',
        description: 'Comandi divertenti',
        commands: [
          { name: '/8ball', desc: 'Palla magica' },
          { name: '/coinflip', desc: 'Lancia moneta' },
          { name: '/dice', desc: 'Lancia dado' }
        ]
      },
      utility: {
        emoji: '🔧',
        title: 'Utility',
        color: '#3498DB',
        description: 'Strumenti utili',
        commands: [
          { name: '/avatar', desc: 'Mostra avatar' },
          { name: '/serverinfo', desc: 'Info server' },
          { name: '/userinfo', desc: 'Info utente' },
          { name: '/ping', desc: 'Latenza bot' }
        ]
      }
    };

    // Mostra categoria specifica
    if (category && categories[category]) {
      const cat = categories[category];
      const embed = new EmbedBuilder()
        .setTitle(`${cat.emoji} ${cat.title}`)
        .setDescription(`*${cat.description}*\n\n` + 
          cat.commands.map(c => `**${c.name}**\n└ ${c.desc}`).join('\n\n'))
        .setColor(cat.color)
        .setFooter({ text: 'Toothless Bot v3.0' })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    // Menu principale
    const totalCommands = Object.values(categories).reduce((acc, cat) => acc + cat.commands.length, 0);

    const embed = new EmbedBuilder()
      .setTitle('🐉 Toothless Bot - Centro Comandi')
      .setDescription(
        `Benvenuto nel centro comandi di **Toothless Bot**!\n\n` +
        `📊 **Statistiche:**\n` +
        `┣ 🤖 Server attivi: \`${client.guilds?.cache?.size || 'N/A'}\`\n` +
        `┣ 👥 Utenti: \`${client.guilds?.cache?.reduce((acc, g) => acc + g.memberCount, 0)?.toLocaleString() || 'N/A'}\`\n` +
        `┗ ⚡ Comandi: \`${totalCommands}\`\n\n` +
        `Seleziona una categoria dal menu o usa \`/help <categoria>\``
      )
      .setColor('#57F287')
      .addFields(
        Object.entries(categories).map(([key, cat]) => ({
          name: `${cat.emoji} ${cat.title}`,
          value: `\`${cat.commands.length}\` comandi`,
          inline: true
        }))
      )
      .setFooter({ text: `Toothless Bot v3.0 • ${totalCommands} comandi totali` })
      .setTimestamp();

    const selectMenu = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('help_menu')
          .setPlaceholder('📚 Seleziona una categoria...')
          .addOptions(
            Object.entries(categories).map(([key, cat]) => ({
              label: cat.title,
              description: `${cat.commands.length} comandi`,
              value: key,
              emoji: cat.emoji
            }))
          )
      );

    await interaction.reply({ embeds: [embed], components: [selectMenu] });
  }
};
