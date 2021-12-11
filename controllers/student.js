const Contract = require("../contract");

module.exports = {
    get: async (req, res) => {
        try {
            let index = await Contract.methods.getIndexArrByStdId(req.params.stdId).call();
            let student = await Contract.methods.students(index).call();
            res.json(student);
        } catch (error) {
            res.json({error});
        }
    },
    post: async (req, res) => {

    }
}