var express = require("express");
var app = express();
var pg = require("pg");
var bodyParser = require("body-parser");
var multer = require("multer");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.listen(3000);

var config = {
    user: 'nfoelcoksqmjso', //env var: PGUSER
    database: 'd4hosncueggf6l', //env var: PGDATABASE
    password: '06f1a8a58ff9288bfa747d8f93118ee740a83834f666b9d3934bdb35d3df0883', //env var: PGPASSWORD
    host: 'ec2-54-163-240-7.compute-1.amazonaws.com', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
var pool = new pg.Pool(config);

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage }).single('image');

app.get("/", function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * FROM "VIDEOS"', function (err, result) {
            //call `done()` to release the client back to the pool
            done();

            if (err) {
                return console.error('error running query', err);
            }
            res.render("home", { data: result });
            //output: 1
        });
    });
});

app.get("/videos/list", function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * FROM "VIDEOS"', function (err, result) {
            //call `done()` to release the client back to the pool
            done();

            if (err) {
                return console.error('error running query', err);
            }
            res.render("list", { data: result });
            //output: 1
        });
    });
});

app.get("/videos/delete/:id", function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('DELETE FROM "VIDEOS" WHERE "ID" = ' + req.params.id, function (err, result) {
            //call `done()` to release the client back to the pool
            done();

            if (err) {
                return console.error('error running query', err);
            }
            res.redirect("../list");
            //output: 1
        });
    });
});

app.get("/videos/add", function (req, res) {
    res.render("add");
});

app.post("/videos/add", urlencodedParser, function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            res.send("Error when uploading file: " + err);
        } else if (req.file == undefined) {
            res.send("You must upload a picture");
        } else {
            pool.connect(function (err, client, done) {
                if (err) {
                    return console.error('error fetching client from pool', err);
                }
                client.query("INSERT INTO \"VIDEOS\" (\"TIEUDE\" , \"MOTA\" , \"KEY\" , \"IMAGE\") VALUES ('" + req.body.tieude + "','" + req.body.mota + "','" + req.body.key + "','" + req.file.originalname + "')", function (err, result) {
                    //call `done()` to release the client back to the pool
                    done();

                    if (err) {
                        return console.error('error running query', err);
                    }
                    res.redirect("./list");
                    //output: 1
                });
            });
        }

        // Everything went fine
    })
});

app.get("/videos/edit/:id", function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * FROM "VIDEOS" WHERE "ID" = ' + req.params.id, function (err, result) {
            //call `done()` to release the client back to the pool
            done();

            if (err) {
                return console.error('error running query', err);
            }
            res.render("edit", { data: result.rows[0] });
            //output: 1
        });
    });
});

app.post("/videos/edit/:id", urlencodedParser, function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            res.send("Error when uploading file: " + err);
        } else if (req.file == undefined) {
            console.log(req.body.tieude + " " + req.body.mota + " " + req.body.key + " " + req.body.id);
            pool.connect(function (err, client, done) {
                if (err) {
                    return console.error('error fetching client from pool', err);
                }
                client.query("UPDATE \"VIDEOS\" SET \"TIEUDE\" = '" + req.body.tieude + "', \"MOTA\" = '" + req.body.mota + "', \"KEY\" = '" + req.body.key + "' WHERE \"ID\" = " + req.body.id, function (err, result) {
                    //call `done()` to release the client back to the pool
                    done();

                    if (err) {
                        return console.error('error running query', err);
                    }
                    res.redirect("../list");
                    //output: 1
                });
            });
        } else {
            pool.connect(function (err, client, done) {
                if (err) {
                    return console.error('error fetching client from pool', err);
                }
                client.query("UPDATE \"VIDEOS\" SET \"TIEUDE\" = '" + req.body.tieude + "', \"MOTA\" = '" + req.body.mota + "', \"KEY\" = '" + req.body.key + "', \"IMAGE\" = '" + req.file.originalname + "' WHERE \"ID\" = " + req.body.id, function (err, result) {
                    //call `done()` to release the client back to the pool
                    done();

                    if (err) {
                        return console.error('error running query', err);
                    }
                    res.redirect("../list");
                    //output: 1
                });
            });
        }

        // Everything went fine
    })
});