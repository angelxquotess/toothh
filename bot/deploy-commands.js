/**
 * 🐉 TOOTHLESS - Deploy Slash Commands
 * Esegui questo script per registrare i comandi su Discord
 */

require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands', 'slash');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  const stat = fs.statSync(folderPath);
  
  if (stat.isDirectory()) {
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const command = require(filePath);
      if ('data' in command) {
        commands.push(command.data.toJSON());
        console.log(`[+] ${command.data.name}`);
      }
    }
  } else if (folderPath.endsWith('.js')) {
    const command = require(folderPath);
    if ('data' in command) {
      commands.push(command.data.toJSON());
      console.log(`[+] ${command.data.name}`);
    }
  }
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(`\n🚀 Registrando ${commands.length} comandi...\n`);

    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log(`\n✅ ${data.length} comandi registrati con successo!`);
  } catch (error) {
    console.error('❌ Errore:', error);
  }
})();
