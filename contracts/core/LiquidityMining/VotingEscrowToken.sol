// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.9;

import "../../interfaces/IPVeToken.sol";
import "../../libraries/VeBalanceLib.sol";

/**
 * @dev this contract is an abstract for its mainchain and sidechain variant
 * PRINCIPLE:
 *   - All functions implemented in this contract should be either view or pure 
 *     to ensure that no writing logic is inheritted by sidechain version
 *   - Mainchain version will handle the logic which are:
 *        + Deposit, withdraw, increase lock, increase amount
 *        + Mainchain logic will be ensured to have _totalSupply = linear sum of 
 *          all users' veBalance such that their locks are not yet expired
 *        + Mainchain contract reserves 100% the right to write on sidechain
 *        + No other transaction is allowed to write on sidechain storage
 */

abstract contract VotingEscrowToken is IPVeToken {
    using VeBalanceLib for VeBalance;

    uint256 public constant WEEK = 1 weeks;
    uint256 public constant MAX_LOCK_TIME = 104 weeks;

    enum UPDATE_TYPE {
        UpdateUserPosition,
        UpdateTotalSupply
    }

    struct LockedPosition {
        uint256 amount;
        uint256 expiry;
    }

    VeBalance internal _totalSupply;
    uint256 public lastSupplyUpdatedAt;
    mapping(address => LockedPosition) internal positionData;

    constructor() {
        lastSupplyUpdatedAt = (block.timestamp / WEEK - 1) * WEEK;
    }

    function balanceOf(address user) public view returns (uint256) {
        return convertToVeBalance(positionData[user]).getCurrentValue();
    }

    function readUserInfo(address user) external view returns (uint256 amount, uint256 expiry) {
        amount = positionData[user].amount;
        expiry = positionData[user].expiry;
    }

    function totalSupply() public view virtual returns (uint256) {
        require(
            lastSupplyUpdatedAt >= (block.timestamp / WEEK) * WEEK,
            "paused: total supply unupdated"
        );
        return _totalSupply.getCurrentValue();
    }

    function updateAndGetTotalSupply() external virtual returns (uint256);

    function isPositionExpired(address user) public view returns (bool) {
        return positionData[user].expiry < block.timestamp;
    }


    function convertToVeBalance(LockedPosition memory position)
        public
        pure
        returns (VeBalance memory res)
    {
        res.slope = position.amount / MAX_LOCK_TIME;
        require(res.slope > 0, "invalid slope");
        res.bias = res.slope * position.expiry;
    }
}