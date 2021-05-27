import { createActions } from 'redux-actions'
import { wallet } from '../utils/wallet'
import { getLikelyContracts, getMetadata, getBalanceOf } from '../utils/tokens'

const WHITELISTED_CONTRACTS = (process.env.TOKEN_CONTRACTS || 'berryclub.ek.near,farm.berryclub.ek.near,wrap.near').split(',');

export const handleGetTokens = () => async (dispatch, getState) => {
    const { accountId } = getState().account

    await dispatch(likelyContracts.get(accountId))

    let contracts = [...new Set([...getState().tokens.likelyContracts, ...WHITELISTED_CONTRACTS])].reduce((x, contract) => ({
        ...x,
        [contract]: { contract }
    }), {})

    dispatch(tokens.set(contracts))

    const account = await wallet.getAccount(accountId)

    Object.keys(contracts).forEach(async contract => {
        dispatch(tokens.getMetadata(contract, account))
        dispatch(tokens.getBalanceOf(contract, account, accountId))
    })
}

export const { likelyContracts, tokens, clear } = createActions({
    LIKELY_CONTRACTS: {
        // dodac showAlert onlyError
        GET: getLikelyContracts,
    },
    TOKENS: {
        // ta logike wyzej od `const contracts = [...new Set(` do `dispatch(tokens.set(loadedTokens))` przeniesc tutaj do akcji
        SET: null,
        GET_METADATA: getMetadata,
        GET_BALANCE_OF: getBalanceOf
    },
    CLEAR: null
})
