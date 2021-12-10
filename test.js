const Web3 = require("web3")

const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/b57aea0ac6d94184b71b2effc9918144"))

const helloWorld = new web3.eth.Contract([
  {
    "constant": true,
    "inputs": [],
    "name": "output",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "pure",
    "type": "function"
  }
], '0x35c113E1AB11B3001e9085CBafD224FfC3470C67');

helloWorld.methods.output().call({from: '0x8863ae48646c493efF8cd54f9Ffb8Be89669E62A'});