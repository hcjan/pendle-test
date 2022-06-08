// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.13;
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

interface IPPrincipalToken is IERC20Metadata {
    function burnByYT(address user, uint256 amount) external;

    function mintByYT(address user, uint256 amount) external;

    function SCY() external view returns (address);

    function YT() external view returns (address);

    function factory() external view returns (address);

    function expiry() external view returns (uint256);
}
