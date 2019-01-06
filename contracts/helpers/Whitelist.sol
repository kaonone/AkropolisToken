pragma solidity ^0.4.24;


import "./Ownable.sol";
/**
 * @title Whitelist
 * @dev Base contract which allows children to implement an emergency whitelist mechanism. Identical to OpenZeppelin version
 * except that it uses local Ownable contract
 */
 
contract Whitelist is Ownable {
    event AddToWhitelist(address indexed to);
    event RemoveFromWhitelist(address indexed to);
    event EnableWhitelist();
    event DisableWhitelist();

    mapping(address => bool) whitelist;

    /**
    * @dev Modifier to make a function callable only when msg.sender is in whitelist.
    */
    modifier onlyWhitelist() {
        if (isWhitelisted() == true) {
            require(whitelist[msg.sender] == true, "Address is not in whitelist");
        }
        _;
    }

   /**
    * @dev called by the owner to enable whitelist
    */

    function enableWhitelist() public onlyOwner {
        setWhitelisted(true);
        emit EnableWhitelist();
    }


    /**
    * @dev called by the owner to disable whitelist
    */
    function disableWhitelist() public onlyOwner {
        setWhitelisted(false);
        emit DisableWhitelist();
    }

    /**
    * @dev called by the owner to enable some address for whitelist
    */
    function addToWhitelist(address _address) public onlyOwner  {
        whitelist[_address] = true;
        emit AddToWhitelist(_address);
    }

    /**
    * @dev called by the owner to disable address for whitelist
    */
    function removeFromWhitelist(address _address) public onlyOwner {
        whitelist[_address] = false;
        emit RemoveFromWhitelist(_address);
    }


    // bool public whitelisted = false;

    function setWhitelisted(bool value) internal {
        bytes32 slot = keccak256(abi.encode("Whitelist", "whitelisted"));
        uint256 v = value ? 1 : 0;
        assembly {
            sstore(slot, v)
        }
    }

    function isWhitelisted() public view returns (bool) {
        bytes32 slot = keccak256(abi.encode("Whitelist", "whitelisted"));
        uint256 v;
        assembly {
            v := sload(slot)
        }
        return v != 0;
    }
}