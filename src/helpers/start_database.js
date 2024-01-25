const path = require('path');
const fs = require('fs/promises');
const dbPath = path.join(__dirname, '../../database.sqlite');

module.exports = {
    async ensureDatabaseFile() {
        try {
            await fs.access(dbPath);
        } catch (error) {
            console.log(`O arquivo ${dbPath} não existe. Criando...`);
            await fs.writeFile(dbPath, '');
            console.log('Arquivo criado com sucesso.');
        }
    },
    async initializeDatabase(db) {
        try {
            await db.run('CREATE TABLE IF NOT EXISTS baseRegister (userId TEXT PRIMARY KEY, messageId TEXT);');
        } catch (error) {
            console.error('Erro ao criar a tabela userPoints:', error.message);
        }
    }
}
