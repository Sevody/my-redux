# Redux map

```javascript
// index.js
import React,{ Component } from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './AppContainer.js';
import reducer from './reducer'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

const store = createStore(reducer)
ReactDOM.render(
    <Provider store={store}>
          <AppContainer />
    </Provider>,
  document.getElementById('root')
);
```

```javascript
// AppContainer.js
import React, { Component } from 'react';
import App from './App'

export class AppContainer extends Component {
    static contextTypes = {
        store: React.PropTypes.object
    }
    render() {
        return (
            <App
                minus={() => {this.context.store.dispatch({type: 'MINUS'})}}
                value={this.context.store.getState().value}
                plus={() => {this.context.store.dispatch({type: 'PLUS'})}}
            />
        );
    }
}

// AppContainer.js version 2
import React, { Component } from 'react';
import { conncet } from 'react-redux'
import App from './App'

const mapStateToProps = (state) => {
    return {
        value: state.value
    }
}
// const mapDispatchToProps = (dispatch) => {
//     return {
//     minus: ()=>dispatch({type: 'MINUS'}),
//     plus: ()=>dispatch({type: 'PLUS'})}
// }
const mapDispatchToProps = {
    minus: ()=> {
        return {type: 'MINUS'}
    },
    plus: ()=> {
        return {type: 'PLUS'}
    }
}

class AppContainer extends Component {
    render() {
        return (
            <App
                minus={this.props.minus}
                value={this.props.value}
                plus={this.props.plus}
            />
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AppContainer)
```

```javascript
// App.js
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  minus(){
    this.props.minus()
  }
  render() {
    return (
      <div className="App">
        <h3>redux counter</h3>
        <div className="counter">
          <div className="minus" onClick={()=>this.minus()}>-</div>
          <input type="text" value={this.props.value}/>
          <div className="plus" onClick={this.props.plus}>+</div>
        </div>
      </div>
    );
  }
}

export default App;
```
## redux

### Action

```javascript
minus = () => {
        return {type: 'MINUS'}
    }
plus = () => {
        return {type: 'PLUS'}
    }

export {minus, plus}
```
### Reducer

```javascript
// reducer.js
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
```

### Store

```javascript
// redux.js
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
```

### combineReducers

```javascript
const combineReducers = (reducers) => {
    return (state = {}, action) => {
        return object.keys(reducers).reduce(
            (nextState, key) => {
                nextState[key] = reducers[key](
                    state[key],
                    action
                );
                return nextState;
            },
            {}
        );
    };
};
```

### compose

```javascript
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  const last = funcs[funcs.length - 1]
  const rest = funcs.slice(0, -1)
  return (...args) => rest.reduceRight((composed, f) => f(composed), last(...args))
}
```

### applyMiddleware

```javascript
import compose from './compose'

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */

export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadedState, enhancer) => {
    var store = createStore(reducer, preloadedState, enhancer)
    var dispatch = store.dispatch
    var chain = []

    var middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    }
    chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
```

## react-redux

### Provider

```javascript
// react-redux.js
export class Provider extends Component {
    static childContextTypes = {
        store: React.PropTypes.object
    }
    getChildContext() {
        return {store: this.props.store};
    }
    render() {
        return (
            <div>{this.props.children}</div>
        );
    }
}

ReactDOM.render(
    <Provider store={store}>
          <AppContainer />
    </Provider>,
  document.getElementById('root')
);
```
### connect

```javascript
// react-redux.js
function connect(mapStateToProps, mapDispatchToProps) {
    return function(WrappedComponent) {
        return class Connector extends Component {
            static contextTypes = {
                store: React.PropTypes.object
            }
            constructor(props, context){
                super(props, context)
                this.state = this.context.store.getState()
            }
            componentDidMount(){
                this.context.store.subscribe(()=>{
                    this.setState(this.context.store.getState())
                })
            }
            bindActionCreator(mapDispatchToProps, dispatch){
                if (typeof mapDispatchToProps ==='function') {
                    return mapDispatchToProps(dispatch)
                } else {
                    let mapProps = {}
                    Object.keys(mapDispatchToProps).forEach((key) => {
                        mapProps[key] = (...args) => {
                            dispatch(mapDispatchToProps[key].apply(null, ...args))
                        }
                    })
                    return mapProps
                }
            }
            render() {
                this.mapState = mapStateToProps(this.state)
                this.mapProps = this.bindActionCreator(mapDispatchToProps, this.context.store.dispatch)
                // this.mapProps = mapDispatchToProps(this.context.store.dispatch)
                this.allprops = Object.assign({}, this.props, this.mapState, this.mapProps)
                return <div>
                    <WrappedComponent
                        { ...this.allprops}
                    ></WrappedComponent>
                </div>
            }
        }
    }
}
```

## redux-thunk

```javascript
// redux-thunk
function createThunkMiddleware(extraArgument) {
  return function (_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (typeof action === 'function') {
          return action(dispatch, getState, extraArgument);
        }

        return next(action);
      };
    };
  };
}

var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```
