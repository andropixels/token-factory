// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TokenFactory is AccessControl {
    bytes32 public constant CREATOR_ROLE = keccak256("CREATOR_ROLE");
        
    event TokenCreated(
        address indexed tokenAddress,
        string name,
        string symbol,
        uint8 decimals,
        uint256 totalSupply,
        address indexed creator
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CREATOR_ROLE, msg.sender);
    }

    function create_erc20(
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 totalSupply
    ) public onlyRole(CREATOR_ROLE) returns (address) {
        CustomToken newToken = new CustomToken(
            name,
            symbol,
            decimals,
            totalSupply,
            msg.sender
        );
        
        emit TokenCreated(
            address(newToken),
            name,
            symbol,
            decimals,
            totalSupply,
            msg.sender
        );

        return address(newToken);
    }
}

contract CustomToken is ERC20 {
    uint8 private _decimals;
    
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimalsValue,
        uint256 totalSupply,
        address tokenOwner
    ) ERC20(name, symbol) {
        _decimals = decimalsValue;
        _mint(tokenOwner, totalSupply * (10 ** decimalsValue));
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}