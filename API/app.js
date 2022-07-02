//https://www.youtube.com/watch?v=f5kye3ESXE8
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const { raw } = require("body-parser");
const app = express();
const sharp = require("sharp");
const SETTINGS = require("../gallary/src/variableSettings");
const port = process.env.PORT || 5000;
app.use(cors());

app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" }));

const imagesPerPage = 30;
// my sql
const pool = mysql.createPool({
  connectionLimit: 50,
  timeout: 5000,
  host: SETTINGS.ip,
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

/*
 * endpoint returns a specifc image from the database based on the given ID
 */

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

/*
 * Endpoint to set if a image is liked by a specific user
 */
app.post("/like", (req, res) => {
  let { imgID, userID } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query(
      `SELECT * FROM favorites WHERE merge_key="${userID + "-" + imgID}"`,
      (err, rows) => {
        if (err) throw err;
        if (rows.length == 0) {
          connection.query(
            `INSERT INTO favorites (user_id,image_id,merge_key) values (${userID},${imgID},"${
              userID + "-" + imgID
            }")`,
            (err, rows) => {
              if (err) throw err;
              res.send(rows);
              connection.query(
                `UPDATE image SET score=score+1 WHERE id=${imgID}`,
                (err, rows) => {}
              );
            }
          );
        } else {
          connection.query(
            `DELETE FROM favorites WHERE merge_key="${userID + "-" + imgID}"`,
            (err, rows) => {
              if (err) throw err;
              res.send(rows);
              connection.query(
                `UPDATE image SET score=score-1 WHERE id=${imgID}`,
                (err, rows) => {}
              );
            }
          );
        }
      }
    );
    connection.release();
  });
});
/*
 * Endpoint to add an image to the database
 */
app.post("/upload", (req, res) => {
  let { tags, dataUri } = req.body;
  tags = tags.filter((e) => e);
  let resizedImg;
  let insertId;
  let blob = dataURItoBlob(dataUri);
  let prefix = getMimeTypeFromDataURI(dataUri);
  //remove prefix from datauri
  dataUri = dataUri.replace(prefix, "");
  sharp(blob)
    .resize(200, undefined)
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
                res.send(rows);
                insertId = rows.insertId;
                for (let i = 0; i < tags.length; i++) {
                  if (!tagIdMap.has(tags[i])) {
                    connection.query(
                      `INSERT INTO tag (name) VALUES ('${tags[i]}')`,
                      (err, rows) => {
                        if (!err) {
                          console.log(rows.insertId + " line 118");
                          tagIdMap.set(tags[i], rows.insertId);
                          connection.query(
                            `INSERT INTO imagetag (img_id, tag_id) VALUES (${insertId}, ${rows.insertId})`,
                            (err, rows) => {
                              if (!err) {
                                console.log(rows);
                              } else {
                                console.log(err);
                              }
                            }
                          );
                        } else {
                          console.log(err);
                        }
                      }
                    );
                  } else {
                    connection.query(
                      `INSERT INTO imagetag (img_id, tag_id) VALUES (${insertId}, ${tagIdMap.get(
                        tags[i]
                      )})`,
                      (err, rows) => {
                        if (!err) {
                        } else {
                          console.log(err);
                        }
                      }
                    );
                  }
                }
              } else {
                console.log(err);
                res.send(err);
              }
            }
          );
          connection.release();
        });
      }
    });
});

/**
 * Endpoint to check if a user with specifc username and password exists
 */
app.get("/login/:username/:password", (req, res) => {
  let { username, password } = req.params;
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

/*
 * Endpoint to add a user to the database
 */
app.post("/register", (req, res) => {
  let { username, password } = req.body;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      `INSERT INTO user (username, password) VALUES ('${username}', '${password}')`,
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

/*
 * Endpoint to get a certain ammount of images from the database in a certain order.
 * May or may not be filtered by tags.
 */
app.get("/query/:order/:tags/:page/:userid", (req, res) => {
  let { order, tags, page, userid } = req.params;
  tags = tags.split(",");
  let SqlQuery =
    "SELECT img.id, img.score ,img.prefixs ,TO_BASE64(img.imgsm) as imgsm, " +
    "IF(IFNULL(favorites.id,0),'True','False') as liked " +
    "FROM image as img " +
    `LEFT JOIN favorites ON favorites.user_id=${userid} and favorites.image_id=img.id `;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    if (tags[0] !== "none") {
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
          res.send([]);
        }
      }
    );
  });
});

/*
 * Endpoint to get a certain ammount of images from the database in a certain order.
 * May or may not be filtered by tags.
 */
app.get("/favorites/:order/:tags/:page/:userid", (req, res) => {
  let { order, tags, page, userid } = req.params;
  tags = tags.split(",");
  let SqlQuery =
    "SELECT img.id, img.score ,img.prefixs ,TO_BASE64(img.imgsm) as imgsm, " +
    "IF(IFNULL(favorites.id,0),'True','False') as liked " +
    "FROM image as img " +
    `JOIN favorites ON favorites.user_id=${userid} and favorites.image_id=img.id `;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    if (tags[0] !== "none") {
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
      SqlQuery = SqlQuery.replace("ORDER BY undefined", "ORDER BY RAND()");
    }
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

/**
 * Used to convert a dataUri to a blob
 * @param {*} dataURI
 * @returns  the generated blob
 */
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

/**
 * used to get the mime Type of a dataUri
 * @param {*} dataURI
 * @returns the mime type
 */
function getMimeTypeFromDataURI(dataURI) {
  return dataURI.split(",")[0] + ",";
}

/*
 * Set tags from database to tagIdMap
 */
app.listen(port, () => console.log("listen on port:" + port));
pool.getConnection((err, connection) => {
  connection.query(`SELECT id,name FROM tag`, (err, rows) => {
    rows.forEach((row) => {
      tagIdMap.set(row.name, row.id);
    });
  });
});