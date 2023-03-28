const {fetchEndpoints} = require('../models/api');

exports.getEndpoints = () => {
    return fetchEndpoints();
}