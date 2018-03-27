import React, { Component } from 'react';
import './App.css';
import { Spin } from 'antd';
import Comment from './component/Comment'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loadText: '应用初始化...'
    }
  }

  componentDidMount = () => { }


  _handleChangeLoad(load,loadText) {
    this.setState({
        loading: load,
        loadText: !loadText?'':loadText}
        )
    }

  render() {
    return (
      <Spin spinning={this.state.loading} delay={0} tip={this.state.loadText} >
        <Comment ChangeLoad={this._handleChangeLoad.bind(this)} />
      </Spin>
    );
  }
}

export default App;
