// models/feedback.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    static associate(models) {
      // Definir associações
      Feedback.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }
  
  Feedback.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    motivation: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 10
      }
    },
    wellbeing: {  // Campo alternativo de motivation, conforme observado no mock-api
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 10
      }
    },
    workload: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 10
      }
    },
    performance: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 10
      }
    },
    productivity: {  // Campo alternativo de performance, conforme observado no mock-api
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 10
      }
    },
    support: {
      type: DataTypes.ENUM('Sim', 'Não', 'Em partes'),
      allowNull: true
    },
    positiveEvent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    improvementSuggestion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    comment: {  // Campo de comentários genéricos, conforme observado no mock-api
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Feedback'
  });
  
  return Feedback;
};