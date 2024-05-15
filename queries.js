const config = require('config');
const jwt = require('jsonwebtoken');
const pool = require('./db')


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

const getUsers = (req, resp) => {
    pool.query('SELECT * FROM select_allUsers()', (error, results) => {
        if (error) {
            throw error;
        }
        resp.status(200).json(results.rows)
    })
}

const getUserById = (req, resp) => {
    const id = parseInt(req.params.id);

    pool.query('SELECT * FROM select_UsersById($1)', [id], (error, results) => {
        if (error){
            throw error;
        }
        resp.status(200).json(results.rows);
    })
}

const insertUser = (req, resp) => {
    const { nombre, email, password, estado } = req.body;
    pool.query('CALL sp_Insert_newUser($1, $2, $3, $4)', [nombre, email, password, estado], (error, results) => {
        if (error){
            throw error;
        }
        resp.status(200).json(results.rows);
    })
}

const updateUser = (req, resp) => {
    const id = parseInt(req.params.id);
    const { nombre, email, estado } = req.body;

    pool.query('CALL SP_UpdateUser($1, $2, $3, $4)', [nombre, email, estado, id], (error, results) => {
        if (error) {
            throw error;
        }

        resp.status(200).json(results.rows);
    })
}

const deleteUser = (req, resp) => {
    const id = parseInt(req.params.id);

    pool.query('CALL SP_DeleteUser($1)', [id], (error, results) => {
        if (error){
            resp.status(400).send('Usuario no existe');
        }
        resp.status(200).send(`Usuario ${id} eliminado correctamente`)
    })
}

const loginUser = (req, resp) => {
    const { email, password } = req.body;
    const jwToken = jwt.sign({
        data: {_email: email, password: password}
    }, config.get('configToken.SEED'), { expiresIn: config.get('configToken.expiration')});
    //jwt.sign({_email: email, password: password}, 'password')
    pool.query('SELECT * FROM login_new WHERE email = $1 AND password = $2', [email, password], (error, results) => {
        if (error){
            resp.status(400).json({
                error: 'Ok',
                msj: 'Usuario o contraseña incorrecta'
            });
        } else {
            if (results.rows.length === 0) {
                resp.status(400).json({
                    error: 'Ok',
                    msj: 'Usuario o contraseña incorrecta'
                });
            } else {
                // resp.send(jwToken);

                resp.json({
                    usuario:{
                        email: email
                    },
                    jwToken
                });
            }
        }
    });
};



module.exports = {
    getUsers,
    getUserById,
    insertUser,
    updateUser,
    deleteUser,
    loginUser,
    verificarToken
}