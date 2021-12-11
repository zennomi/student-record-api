const web3 = require("./web3");
const fs = require("fs");

let data = fs.readFileSync("./contracts/artifacts/RecordTracking_metadata.json");
data = JSON.parse(data);

const abi = data.output.abi;

const Contract = new web3.eth.Contract(abi, '0xb0a12fA4DC22c011E885Bbb4946fC1B22805C566');

module.exports = Contract;