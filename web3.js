const Web3 = require('web3');

const infuraKey = "b57aea0ac6d94184b71b2effc9918144";

const web3 = new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/v3/${infuraKey}`));
web3.eth.handleRevert = true;

module.exports = web3;