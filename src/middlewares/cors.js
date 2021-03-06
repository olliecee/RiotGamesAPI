export default ({ whitelist: origins }) => {
    return function(req, res, next) {
        if (!origins) throw new Error('Invalid parameter');
        if (!Array.isArray(origins)) throw new Error('Not an array');
        if (origins.length === 0) throw new Error('Whitelist parameter is empty');

        if ('host' in req.headers) {
            const isValid = origins.indexOf(req.headers.host) !== -1;
            if (isValid) {
                next()
            }
            next('You do not meet CORS validation')
        }

        next('Unable to validate your host origin')
    }
};

export const corsPolicy = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    next();
};