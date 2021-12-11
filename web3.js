const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`));

web3.eth.handleRevert = true;
web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
module.exports = web3;