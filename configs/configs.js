require('dotenv').config()

module.exports = () => ({
    app: {
        name: process.env.APP_NAME,
        host: process.env.APP_HOST || '192.168.1.10',
        localhost: process.env.APP_LOCALHOST || '127.0.0.1',
        port: process.env.APP_PORT || 5050,
        env: process.env.APP_ENV,
        logspath: process.env.LOG_PATH,
    },
    mongodb: {
        uri: process.env.DB_URI,
        host: process.env.DB_HOST,
    },
    logging: {
        file: process.env.LOG_PATH,
        level: process.env.LOG_LEVEL || 'info',
        console: process.env.LOG_ENABLE_CONSOLE || true,
    },
    cookies: {
        secret: process.env.COOKIE_SECRET,
    }
});
