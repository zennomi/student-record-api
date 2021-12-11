const Contract = require("../contract");

module.exports = {
    getByStdId: async (req, res) => {
        try {
            let recordIndexes = await Contract.methods.getRecordIndexesByStdId(req.params.stdId).call();
            let records = [];
            for (let index of recordIndexes) {
                const record = await Contract.methods.records(index).call();
                records.push(record);
            }
            res.json(records);
        } catch (error) {
            res.json({error});
        }
    },
    postByStdId: async (req, res) => {
        try {
            const {subjectId, mark} = req.body;
            console.log(req.body);
            const result = await Contract.methods.addRecordByStdId(req.params.stdId, subjectId, mark).send({from: "0xf28A06Cee56473d731DbC29eA037B5D362b8b4dd", gas: "10000000"});
            res.json({status: "success", result});
        } catch (error) {
            res.json({error});
        }
    }
}