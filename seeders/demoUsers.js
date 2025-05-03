// seeders/demoUsers.js
'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Verificar se já existem usuários
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" LIMIT 1;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length > 0) {
      console.log('Usuários de demonstração já existem, pulando...');
      return;
    }

    // Adicionar usuários de demonstração
    return queryInterface.bulkInsert('Users', [
      {
        id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        name: 'Administrador Demo',
        email: 'admin@exemplo.com',
        password: await bcrypt.hash('senha123', 10),
        department: 'RH',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'd290f1ee-6c54-4b01-90e6-d701748f0852',
        name: 'Usuário Demo',
        email: 'usuario@exemplo.com',
        password: await bcrypt.hash('senha123', 10),
        department: 'Desenvolvimento',
        role: 'employee',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};