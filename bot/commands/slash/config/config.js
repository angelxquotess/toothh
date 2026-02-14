/**
 * 🐉 TOOTHLESS - Comando /config
 * Configurazione del bot tramite slash command
 */

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { getGuildConfig, setGuildConfig, updateGuildConfig } = require('../../utils/jsonStorage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('⚙️ Configura il bot per questo server')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub => sub
      .setName('welcomer')
      .setDescription('Configura i messaggi di benvenuto')
      .addBooleanOption(opt => opt.setName('enabled').setDescription('Attiva/Disattiva').setRequired(true))
      .addChannelOption(opt => opt.setName('canale').setDescription('Canale per i messaggi').addChannelTypes(ChannelType.GuildText))
      .addStringOption(opt => opt.setName('messaggio').setDescription('Messaggio di benvenuto (usa {user}, {server}, {memberCount})'))
      .addRoleOption(opt => opt.setName('ruolo').setDescription('Ruolo da assegnare automaticamente')))
    .addSubcommand(sub => sub
      .setName('log')
      .setDescription('Configura il canale log moderazione')
      .addBooleanOption(opt => opt.setName('enabled').setDescription('Attiva/Disattiva').setRequired(true))
      .addChannelOption(opt => opt.setName('canale').setDescription('Canale per i log').addChannelTypes(ChannelType.GuildText)))
    .addSubcommand(sub => sub
      .setName('tickets')
      .setDescription('Configura il sistema ticket')
      .addBooleanOption(opt => opt.setName('enabled').setDescription('Attiva/Disattiva').setRequired(true))
      .addChannelOption(opt => opt.setName('categoria').setDescription('Categoria per i ticket').addChannelTypes(ChannelType.GuildCategory))
      .addRoleOption(opt => opt.setName('supporto').setDescription('Ruolo del team supporto')))
    .addSubcommand(sub => sub
      .setName('levels')
      .setDescription('Configura il sistema livelli')
      .addBooleanOption(opt => opt.setName('enabled').setDescription('Attiva/Disattiva').setRequired(true))
      .addChannelOption(opt => opt.setName('canale').setDescription('Canale annunci level-up').addChannelTypes(ChannelType.GuildText))
      .addIntegerOption(opt => opt.setName('xp_min').setDescription('XP minimo per messaggio').setMinValue(1).setMaxValue(100))
      .addIntegerOption(opt => opt.setName('xp_max').setDescription('XP massimo per messaggio').setMinValue(1).setMaxValue(100)))
    .addSubcommand(sub => sub
      .setName('prefix')
      .setDescription('Imposta il prefisso per i comandi prefix')
      .addStringOption(opt => opt.setName('prefisso').setDescription('Nuovo prefisso').setRequired(true).setMaxLength(5)))
    .addSubcommand(sub => sub
      .setName('view')
      .setDescription('Visualizza la configurazione corrente'))
    .addSubcommand(sub => sub
      .setName('reset')
      .setDescription('Resetta tutte le configurazioni')),

  async execute(interaction, ctx) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    let config = getGuildConfig(guildId);

    // View config
    if (sub === 'view') {
      const embed = new EmbedBuilder()
        .setTitle('🐉 Configurazione Toothless')
        .setColor('#57F287')
        .setDescription(`Configurazione per **${interaction.guild.name}**`)
        .addFields(
          { 
            name: '👋 Welcomer', 
            value: `Stato: ${config.welcome?.enabled ? '✅ Attivo' : '❌ Disattivo'}\nCanale: ${config.welcome?.channelId ? `<#${config.welcome.channelId}>` : 'Non impostato'}\nMessaggio: \`${config.welcome?.message || 'Default'}\``, 
            inline: true 
          },
          { 
            name: '📝 Log', 
            value: `Stato: ${config.log?.enabled ? '✅ Attivo' : '❌ Disattivo'}\nCanale: ${config.log?.channelId ? `<#${config.log.channelId}>` : 'Non impostato'}`, 
            inline: true 
          },
          { 
            name: '🎫 Tickets', 
            value: `Stato: ${config.tickets?.enabled ? '✅ Attivo' : '❌ Disattivo'}\nCategoria: ${config.tickets?.categoryId ? `<#${config.tickets.categoryId}>` : 'Non impostato'}`, 
            inline: true 
          },
          { 
            name: '⭐ Livelli', 
            value: `Stato: ${config.levels?.enabled ? '✅ Attivo' : '❌ Disattivo'}\nXP: ${config.levels?.xpMin || 15}-${config.levels?.xpMax || 25} per msg`, 
            inline: true 
          },
          { 
            name: '⚙️ Generale', 
            value: `Prefisso: \`${config.prefix || '!'}\``, 
            inline: true 
          }
        )
        .setFooter({ text: 'Usa /config <modulo> per modificare' })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    // Reset config
    if (sub === 'reset') {
      setGuildConfig(guildId, {
        prefix: '!',
        welcome: { enabled: false, channelId: null, message: 'Benvenuto {user}!' },
        log: { enabled: false, channelId: null },
        tickets: { enabled: false, categoryId: null, supportRoleId: null },
        levels: { enabled: false, announceChannelId: null, xpMin: 15, xpMax: 25 },
        economy: { enabled: true, currency: '🪙' },
        autoroles: []
      });

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('🔄 Configurazione Resettata')
            .setDescription('Tutte le impostazioni sono state ripristinate ai valori predefiniti.')
            .setColor('#57F287')
        ]
      });
    }

    // Prefix
    if (sub === 'prefix') {
      const prefix = interaction.options.getString('prefisso');
      config.prefix = prefix;
      setGuildConfig(guildId, config);

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('✅ Prefisso Aggiornato')
            .setDescription(`Il nuovo prefisso è: \`${prefix}\``)
            .setColor('#57F287')
        ]
      });
    }

    // Welcomer
    if (sub === 'welcomer') {
      const enabled = interaction.options.getBoolean('enabled');
      const channel = interaction.options.getChannel('canale');
      const message = interaction.options.getString('messaggio');
      const role = interaction.options.getRole('ruolo');

      config.welcome = {
        ...config.welcome,
        enabled,
        channelId: channel?.id || config.welcome?.channelId,
        message: message || config.welcome?.message || 'Benvenuto {user}!',
        roleId: role?.id || config.welcome?.roleId
      };
      setGuildConfig(guildId, config);

      const embed = new EmbedBuilder()
        .setTitle('👋 Welcomer Configurato')
        .setColor('#57F287')
        .addFields(
          { name: 'Stato', value: enabled ? '✅ Attivo' : '❌ Disattivo', inline: true },
          { name: 'Canale', value: channel ? `<#${channel.id}>` : 'Invariato', inline: true },
          { name: 'Ruolo Auto', value: role ? `<@&${role.id}>` : 'Nessuno', inline: true },
          { name: 'Messaggio', value: `\`${config.welcome.message}\``, inline: false }
        )
        .setFooter({ text: 'Variabili: {user} {server} {memberCount}' });

      return interaction.reply({ embeds: [embed] });
    }

    // Log
    if (sub === 'log') {
      const enabled = interaction.options.getBoolean('enabled');
      const channel = interaction.options.getChannel('canale');

      config.log = {
        enabled,
        channelId: channel?.id || config.log?.channelId
      };
      setGuildConfig(guildId, config);

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('📝 Log Configurato')
            .setColor('#57F287')
            .addFields(
              { name: 'Stato', value: enabled ? '✅ Attivo' : '❌ Disattivo', inline: true },
              { name: 'Canale', value: channel ? `<#${channel.id}>` : (config.log.channelId ? `<#${config.log.channelId}>` : 'Non impostato'), inline: true }
            )
        ]
      });
    }

    // Tickets
    if (sub === 'tickets') {
      const enabled = interaction.options.getBoolean('enabled');
      const category = interaction.options.getChannel('categoria');
      const supportRole = interaction.options.getRole('supporto');

      config.tickets = {
        enabled,
        categoryId: category?.id || config.tickets?.categoryId,
        supportRoleId: supportRole?.id || config.tickets?.supportRoleId
      };
      setGuildConfig(guildId, config);

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('🎫 Tickets Configurato')
            .setColor('#E91E63')
            .addFields(
              { name: 'Stato', value: enabled ? '✅ Attivo' : '❌ Disattivo', inline: true },
              { name: 'Categoria', value: category ? `<#${category.id}>` : 'Invariato', inline: true },
              { name: 'Ruolo Supporto', value: supportRole ? `<@&${supportRole.id}>` : 'Invariato', inline: true }
            )
        ]
      });
    }

    // Levels
    if (sub === 'levels') {
      const enabled = interaction.options.getBoolean('enabled');
      const channel = interaction.options.getChannel('canale');
      const xpMin = interaction.options.getInteger('xp_min');
      const xpMax = interaction.options.getInteger('xp_max');

      config.levels = {
        enabled,
        announceChannelId: channel?.id || config.levels?.announceChannelId,
        xpMin: xpMin || config.levels?.xpMin || 15,
        xpMax: xpMax || config.levels?.xpMax || 25
      };
      setGuildConfig(guildId, config);

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('⭐ Livelli Configurato')
            .setColor('#FFD700')
            .addFields(
              { name: 'Stato', value: enabled ? '✅ Attivo' : '❌ Disattivo', inline: true },
              { name: 'Canale Annunci', value: channel ? `<#${channel.id}>` : 'Invariato', inline: true },
              { name: 'XP per Messaggio', value: `${config.levels.xpMin} - ${config.levels.xpMax}`, inline: true }
            )
        ]
      });
    }
  }
};
