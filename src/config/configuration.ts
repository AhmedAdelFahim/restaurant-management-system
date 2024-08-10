export default () => ({
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  database: {
    dbURL: process.env.DB_URL,
  },
  caching: {
    redisURL: process.env.REDIS_URL,
  },
});
