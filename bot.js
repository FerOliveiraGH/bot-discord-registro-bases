const { Client, GatewayIntentBits, EmbedBuilder, Bitwise } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const { Database } = require('sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, './database.sqlite');
const db = new Database(dbPath);

const { ensureDatabaseFile, initializeDatabase } = require('./src/helpers/start_database.js')
ensureDatabaseFile().then(initializeDatabase(db));

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
                    db.get(
                        'SELECT channelId, messageId FROM baseRegister WHERE userId = ? AND channelId = ?', 
                        [message.author.id, message.channel.id], 
                        async (err, row) => {
                            if (err) {
                                return console.error(err.message);
                            } 
                            else if (row) {
                                try {
                                    await message.channel.messages.fetch(row.messageId).then(message => {
                                        message.delete()
                                    })
                                } catch (err) {
                                    console.log('Mensagem anterior não foi removida!')
                                }

                                message.channel.send({
                                    content: `Registro de Base - <@${message.author.id}> - **Renovado**`,
                                    files: [attachment.url],
                                }).then(update => {
                                    db.run(
                                        `UPDATE baseRegister SET messageId = ? WHERE userId = ? AND channelId = ?`, 
                                        [update.id, message.author.id, message.channel.id],
                                        (err) => {
                                            if (err) {
                                                return console.log(err.message);
                                            }
                                        }
                                    );

                                    console.info('Registro de base renovado por:', message.author.username);
                                });
                            } else {
                                message.channel.send({
                                    content: `Registro de Base - <@${message.author.id}>`,
                                    files: [attachment.url],
                                }).then(create => {
                                    db.run(
                                        "INSERT INTO baseRegister(userId, channelId, messageId) VALUES(?,?,?)",
                                        [message.author.id, message.channel.id, create.id],
                                        (err) => {
                                            if (err) {
                                                return console.log(err.message);
                                            }
                                        }
                                    );
                                    console.info('Registro de base solicitado por:', message.author.username);
                                });
                            }
                        }
                    );

                    await message.delete();
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