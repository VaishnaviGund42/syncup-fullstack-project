const { Redis } = require('@upstash/redis');

const redisClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const connectRedis = async () => {
  try {
    await redisClient.ping();
    console.log('Upstash Redis connected');
  } catch (error) {
    console.error('Redis connection error:', error.message);
    process.exit(1);
  }
};

module.exports = { redisClient, connectRedis };