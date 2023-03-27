exports.psqlErrHandler = (err, req, res, next) => {
    if (err.code === '22P02') res.status(400).send({msg: 'Invalid ID'})
    else if (err.code === '23502') res.status(400).send({msg: 'Invalid Format'})
    else next(err);
}

exports.customErrHandler = (err, req, res, next) => {
    if (err.status) res.status(err.status).send({msg: err.msg});
    else next(err);
}