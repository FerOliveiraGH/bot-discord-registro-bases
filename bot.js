const { Client, GatewayIntentBits, EmbedBuilder, Bitwise } = require('discord.js');
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
const channelsId = process.env.CHANNELSID.split(",") ?? ['1234567891234567891'];

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    channelsId.forEach(async channelId => {
        if (message.channel.id === channelId) {
            const typeImg = ['image/jpeg', 'image/png'];
            const attachment = message.attachments.first();
            if (message.attachments.size > 0 && attachment && typeImg.includes(attachment.contentType)) {
                try {
                    let renewed = "";
                    try {
                        const messages = await message.channel.messages.fetch();
                        const mentionedMessage = messages.find(msg => msg.mentions.has(message.author));

                        if (mentionedMessage) {
                            renewed = " - **Renovado**"
                            await mentionedMessage.delete()
                        }
                    }
                    catch {
                        console.log(`falha ao remover a registro anterior`);
                    }
                    
                    await message.delete();

                    await message.channel.send({
                        content: `Registro de Base - <@${message.author.id}>${renewed}`,
                        files: [attachment.url],
                    });

                    console.info('Registro de base solicitado por:', message.author.username);
                } catch (error) {
                    console.error('Erro ao apagar a mensagem ou criar o tópico:', error);
                }
            } else {
                console.info('Mensagem Deletada:', message.author.username, "Conteúdo:", message.content);
                await message.delete();
            }
        }
    });
});

client.login(token);