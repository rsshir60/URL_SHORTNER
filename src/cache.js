const redis = require("redis");
const { promisify } = require("util");

//===================================================== Connect to the redis server==============================================================
const redisClient = redis.createClient(11206, "redis-11206.c281.us-east-1-2.ec2.cloud.redislabs.com:11206");

redisClient.auth("QMbNkgvm9YWCJe6BE2ddGsMIimdWFyEH", (err) => {
    if (err) throw err.message;
});

redisClient.on("connect", () => {
    console.log("Redis connnected")
})

const SETEX_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


module.exports={SETEX_ASYNC,GET_ASYNC}