const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

require('dotenv').config();

const token = process.env.DISCORD_TOKEN ?? 'ABcd123ABcd123ABcd123ABcd123ABcd123.ABcd123.ABcd123ABcd123-ABcd123-ABcd123';
const channelsId = process.env.CHANNELSID.split(",") ?? '1234567891234567891';

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    channelsId.forEach(async channelId => {
        if (message.channel.id === channelId) {
            if (message.attachments.size > 0 && message.attachments.first()) {
                const locationURL = message.attachments.first().url;
                
                try {
                    await message.delete();

                    await message.channel.send({
                        content: `Registro de Base - <@${message.author.id}>`,
                        files: [locationURL],
                    });

                    console.info('Registro de base solicitado por:', message.author.username);
                } catch (error) {
                    console.error('Erro ao apagar a mensagem ou criar o tópico:', error);
                }
            } else if(!message.attachments.first()) {
                console.info('Mensagem Deletada:', message.author.username, "Conteúdo:", message.content);
                await message.delete();
            }
        }
    });
});

client.login(token);