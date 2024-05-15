const express = require('express');
const bodyParser = require('body-parser');
const db = require('./queries')
const app = express();
const port = 3000;


app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (req, res) => {
    res.json( {info: 'Node.js, Express, and Postgres API'} )
})

app.get('/api/users', db.verificarToken, db.getUsers);
app.get('/api/users/:id', db.verificarToken, db.getUserById);
app.post('/api/users', db.verificarToken, db.insertUser);
app.put('/api/users/:id', db.verificarToken, db.updateUser);
app.delete('/api/users/:id', db.verificarToken, db.deleteUser);
app.post('/', db.loginUser);

app.listen(port, () => {
    console.log(`APIRESTFull corriendo en puerto ${port}`)
})