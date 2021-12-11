const Contract = require("../contract");

module.exports = {
    get: async (req, res) => {
        try {
            let recordIndexes = await Contract.methods.getRecordIndexesByStdId(req.query.stdId).call();
            let records = [];
            for (let index of recordIndexes) {
                const record = await Contract.methods.records(index).call();
                records.push(record);
            }
            res.json(records);
        } catch (error) {
            res.json({error});
        }
    }
}