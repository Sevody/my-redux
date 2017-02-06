export default function(state={value: 0}, action) {
    if (!action) return state
    switch (action.type) {
        case 'MINUS':
            return {value: state.value - 1}
        case 'PLUS':
            return {value: state.value + 1}
        default:
            return state
    }
}
