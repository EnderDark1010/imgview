//https://www.youtube.com/watch?v=f5kye3ESXE8
const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const cors = require('cors')
const { raw } = require('body-parser')
const app = express()
const sharp = require("sharp");
const port = process.env.PORT || 5000
app.use(cors())

app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }))

const imagesPerPage = 30;
// my sql
const pool = mysql.createPool({
    connectionLimit: 10,
    host: '192.168.1.114',
    user: 'master',
    password: 'master',
    database: 'imgviever',
})

//map for order types
const ORDER = {
    scoreDown: "score DESC,RAND()",
    scoreUp: "score ASC,RAND()",
    idUp: "id ASC",
    idDown: "id DESC",
    none:"id DESC",
    random: "RAND()",
}


/*
Handle get requests
*/
//get all entries

let apiCalls=0;


//get full image by id
app.get('/img/id/:id', (req, res) => {
    let id = req.params.id;
    pool.getConnection((err, connection) => {
        if (err) throw err

        connection.query(`SELECT prefix, TO_BASE64(img) as img FROM image WHERE id=${id}`, (err, rows) => {
            connection.release()
            if (!err) {
                res.send(rows);
            } else {
                res.send(err);
            }
        })
    })
})

//get img random
app.get('/random', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query(`SELECT id, score ,prefixs ,TO_BASE64(imgsm) as imgsm FROM image ORDER BY RAND() LIMIT ${page * imagesPerPage - imagesPerPage},${imagesPerPage}`, (err, rows) => {
            connection.release()
            if (!err) {
                res.send(rows);
            } else {
                res.send(err);
            }
        })
    })
})

/*
Handle Score updates
*/
//add score
app.post('/plusscore/:id', (req, res) => {
    let id = req.params.id;

    pool.getConnection((err, connection) => {
        if (err) throw err

        connection.query(`UPDATE image SET score = score + ${1 + (Math.random() * 0.1)} WHERE id = ${id}`, (err, rows) => {
            connection.release()
            if (!err) {
                res.send(rows);
            } else {
                res.send(err);
            }
        })
    })
})
//remove score
app.post('/minusscore/:id', (req, res) => {
    let id = req.params.id;
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query(`UPDATE image SET score = IF(score!=0,score-1,score) WHERE id = ${id}`, (err, rows) => {
            connection.release()
            if (!err) {
                res.send(rows);
            } else {
                res.send(err);
            }
        })
    })
})





//test
app.post('/test', (req, res) => {
    let { tags, dataUri } = req.body;
    let resizedImg;
    let resizedMime;
    let blob = dataURItoBlob(dataUri);
    let prefix = getMimeTypeFromDataURI(dataUri);
    //remove prefix from datauri
    dataUri = dataUri.replace(prefix, '');

    sharp(blob).resize(400, undefined).toBuffer((err, buffer) => {
        if (err) {
            console.log(err);
        } else {
            resizedImg = buffer.toString('base64');
            console.log("resizedImg");

            console.log(resizedImg);
            console.log(dataUri)

            pool.getConnection((err, connection) => {
                if (err) throw err
                connection.query(`INSERT INTO image 
                                 (img,imgsm,score,prefix,prefixs,tags)
                                 VALUES ( FROM_BASE64('${dataUri}'),
                                 FROM_BASE64('${resizedImg}'),
                                 0,
                                 '${prefix}',
                                 '${prefix}',
                                 '${tags}');`,
                    (err, rows) => {
                        connection.release()
                        if (!err) {
                            console.log("success")
                            res.send(rows);

                        } else {
                            console.log(err);
                            res.send(err);
                        }
                    })
            })
        }
    })
})





//login
app.post('/login', (req, res) => {
    let { username, password } = req.body;
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query(`SELECT * FROM user WHERE username = '${username}' AND password = '${password}'`, (err, rows) => {
            connection.release()
            if (!err) {
                res.send(rows);
            } else {
                res.send(rows);
            }
        })
    })
})


//Querys(seperated by ,)(get images)
app.get('/query/:order/:tags/:page', (req, res) => {
    apiCalls++;
    console.log(apiCalls);
    let page = req.params.page;
    let tagString = req.params.tags;
    let order = req.params.order;
    let tags = tagString.split(',');
    let SqlQuery = "SELECT img.id, img.score ,img.prefixs ,TO_BASE64(img.imgsm) as imgsm FROM image as img ";
    let tagIdMap = new Map();
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query(`SELECT id,name FROM tag`, (err, rows) => {
            rows.forEach(row => {
                tagIdMap.set(row.name, row.id);
            });
            if (tagString !== 'none') {
                let i = 0;
                tags.forEach(tag => {
                    SqlQuery += `JOIN imagetag as t${i} ON t${i}.img_id=img.id AND t${i}.tag_id=${tagIdMap.get(tag)} `;
                    i++;
                });
            }
            //add order to query
            SqlQuery += `ORDER BY ${ORDER[order]} `;

            console.log(SqlQuery);
            connection.query(SqlQuery + ` LIMIT ${page * imagesPerPage - imagesPerPage},${imagesPerPage}`, (err, rows) => {
                connection.release()
                if (!err) {
                    res.send(rows);
                    
                } else {
                    console.log(err);
                }
            })
        })
    })
    
})



function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    var blob = Buffer.from(ab);
    return blob;

}



function getMimeTypeFromDataURI(dataURI) {
    return dataURI.split(',')[0] + ',';
}





// app.get('/test', (req, res) => {
//     pool.getConnection((err, connection) => {
//         if (err) throw err
//         connection.query(`SELECT id,tags FROM image`, (err, rows) => {

//             if (!err) {
//                 console.log(rows);
//                 rows.forEach(dataElement => {
//                     let tags = dataElement.tags;
//                     let tagArray = tags.split(",").filter(tag => tag.length > 0);
//                     tagArray.forEach(tag => {
//                         connection.query(`SELECT id FROM tag WHERE name="${tag}"`, (err, rows) => {
//                             if (!err) {
//                                 if (rows.length == 0) {
//                                     console.log("here")
//                                     connection.query(`INSERT INTO tag (name) VALUES ("${tag}")`, (err, rows) => {
//                                         if (!err) {
//                                             connection.query(`SELECT id FROM tag WHERE name="${tag}"`, (err, rows) => {
//                                                 if (!err) {
//                                                     connection.query(`INSERT INTO imagetag (img_id,tag_id) VALUES (${dataElement.id},${rows[0].id})`, (err, rows) => {
//                                                         if (!err) {
//                                                             console.log("success")

//                                                         }else{

//                                                         }
//                                                     })
//                                                 }
//                                             })
//                                         }
//                                     })
//                                 }else{
//                                     connection.query(`INSERT INTO imagetag (img_id,tag_id) VALUES (${dataElement.id},${rows[0].id})`, (err, rows) => {
//                                         if (!err) {
//                                             console.log("success")

//                                         }else{

//                                         }
//                                     })
//                                 }
//                             }
//                         })
//                     })
//                 });
//             }
//         })
//         connection.release()
//     })
// })











// listen on env
app.listen(port, () => console.log("listen on port:" + port))





