// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const routes = require('./routes');

// Inicializar app
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', routes);

// Endpoint raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Pulse App API v1.0',
    status: 'online'
  });
});

// Manipulador de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: true,
    message: 'Erro interno no servidor'
  });
});

// Iniciar servidor
async function startServer() {
  try {
    // Verificar conexão com o banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    
    // Sincronizar modelos com o banco de dados (apenas em ambiente de desenvolvimento)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('Modelos sincronizados com o banco de dados.');
    }
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();