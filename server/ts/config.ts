export default {
    user: "sa",
    password: "admin",
    server: "localhost",
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
        autostart: true
    },
    options: {
        encrypt: false,
        trustServerCertificate: true
    },
    beforeConnect: conn => {
        conn.on('debug', message => console.info(message));
        conn.on('error', err => console.error(err));
        conn.removeAllListeners();
    }
}