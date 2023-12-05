const redis = require('redis');
//EXPIRATION TIME SET TO A DAY 
const EX_TIME = Date.now();


// CONNECTION REDIS
// const client = redis.createClient({
//   socket: {
//     host: '127.0.0.1',
//     port: 6379,
//   },
// });
// CONNECTION REDIS
const client = redis.createClient({
    socket: {
        //HOST:'127.0.0.1'
        host: process.env.REDIS_HOST_REMOTE,
        port: process.env.REDIS_PORT_REMOTE,

    },
    password:  process.env.REDIS_PASSWORD_REMOTE,
});

client
.connect().then(() => {
console.log('Redis connection Success...');

})
.catch((err) =>{
    console.log('Redis connection Error', err);
});
//FETCHING FROM CATCH
exports.getFromCache = async (key) => {
    const data = await client.get(key);
    return data;
};
//INSERTING TO CATCH
exports.addToCache = async (data) => {
    await client.setEx(data.urlCode, EX_TIME, data.longUrl);
    await client.SETEX(data.longUrl, EX_TIME, JSON.stringify(data));
};