import React,{ Component } from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './AppContainer.js';
import './index.css';
import reducer from './reducer'
import { createStore } from './redux'
// import { Provider } from 'react-redux'

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

const store = createStore(reducer)
ReactDOM.render(
    <Provider store={store}>
          <AppContainer />
    </Provider>,
  document.getElementById('root')
);




