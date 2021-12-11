const web3 = require("./web3");
const fs = require("fs");

let data = fs.readFileSync("./contracts/artifacts/RecordTracking_metadata.json");
data = JSON.parse(data);

const abi = data.output.abi;

const Contract = new web3.eth.Contract(abi, '0xe62CD3D1C0BbCD9Ea98f2B1F18FC3a7c77EE46c9');

module.exports = Contract;