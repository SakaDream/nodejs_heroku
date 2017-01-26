var express = require("express");
var app = express();
var pg = require("pg");
var bodyParser = require("body-parser");
var multer = require("multer");
var validator = require("express-validator");
var session = require("express-session");
var cookie = require("cookie-parser");

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(validator());
app.use(session({ secret: 'user', saveUninitialized: false, resave: false, cookie: { maxAge: 15 * 60 * 1000 } }));
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});
app.set("view engine", "ejs");
app.set("views", "./views");
app.set("hidden", "hidden");
app.listen(process.env.PORT || 3000);

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
    if (req.session.username === undefined) {
        res.redirect("../login");
    } else {
        var properties = {
            roleid: req.session.roleid,
            name: "View",
            icon: "fa fa-eye"
        }
        if (req.session.roleid === 1) {
            properties.name = "Edit";
            properties.icon = "fa fa-edit";
        }
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
                res.render("list", { data: result, properties: properties });
                //output: 1
            });
        });
    }
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
    var properties = {
        disabled: "disabled",
        name: "Back to List"
    }
    if (req.session.roleid === 1) {
        properties.disabled = "";
        properties.name = "Submit";
    }
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
            res.render("edit", { data: result.rows[0], properties: properties });
            //output: 1
        });
    });
});

app.post("/videos/edit/:id", urlencodedParser, function (req, res) {
    if (req.session.roleid === 1) {
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
    } else if (req.session.roleid === 2) {
        res.redirect("../list");
    } else {
        res.send("Something wrong...");
    }
});

app.get("/login", function (req, res) {
    var hiddenLG = 1;
    var hiddenSU = 1;
    res.render("login", { hiddenLG: hiddenLG, hiddenSU: hiddenSU });
});

app.post("/login", urlencodedParser, function (req, res) {
    var hiddenLG = 0;
    var hiddenSU = 1;
    var error = '';

    var username = req.body.username;
    var password = req.body.password;

    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query("SELECT \"PASSWORD\" , \"EMAIL\" , \"ROLEID\" FROM \"USERS\" WHERE \"USERNAME\" LIKE '" + username + "'", function (err, result) {
            //call `done()` to release the client back to the pool
            done();

            if (err) {
                return console.error('error running query', err);
            }
            if (result.rows.length === 0) {
                error = 'Username không tồn tại';
                return res.render("login", { hiddenLG: hiddenLG, hiddenSU: hiddenSU, error: error });
            } else {
                var Rpassword = result.rows[0].PASSWORD;
                var Remail = result.rows[0].EMAIL;
                var RroleId = result.rows[0].ROLEID;
                var passCrypt = require('crypto').createHash('md5').update(password).digest('hex');

                if (Rpassword.toString().trim() === passCrypt.toString().trim()) {
                    var session = req.session;
                    session.username = username;
                    session.email = Remail;
                    session.roleid = parseInt(RroleId);
                    return res.redirect("/videos/list");
                } else {
                    error = 'Mật khẩu không đúng';
                    return res.render("login", { hiddenLG: hiddenLG, hiddenSU: hiddenSU, error: error });
                }
            }
            //output: 1
        });
    });
});

app.get("logout", function(req, res){
    req.session.destroy(function(err){
        console.log(err);
    });
    res.render("login");
});

app.post("/register", urlencodedParser, function (req, res) {
    var hiddenLG = 1;
    var hiddenSU = 0;
    var error = '';
    var flag = '0';

    req.check('email', 'Email không hợp lệ').isEmail();
    req.check('password', 'Password phải trên 6 kí tự').isLength({ min: 6 });
    req.check('comfirmPassword', 'Xác thực password không đúng').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        error = errors[0].msg;
        return res.render("login", { hiddenLG: hiddenLG, hiddenSU: hiddenSU, error: error });
    } else {
        var username = req.body.username;

        pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query("SELECT \"USERNAME\" FROM \"USERS\"", function (err, result) {
                //call `done()` to release the client back to the pool
                done();

                if (err) {
                    return console.error('error running query', err);
                }
                for (var i = 0; i < result.rows.length; i++) {
                    if (result.rows[i].USERNAME.toString().trim() === username.toString().trim()) {
                        flag = '1';
                        error = 'Username đã trùng';
                        res.render("login", { hiddenLG: hiddenLG, hiddenSU: hiddenSU, error: error });
                    }
                }
                //output: 1
            });
        });

        if (flag.toString().trim === '0') {
            var email = req.body.email;
            var password = req.body.password;

            var passCrypt = require('crypto').createHash('md5').update(password).digest('hex');

            pool.connect(function (err, client, done) {
                if (err) {
                    return console.error('error fetching client from pool', err);
                }
                client.query("INSERT INTO \"USERS\" (\"USERNAME\" , \"EMAIL\" , \"PASSWORD\" , \"ROLEID\") VALUES ('" + username + "' , '" + email + "' , '" + passCrypt + "' , " + 2 + ")", function (err, result) {
                    //call `done()` to release the client back to the pool
                    done();

                    if (err) {
                        return console.error('error running query', err);
                    }
                    return res.redirect("/videos/list");
                    //output: 1
                });
            });
        }
    }
});