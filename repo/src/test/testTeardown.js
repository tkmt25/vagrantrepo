module.exports = async () => {
    await global.__MONGOOSE_CONN__.dropDatabase();
    await global.__MONGOOSE_CONN__.close();
    await global.__MONGOD__.stop();
};