require('dotenv').config();

const {
  PORT = 3000,
  MONGO_DB = 'mongodb://localhost:27017/bitfilmsdb',
} = process.env;

module.exports = {
  MONGO_DB,
  PORT,
};
