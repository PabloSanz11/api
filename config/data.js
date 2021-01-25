module.exports = (req, res, next) => {
    return data({
        connectionLimit: 100,
        host: 'us-cdbr-east-02.cleardb.com',
        user: 'bb2bf4809bb124',
        password: 'c29ea4b5',
        database: 'heroku_9d29e9c8a90f9dd'
    });
}