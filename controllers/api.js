exports.getEndpoints = (req, res) => {
    const currentEndpoints = require('../endpoints.json');
    res.status(200).send({endpoints: currentEndpoints});
}