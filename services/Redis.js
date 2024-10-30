const { createClient } = require('redis');

const client = createClient({
    password: 'XPYvELAeJrwQjss6jZrX8NXkK0yQsC0Q',
    socket: {
        host: 'redis-13368.c330.asia-south1-1.gce.redns.redis-cloud.com',
        port: 13368
    }
});

client.on('error', (err) => {
    if (err.code === 'ECONNREFUSED') {
        console.error('Redis connection refused. Is Redis running?');
    } else {
        console.error('Redis error:', err);
    }
});

(async()=>{
    await client.connect();
 console.log('Connected to Redis')
})(); 
 module.exports = client ;


