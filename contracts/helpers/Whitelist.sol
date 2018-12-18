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
    event Enable();
    event Disable();

    mapping(address => bool) whitelist;

    bool public enable = false;

    /**
    * @dev Modifier to make a function callable only when msg.sender is in whitelist.
    */
    modifier onlyWhitelist() {
        if (enable == true) {
            require(whitelist[msg.sender] == true, "Address is not in whitelist");
        }
        _;
    }


   /**
    * @dev called by the owner to enable whitelist
    */

    function enable() public onlyOwner {
        enable = true;
        emit Enable();
    }


    /**
    * @dev called by the owner to disable whitelist
    */
    function disable() public onlyOwner {
        enable = false;
        emit Disable();
    }

    /**
    * @dev called by the owner to enable some address for whitelist
    */
    function enableWhitelist(address _address) public onlyOwner  {
        whitelist[_address] = true;
        emit EnableWhitelist(_address);
    }

    /**
    * @dev called by the owner to disable address for whitelist
    */
    function disableWhitelist(address _address) public onlyOwner {
        whitelist[_address] = false;
        emit DisableWhitelist(_address);

    }
}