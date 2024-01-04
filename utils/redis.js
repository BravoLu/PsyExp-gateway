const redis = require("redis");
const util = require("util");

// redis config

const redisCli = redis.createClient({ host: "127.0.0.1", port: 6379 });


module.exports = { redisCli };
