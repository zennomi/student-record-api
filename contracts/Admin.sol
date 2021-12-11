pragma solidity ^0.5.0;

contract Admin {
    address public admin;

    constructor() public {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }
}