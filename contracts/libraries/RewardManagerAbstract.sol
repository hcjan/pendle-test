// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.13;
import "../interfaces/IRewardManager.sol";
import "./helpers/TokenHelper.sol";
import "./math/Math.sol";

abstract contract RewardManagerAbstract is IRewardManager, TokenHelper {
    using Math for uint256;

    struct RewardState {
        uint128 index;
        uint128 lastBalance;
    }

    struct UserReward {
        uint128 index;
        uint128 accrued;
    }

    // [token] => [user] => (index,accured)
    mapping(address => mapping(address => UserReward)) public userReward;

    function _updateAndDistributeRewards(address user) internal virtual {
        _updateAndDistributeRewardsForTwo(user, address(0));
    }

    function _updateAndDistributeRewardsForTwo(address user1, address user2) internal virtual {
        (address[] memory tokens, uint256[] memory indexes) = _updateRewardIndex();
        if (tokens.length == 0) return;

        if (user1 != address(0) && user1 != address(this))
            _distributeRewards(user1, tokens, indexes);
        if (user2 != address(0) && user2 != address(this))
            _distributeRewards(user2, tokens, indexes);
    }

    /// @dev private function
    function _distributeRewards(
        address user,
        address[] memory tokens,
        uint256[] memory indexes
    ) private {
        uint256 userShares = _rewardSharesUser(user);

        for (uint256 i = 0; i < tokens.length; ++i) {
            address token = tokens[i];
            uint256 index = indexes[i];
            uint256 userIndex = userReward[token][user].index;

            if (userIndex == 0) userIndex = index;
            if (userIndex == index) continue;

            uint256 deltaIndex = index - userIndex;
            uint256 rewardDelta = userShares.mulDown(deltaIndex);
            uint256 rewardAccrued = userReward[token][user].accrued + rewardDelta;

            userReward[token][user] = UserReward({
                index: index.Uint128(),
                accrued: rewardAccrued.Uint128()
            });
        }
    }

    function _updateRewardIndex()
        internal
        virtual
        returns (address[] memory tokens, uint256[] memory indexes);

    function _redeemExternalReward() internal virtual;

    function _doTransferOutRewards(address user, address receiver)
        internal
        virtual
        returns (uint256[] memory rewardAmounts);

    function _getRewardTokens() internal view virtual returns (address[] memory);

    function _rewardSharesUser(address user) internal view virtual returns (uint256);

    function _rewardSharesTotal() internal view virtual returns (uint256);
}
