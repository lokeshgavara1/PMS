import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'cutm_pms',
  process.env.DB_USER || 'cutm_user',
  process.env.DB_PASSWORD || 'cutm_password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export default sequelize;
