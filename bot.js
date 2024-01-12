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
            if (message.attachments.size > 0 && message.attachments.first()) {
                const locationURL = message.attachments.first().url;
                
                try {
                    const messages = await message.channel.messages.fetch();
                    const mentionedMessage = messages.find(msg => msg.mentions.has(message.author));

                    if (mentionedMessage) {
                        const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`<@${message.author.id}> você já possui registro, favor abrir um [ticket](https://discord.com/channels/1159615012562800721/1159640760732373104) para trocar a localização.`);

                        await mentionedMessage.reply({
                            embeds: [embed],
                            ephemeral: true
                        });

                        await message.delete();

                        console.log(`${message.author.username} foi mencionado em mensagens anteriores.`);
                    } else {
                        await message.channel.send({
                            content: `Registro de Base - <@${message.author.id}>`,
                            files: [locationURL],
                        });

                        await message.delete();
    
                        console.info('Registro de base solicitado por:', message.author.username);
                    }
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