const Web3 = require('web3');

const infuraKey = "b57aea0ac6d94184b71b2effc9918144";

const web3 = new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/v3/${infuraKey}`));

const abi = [
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "_player",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "NewEnter",
        "type": "event"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "manager",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "players",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "winner",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "enter",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "pickWinner",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getPlayers",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
]

const Lottery = new web3.eth.Contract(abi, '0x9725e50cD85aeF5e10bEe8C5D173dB5c4e00dB74');

(async () => {
    const manager = await Lottery.methods.manager().call();
    console.log(manager);
})();