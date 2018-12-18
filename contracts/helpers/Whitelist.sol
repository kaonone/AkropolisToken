pragma solidity ^0.4.24;


import "./Ownable.sol";


/**
 * @title Whitelist
 * @dev Base contract which allows children to implement an emergency whitelist mechanism. Identical to OpenZeppelin version
 * except that it uses local Ownable contract
 */
contract Whitelist is Ownable {
    event EnableWhitelist(address indexed to);
    event DisableWhitelist(address indexed to);

    mapping(address => bool) whitelist;

    modifier onlyWhitelist() {
        require(whitelist[msg.sender] == true);
        _;
    }

    function enableWhitelist(address _address) public onlyOwner  {
        whitelist[_address] = true;
    }

    function disableWhitelist(address _address) public onlyOwner {
        whitelist[_address] = false;
    }
}