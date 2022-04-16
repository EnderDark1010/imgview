//https://www.youtube.com/watch?v=f5kye3ESXE8
const express= require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const cors = require('cors')
const app = express()
const port =process.env.PORT || 5000
app.use(cors())

app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({extended:false,limit:'50mb'}))


// my sql
const pool = mysql.createPool({
    connectionLimit:10,
    host: 'localhost',
    user: 'master',
    password:'master',
    database: 'imgviever',
})

//get all entries
app.get('',(req,res)=>{
    pool.getConnection((err,connection) =>{
        if(err) throw err

        connection.query('SELECT id, score, picture.type, TO_BASE64(img) as img from picture;',(err,rows)=>{
            connection.release()
            if(!err){
                res.send(rows);
            }
        })
    })
})

app.post('',(req,res)=>{
    pool.getConnection((err,connection) =>{
        if(err) throw err
        const params = req.body;
        console.log(params);
        connection.query('INSERT INTO picture SET ?', params, (err,rows)=>{
            connection.release()
            if(!err){
                res.send(rows);
            }else{
                console.log(err);
                console.log(params);
            }
        })
    })
})

// listen on env
app.listen(port,()=> console.log("listen on port:" + port))
