let state = {value: 0}
let fresh = null
let reducers = null
function dispatch(action) {
    state = reducers(state, action)
    fresh && fresh()
}
function getState() {
    return state
}
function subscribe(func) {
    fresh = func
}
function createStore(reducer) {
    reducers = reducer
    dispatch()
    return {
        dispatch,
        getState,
        subscribe
    }
}

export { createStore }
