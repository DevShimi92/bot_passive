// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');

require('dotenv').config({ path: '.env' });

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

process.once('SIGINT', function(){
    console.log('Déconnexion (SIGINT)');
    client.destroy();
})

process.once('SIGTERM', function(){
    console.log('Déconnexion (SIGTERM)');
    client.destroy();
})

// Log in to Discord with your client's token
client.login(process.env.TOKEN);