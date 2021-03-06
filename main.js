const { Client, Collection, Intents } = require('discord.js');
const log4js = require('log4js');
const fs = require('node:fs');
const path = require('node:path');
const Sequelize = require('sequelize');

log4js.configure('./configs/log4js.json');

const log = require('log4js').getLogger('Sequelize');

require('dotenv').config({ path: '.env' });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	host: 'localhost',
	dialect: 'postgres',
	protocol: 'postgres',
	logging: msg => log.trace(msg),
});

const client = new Client(
	{
		intents: [
			Intents.FLAGS.GUILDS,
			Intents.FLAGS.GUILD_VOICE_STATES,
		],
	});

client.player = new Collection();
client.player.set('numberOfPlayer', 0);

client.playlist = new Collection();
client.paused = new Collection();

client.database = new Collection();

client.database.set('db', sequelize);
client.database.set('lockScan', false);

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(client, interaction);
	}
	catch (error) {
		log.error('[ ' + interaction.member.guild.name + ' ] ' + 'Error with ' + interaction.commandName);
		log.error(error);
		if (interaction.commandName == 'play-yt') {
			await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
		else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}

	}
});

client.login(process.env.TOKEN);
