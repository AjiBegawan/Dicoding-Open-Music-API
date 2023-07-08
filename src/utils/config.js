const config = {
    app: {
        host: process.env.HOST,
        port: process.env.PORT,
        url: process.env.APP_URL,
    },
    jwt: {
        accessTokenKey: process.env.ACCESS_TOKEN_KEY,
        accessTokenAge: process.env.ACCESS_TOKEN_AGE,
        refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
    },
    rabbitMq: {
        server: process.env.RABBITMQ_SERVER,
    },
    redis: {
        server: process.env.REDIS_SERVER,
    },
};

module.exports = config;
