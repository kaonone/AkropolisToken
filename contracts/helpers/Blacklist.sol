pragma solidity >=0.4.24;


import "./Ownable.sol";
/**
 * @title blacklist
 * @dev Base contract which allows children to implement an emergency blacklist mechanism. Identical to OpenZeppelin version
 * except that it uses local Ownable contract
 */
 
contract Blacklist is Ownable {
    event AddToBlacklist(address indexed to);
    event RemoveFromBlacklist(address indexed to);
    event EnableBlacklist();
    event DisableBlacklist();
   
    event RemovePermBalanceToblacklist(address indexed to);

    mapping(address => bool) internal blacklist;
  

    /**
    * @dev Modifier to make a function callable only when msg.sender is in not blacklist.
    */
    modifier notForBlacklist(address account) {
        if (isBlacklisted() == true) {
            require(blacklist[account] == false, "Address is in blacklist");
        }
        _;
    }

    /**
    * @dev Modifier to make a function callable only when msg.sender is in not blacklist.
    */
    modifier forBlacklist(address account) {
        if (isBlacklisted() == true) {
            require(blacklist[account] == true, "Address is not in blacklist");
        }
        _;
    }


   
    /**
    * @dev called by the owner to enable blacklist
    */

    function enableBlacklist() public onlyOwner {
        setBlacklisted(true);
        emit EnableBlacklist();
    }


    /**
    * @dev called by the owner to disable blacklist
    */
    function disableBlacklist() public onlyOwner {
        setBlacklisted(false);
        emit DisableBlacklist();
    }

    /**
    * @dev called by the owner to enable some address for blacklist
    */
    function addToBlacklist(address _address) public onlyOwner  {
        blacklist[_address] = true;
        emit AddToBlacklist(_address);
    }

    /**
    * @dev called by the owner to disable address for blacklist
    */
    function removeFromblacklist(address _address) public onlyOwner {
        blacklist[_address] = false;
        emit RemoveFromBlacklist(_address);
    }


    // bool public blacklisted = false;

    function setBlacklisted(bool value) internal {
        bytes32 slot = keccak256(abi.encode("Blacklist", "blacklisted"));
        uint256 v = value ? 1 : 0;
        assembly {
            sstore(slot, v)
        }
    }

    function isBlacklisted() public view returns (bool) {
        bytes32 slot = keccak256(abi.encode("Blacklist", "blacklisted"));
        uint256 v;
        assembly {
            v := sload(slot)
        }
        return v != 0;
    }
}