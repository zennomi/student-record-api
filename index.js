require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded());

const studentController = require("./controllers/student");
const recordsController = require("./controllers/records");

app.route("/students").get(studentController.get);

app.route("/student/:stdId").get(studentController.get).post(studentController.post);

app.route("/records").get(recordsController.get);

app.use("*", (req, res) => res.json({messgae: "Nguyen Dang Tuan Anh - K64"}))

app.listen(port);

console.log('RESTful API server started on: ' + port);