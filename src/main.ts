import * as dotenv from "dotenv";
import { Client, Events, GatewayIntentBits } from "discord.js";

dotenv.config({ path: '.env' });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

try {

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
    
    client.login(process.env.TOKEN);
    
} catch (error) {
    console.log(error);
}