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

const imagesPerPage = 50;
// my sql
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'master',
    password: 'master',
    database: 'imgviever',
})




/*
Handle get requests
*/
//get all entries
app.get('', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        connection.query('SELECT id, score ,prefixs ,TO_BASE64(imgsm) as imgsm from image;', (err, rows) => {
            connection.release()
            if (!err) {
                res.send(rows);
            }
        })
    })
})

//get all entries
app.get('/sortall', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        connection.query('SELECT id, score ,prefixs ,TO_BASE64(imgsm) as imgsm from image ORDER  BY score DESC, RAND() ', (err, rows) => {
            connection.release()
            if (!err) {
                res.send(rows);
            }
        })
    })
})

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

//get images for page
app.get('/img/page/newfirst/:page', (req, res) => {
    let page = req.params.page;
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query(`SELECT id, score ,prefixs ,TO_BASE64(imgsm) as imgsm FROM image ORDER BY id DESC  LIMIT ${page * imagesPerPage - 50},${imagesPerPage}`, (err, rows) => {
            connection.release()
            if (!err) {
                res.send(rows);
            } else {
                res.send(err);
            }
        })
    })
})
//get images for page
app.get('/img/page/oldfirst/:page', (req, res) => {
    let page = req.params.page;
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query(`SELECT id, score ,prefixs ,TO_BASE64(imgsm) as imgsm FROM image ORDER BY id asc LIMIT ${page * imagesPerPage - 50},${imagesPerPage}`, (err, rows) => {
            connection.release()
            if (!err) {
                res.send(rows);
            } else {
                res.send(err);
            }
        })
    })
})

//get images for page order Score 1000->0
app.get('/score/up/:page', (req, res) => {
    let page = req.params.page;
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query(`SELECT id, score ,prefixs ,TO_BASE64(imgsm) as imgsm FROM image ORDER BY score ASC LIMIT ${page * imagesPerPage - 50},${imagesPerPage}`, (err, rows) => {
            connection.release()
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        })
    })
})

//get images for page order Score ascending 0->1000
app.get('/score/down/:page', (req, res) => {
    let page = req.params.page;
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query(`SELECT id, score ,prefixs ,TO_BASE64(imgsm) as imgsm FROM image ORDER BY score DESC LIMIT ${page * imagesPerPage - 50},${imagesPerPage}`, (err, rows) => {
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
        connection.query(`SELECT id, score ,prefixs ,TO_BASE64(imgsm) as imgsm FROM image ORDER BY RAND() LIMIT ${page * imagesPerPage - 50},${imagesPerPage}`, (err, rows) => {
            connection.release()
            if (!err) {
                res.send(rows);
            } else {
                res.send(err);
            }
        })
    })
})

//Querys(seperated by ,)
app.get('/query/:tags/:page', (req, res) => {
    let page = req.params.page;
    let tagString = req.params.tags;
    let tags = tagString.split(',');
    let SqlQuery;
    if (tagString === 'none') {
        SqlQuery = `SELECT id, score ,prefixs ,TO_BASE64(imgsm) as imgsm FROM image WHERE (tags LIKE '%')`
    } else {
        SqlQuery = `SELECT id, score ,prefixs ,TO_BASE64(imgsm) as imgsm FROM image WHERE (`;
        let i = 0;
        tags.map(tag => {
            SqlQuery += `tags LIKE '%,${tag},%'`;
            i++;
            if (i != tags.length) {
                SqlQuery += ' AND ';
            }
        });
        SqlQuery += `)`;
    }


    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query(SqlQuery + ` LIMIT ${page * imagesPerPage - 50},${imagesPerPage}`, (err, rows) => {
            connection.release()
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        })
    })
})

app.get('/query/scoredown/:tags/:page', (req, res) => {
    let page = req.params.page;
    let tagString = req.params.tags;
    let tags = tagString.split(',');
    let SqlQuery;
    if (tagString === 'none') {
        SqlQuery = `SELECT id, score ,prefixs ,TO_BASE64(imgsm) as imgsm FROM image WHERE (tags LIKE '%')`
    } else {
        SqlQuery = `SELECT id, score ,prefixs ,TO_BASE64(imgsm) as imgsm FROM image WHERE (`;
        let i = 0;
        tags.map(tag => {
            SqlQuery += `tags LIKE '%,${tag},%'`;
            i++;
            if (i != tags.length) {
                SqlQuery += ' AND ';
            }
        });
        SqlQuery += `)`;
    }
    console.log(SqlQuery + `ORDER BY score DESC LIMIT ${page * imagesPerPage - 50},${imagesPerPage}`);

    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query(SqlQuery + `ORDER BY score DESC LIMIT ${page * imagesPerPage - 50},${imagesPerPage}`, (err, rows) => {
            connection.release()
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        })
    })
})

app.get('/query/scoreup/:tags/:page', (req, res) => {
    let page = req.params.page;
    let tagString = req.params.tags;
    let tags = tagString.split(',');
    let SqlQuery;
    if (tagString === 'none') {
        SqlQuery = `SELECT id, score ,prefixs ,TO_BASE64(imgsm) as imgsm FROM image WHERE (tags LIKE '%')`
    } else {
        SqlQuery = `SELECT id, score ,prefixs ,TO_BASE64(imgsm) as imgsm FROM image WHERE (`;
        let i = 0;
        tags.map(tag => {
            SqlQuery += `tags LIKE '%,${tag},%'`;
            i++;
            if (i != tags.length) {
                SqlQuery += ' AND ';
            }
        });
        SqlQuery += `)`;
    }


    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query(SqlQuery + `ORDER BY score ASC LIMIT ${page * imagesPerPage - 50},${imagesPerPage}`, (err, rows) => {
            connection.release()
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        })
    })
})

app.get('/query/oldfirst/:tags/:page', (req, res) => {
    let page = req.params.page;
    let tagString = req.params.tags;
    let tags = tagString.split(',');
    let SqlQuery;
    if (tagString === 'none') {
        SqlQuery = `SELECT id, score ,prefixs ,TO_BASE64(imgsm) as imgsm FROM image WHERE (tags LIKE '%')`
    } else {
        SqlQuery = `SELECT id, score ,prefixs ,TO_BASE64(imgsm) as imgsm FROM image WHERE (`;
        let i = 0;
        tags.map(tag => {
            SqlQuery += `tags LIKE '%,${tag},%'`;
            i++;
            if (i != tags.length) {
                SqlQuery += ' AND ';
            }
        });
        SqlQuery += `)`;
    }


    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query(SqlQuery + `ORDER BY id ASC LIMIT ${page * imagesPerPage - 50},${imagesPerPage}`, (err, rows) => {
            connection.release()
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        })
    })
})

app.get('/query/newfirst/:tags/:page', (req, res) => {
    let page = req.params.page;
    let tagString = req.params.tags;
    let tags = tagString.split(',');
    let SqlQuery;
    if (tagString === 'none') {
        SqlQuery = `SELECT id, score ,prefixs ,TO_BASE64(imgsm) as imgsm FROM image WHERE (tags LIKE '%')`
    } else {
        SqlQuery = `SELECT id, score ,prefixs ,TO_BASE64(imgsm) as imgsm FROM image WHERE (`;
        let i = 0;
        tags.map(tag => {
            SqlQuery += `tags LIKE '%,${tag},%'`;
            i++;
            if (i != tags.length) {
                SqlQuery += ' AND ';
            }
        });
        SqlQuery += `)`;
    }


    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query(SqlQuery + `ORDER BY id DESC LIMIT ${page * imagesPerPage - 50},${imagesPerPage}`, (err, rows) => {
            connection.release()
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
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

   sharp(blob).resize(200, 200).toBuffer((err, buffer) => {
        if (err) {
            console.log(err);
        } else {
            resizedImg = buffer.toString('base64');
            console.log("resizedImg");

            console.log(resizedImg);
            console.log(dataUri)

            // pool.getConnection((err, connection) => {
            //     if (err) throw err
            //     connection.query(`INSERT INTO image 
            //                      (img,imgsm,score,prefix,prefixs,tags)
            //                      VALUES ( FROM_BASE64('${dataUri}'),
            //                      FROM_BASE64('${resizedImg}'),
            //                      0,
            //                      '${prefix}',
            //                      '${resizedMime}',
            //                      '${tags}');`,
            //         (err, rows) => {
            //             connection.release()
            //             if (!err) {
            //                 console.log("success")
            //                 res.send(rows);
        
            //             } else {
            //                 console.log(err);
            //                 res.send(err);
            //             }
            //         })
            // })
        }
    })   
})





function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = Buffer.from(ab);
    return blob;

}


//function to get mimetype from dataURI
function getMimeTypeFromDataURI(dataURI) {
    return dataURI.split(',')[0] + ',';
}

















// listen on env
app.listen(port, () => console.log("listen on port:" + port))





