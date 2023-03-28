exports.getEndpoints = (req, res) => {
    const endpoints = require('../endpoints.json');
    res.status(200).send({endpoints});
}