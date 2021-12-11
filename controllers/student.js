const Contract = require("../contract");

module.exports = {
    getAll: async (req, res) => {
        try {
            let studentsLength = await Contract.methods.studentsLength().call();
            let students = [];
            for (let i = 0; i < studentsLength; i++) {
                students.push(await Contract.methods.students(i).call());
            }
            res.json(students);
        } catch (error) {
            res.json({error});
        }
    },
    get: async (req, res) => {
        try {
            let index = await Contract.methods.getArrIndexByStdId(req.params.stdId).call();
            let student = await Contract.methods.students(index).call();
            res.json(student);
        } catch (error) {
            res.json({ error });
        }
    },
    postIndex: async (req, res) => {
        try {
            const { stdId, name, iCNo } = req.body;
            console.log(req.body);
            const result = await Contract.methods.addStudent(stdId, name, iCNo).send({from: "0xf28A06Cee56473d731DbC29eA037B5D362b8b4dd", gas: "10000000"});
            res.json({status: "success", result})
        } catch (error) {
            res.json({ error });
        }
    },
    post: async (req, res) => {
        try {
            const { name, iCNo } = req.body;
            const result = await Contract.methods.changeStudentByStdId(req.params.stdId, name, iCNo).send({from: "0xf28A06Cee56473d731DbC29eA037B5D362b8b4dd", gas: "10000000"});
            res.json({status: "success", result});
        } catch (error) {
            res.json({error});
        }
    }
}