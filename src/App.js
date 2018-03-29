import React, { Component } from 'react';
import './App.css';
import { Spin, message } from 'antd';
import axios from 'axios';
import Comment from './component/Comment'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loadText: '应用初始化...',

      appSecrt: 'BBE3D13BFA62162E20543DD2AAB20B4508D006EB4A5731E0A5C9BA2381A70FD92D179596E366A33E',
      code: '',


      appInfo: {
        appId: "973845890455969792",
        topicId: '13',
        topicType: '1',
        token: '',
      },

      userInfo: {
        userId: '1111',
        nickName: '',
        avatar: "http://www.qqzhi.com/uploadpic/2014-09-23/000247589.jpg",
      },

    }
  }

  componentDidMount = () => {
    this.getCode((res1) => {
      this.getToken((res2) => {
        this.getUserInfo((res3) => {
        });
      });
    })
  }


  //获取授权的 Code
  getCode = (callback) => {
    this._handleChangeLoad(true, '获取授权code...');
    axios.get('/app/appauthorize', {
      'params': {
        'appId': this.state.appInfo.appId,
        'redirectUri': 'test'
      }
    }).then(res => {
      this.setState({ code: res.data }, () => {
        this._handleChangeLoad(true, '获取授权code成功!');
        callback(res.data);
      });
    })
  }

  // 获取授权的 token
  getToken = (callback) => {
    this._handleChangeLoad(true, '获取授权token...');
    axios.get('/app/token', {
      'params': {
        'appId': this.state.appInfo.appId,
        'appSecrt': this.state.appSecrt,
        'code': this.state.code
      }
    }).then(res => {
      if (res.data.code !== 0) {
        message.error(res.data.message)
      }
      else
        this.setState({
          appInfo: {
            appId: this.state.appInfo.appId,
            topicId: this.state.appInfo.topicId,
            topicType: this.state.appInfo.topicType,
            token: res.data.data.token,
          }
        },
          () => {
            this._handleChangeLoad(true, '获取授权token成功');
            callback(res.data.data.token);
          })
    });
  }

  //获取用户信息
  getUserInfo = (callback) => {
    this._handleChangeLoad(true, '获取用户信息...');
    var params = new URLSearchParams();
    params.append("appId", this.state.appInfo.appId);
    params.append("appUserId", this.state.userInfo.userId);
    params.append("userNickName", this.state.userInfo.nickName);
    params.append("userHeadPortrait", this.state.userInfo.avatar);
    params.append("token", this.state.appInfo.token);
    axios.post('/userInfo/queryUserInfoByAppIdAndUserId', params).then(res => {
      callback(res.data.data.id);
      this._handleChangeLoad(true, '获取用户信息成功...');
      this._handleChangeLoad(false, '');
    });
  }


  _handleChangeLoad(load, loadText) { this.setState({ loading: load, loadText: !loadText ? '' : loadText }) }


  render() {
    return (
      <Spin spinning={this.state.loading} delay={0} tip={this.state.loadText} >
        <Comment ChangeLoad={this._handleChangeLoad.bind(this)}
          appInfo={this.state.appInfo}
          userInfo={this.state.userInfo} />
      </Spin>
    );
  }
}

export default App;
