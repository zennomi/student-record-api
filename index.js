require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));

const Contract = require("./contract");


const studentController = require("./controllers/student");
const recordController = require("./controllers/record");

app.route("/students").get(studentController.getAll);

app.route("/student").post(studentController.postIndex);

app.route("/student/:stdId")
    .get(studentController.get)
    .post(studentController.post);

app.route("/records/student/:stdId")
    .get(recordController.getByStdId)
    .post(recordController.postByStdId);

app.route("/records/subject/:subjectId").get(recordController.getByStdId);

app.route("/sender").get(async (req, res) => {
    try {
        const sender = await Contract.methods.sender().call();
        res.json(sender);
    } catch (error) {
        res.json({error});
    }
});

app.route("/admin").get(async (req, res) => {
    try {
        const admin = await Contract.methods.admin().call();
        res.json(admin);
    } catch (error) {
        res.json({error});
    }
});

app.use("*", (req, res) => res.json({ message: "Nguyen Dang Tuan Anh - K64" }))

app.listen(port);

console.log('RESTful API server started on: ' + port);