const crypto = require('crypto');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { mongoose } = require('mongoose');

module.exports = async () => {
  const mongoServer = await MongoMemoryServer.create();

  // config
  process.env.DB_URL = mongoServer.getUri();
  process.env.PORT = "3000";
  process.env.ADMIN_USERNAME = "admin";
  process.env.ADMIN_PASSWORD = "password";

  // connect
  await mongoose.connect(mongoServer.getUri());

  // add test users

  // set to global
  global.__MONGOD__ = mongoServer;
  global.__MONGOOSE_CONN__ = mongoose.connection;
};