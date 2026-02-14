/**
 * 🐉 TOOTHLESS - Event: Ready
 */

const { Events, ActivityType } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log('\n========================================');
    console.log('🐉 TOOTHLESS BOT v3.0.0 - ONLINE');
    console.log('========================================');
    console.log(`✅ ${client.user.tag}`);
    console.log(`📊 Server: ${client.guilds.cache.size}`);
    console.log(`⚡ Comandi: ${client.commands.size}`);
    console.log('========================================\n');

    // Set activity
    client.user.setPresence({
      activities: [{ name: '/help | v3.0', type: ActivityType.Watching }],
      status: 'online'
    });

    // Cambia attività ogni 30 secondi
    const activities = [
      { name: '/help | Toothless v3.0', type: ActivityType.Watching },
      { name: `${client.guilds.cache.size} server`, type: ActivityType.Watching },
      { name: 'con i draghi 🐉', type: ActivityType.Playing }
    ];

    let i = 0;
    setInterval(() => {
      client.user.setActivity(activities[i]);
      i = (i + 1) % activities.length;
    }, 30000);
  }
};
