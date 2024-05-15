const jwt = require('jsonwebtoken');
const config = require('config');


let verificarToken = (req, resp, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, config.get('configToken.SEED'), (err, decoded) => {
        if(err){
            return resp.status(401).json({err});
        }
        req.usuario = decoded.usuario;
        next();
    });
}

module.export = verificarToken;