import React, { Component } from 'react';
import App from './App'

export class nAppContainer extends Component {
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
        return{type: 'PLUS'}
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
