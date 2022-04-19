//https://www.youtube.com/watch?v=f5kye3ESXE8

const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const app = express()

const port = process.env.PORT || 5000
app.use(cors())

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))


// my sql
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'master',
    password: 'master',
    database: 'imgviever',
})

//get all entries
app.get('', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        connection.query('SELECT id, score, prefix ,prefixs, TO_BASE64(img) as img ,TO_BASE64(imgsm) as imgsm from image;', (err, rows) => {
            connection.release()
            if (!err) {
                res.send(rows);
            }
        })
    })
})


// listen on env
app.listen(port, () => console.log("listen on port:" + port))





