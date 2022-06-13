//https://www.youtube.com/watch?v=f5kye3ESXE8
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const { raw } = require("body-parser");
const app = express();
const sharp = require("sharp");
const port = process.env.PORT || 5000;
app.use(cors());

app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" }));

const imagesPerPage = 30;
// my sql
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "192.168.1.114",
  user: "master",
  password: "master",
  database: "imgviever",
});

//map for order types
const ORDER = {
  scoreDown: "score DESC",
  scoreUp: "score ASC",
  idUp: "id ASC",
  idDown: "id DESC",
  none: "id DESC",
  random: "RAND()",
};

let tagIdMap = new Map();

//get full image by id
app.get("/img/id/:id", (req, res) => {
  let id = req.params.id;
  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query(
      `SELECT prefix, TO_BASE64(img) as img FROM image WHERE id=${id}`,
      (err, rows) => {
        connection.release();
        if (!err) {
          res.send(rows);
        } else {
          res.send(err);
        }
      }
    );
  });
});

//Add Or Remove favorites
app.post("/like", (req, res) => {
  const { addOrRemove, imgId, userID } = req.body;
  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query(
      `UPDATE image SET score = score + ${1 + Math.random() * 0.1
      } WHERE id = ${imgId}`,
      (err, rows) => {
        connection.release();
        if (!err) {
          res.send(rows);
        } else {
          res.send(err);
        }
      }
    );
  });
});

//test
app.post("/upload", (req, res) => {
  let { tags, dataUri } = req.body;
  tags = tags.filter(e => e);
  let resizedImg;
  let resizedMime;
  let insertId;
  let blob = dataURItoBlob(dataUri);
  let prefix = getMimeTypeFromDataURI(dataUri);
  //remove prefix from datauri
  dataUri = dataUri.replace(prefix, "");
  sharp(blob)
    .resize(400, undefined)
    .toBuffer((err, buffer) => {
      if (err) {
        console.log(err);
      } else {
        resizedImg = buffer.toString("base64");
        pool.getConnection((err, connection) => {
          if (err) throw err;
          connection.query(
            `INSERT INTO image 
                                 (img,imgsm,score,prefix,prefixs,tags)
                                 VALUES ( FROM_BASE64('${dataUri}'),
                                 FROM_BASE64('${resizedImg}'),
                                 0,
                                 '${prefix}',
                                 '${prefix}',
                                 '');`,
            (err, rows) => {

              if (!err) {
                insertId = rows.insertId;
                for (let i = 0; i < tags.length; i++) {
                  if (!tagIdMap.has(tags[i])) {
                    connection.query(
                      `INSERT INTO tag (name) VALUES ('${tags[i]}')`,
                      (err, rows) => {
                        if (!err) {
                          console.log(rows.insertId + " line 118")
                          tagIdMap.set(tags[i], rows.insertId);
                          connection.query(
                            `INSERT INTO imagetag (img_id, tag_id) VALUES (${insertId}, ${rows.insertId})`,
                            (err, rows) => {
                              if (!err) {
                                console.log(rows);
                              } else {
                                console.log(err);
                              }
                            });
                        } else {
                          console.log(err);
                        }
                      }
                    );
                  }else{
                    connection.query(
                      `INSERT INTO imagetag (img_id, tag_id) VALUES (${insertId}, ${tagIdMap.get(tags[i])})`,
                      (err, rows) => {
                        if (!err) {
                        } else {
                          console.log(err);
                        }
                      }
                    );
                  }
                }
                
                connection.release();
              } else {
                console.log(err);
                res.send(err);
              }
            }
          );
        });
      }
    });
});

//login
app.post("/login", (req, res) => {
  let { username, password } = req.body;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      `SELECT * FROM user WHERE username = '${username}' AND password = '${password}'`,
      (err, rows) => {
        connection.release();
        if (!err) {
          res.send(rows);
        } else {
          res.send(rows);
        }
      }
    );
  });
});

app.get("/query/:order/:tags/:page", (req, res) => {
  let page = req.params.page;
  let tagString = req.params.tags;
  let order = req.params.order;
  let tags = tagString.split(",");
  let SqlQuery =
    "SELECT img.id, img.score ,img.prefixs ,TO_BASE64(img.imgsm) as imgsm FROM image as img ";

  pool.getConnection((err, connection) => {
    if (err) throw err;
    if (tagString !== "none") {
      let i = 0;
      tags.forEach((tag) => {
        SqlQuery += `JOIN imagetag as t${i} ON t${i}.img_id=img.id AND t${i}.tag_id=${tagIdMap.get(
          tag
        )} `;
        i++;
      });
    }
    //add order to query
    SqlQuery += `ORDER BY ${ORDER[order]} `;
    if (SqlQuery.includes("ORDER BY undefined")) {
      console.log("includes");
      SqlQuery = SqlQuery.replace("ORDER BY undefined", "ORDER BY RAND()");
    }
    console.log(SqlQuery);
    connection.query(
      SqlQuery +
      ` LIMIT ${page * imagesPerPage - imagesPerPage},${imagesPerPage}`,
      (err, rows) => {
        connection.release();
        if (!err) {
          res.send(rows);
        } else {
          console.log(err);
        }
      }
    );
  });
});

function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(",")[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  var blob = Buffer.from(ab);
  return blob;
}

function getMimeTypeFromDataURI(dataURI) {
  return dataURI.split(",")[0] + ",";
}

app.listen(port, () => console.log("listen on port:" + port));
pool.getConnection((err, connection) => {
  connection.query(`SELECT id,name FROM tag`, (err, rows) => {
    rows.forEach((row) => {
      tagIdMap.set(row.name, row.id);
    });
    console.log(tagIdMap)
  });
});