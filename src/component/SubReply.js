import React, { Component } from 'react';
import '../App.css';
import { Row, Col, List, Input, Icon, Avatar, Form, message } from 'antd';
import ShowTime from './time'
import CommentInput from './CommentInput'
import axios from 'axios';

const Search = Input.Search;
const FormItem = Form.Item;
const IconText = ({ type, text }) => (
    <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
    </span>
);

class Reply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appInfo: { appId: '', topicId: '', topicType: '', },
            userInfo: { userId: '', nickName: '', avatar: '', },
            commentId: '',
            pageNum: 1,
            pageSize: 5,
            data: []

        }
    }
    componentDidMount = () => {
        this.setState({
            commentId: this.props.commentId,
            appInfo:this.props.appInfo,
            userInfo:this.props.userInfo,
        }, () => {
            this.queryReplys();
        })
    }
    componentWillReceiveProps(nextProps) { }



    _handleSupport(value) {

    }

    _handleOppose(value) {

    }



    //获取回复列表    
    queryReplys() {
        var params = new URLSearchParams();
        params.append("commentId", this.state.commentId);
        params.append("userId", this.state.userInfo.userId);
        params.append("token", this.state.appInfo.token);
        params.append("pageNum", this.state.pageNum);
        params.append("pageSize", this.state.pageSize);
        axios.post('/replyInfo/queryReplyInfoList', params)
            .then(res => {
                if (res.data.data)
                    this.setState({
                        data: res.data.data.list,
                        total: res.data.data.total,
                        loading: false
                    });
            }, () => { });
    }




    _handleContentSubmit(value) {
        // this.props.ChangeLoad(true, '数据保存中...');
        var params = new URLSearchParams();
        params.append("token", this.state.appInfo.token);
        params.append("commentId", this.props.commentId)

        params.append("userId", this.state.userInfo.userId);
        params.append("nickName", this.state.userInfo.nickName);
        params.append("avatar", this.state.userInfo.avatar);
        // params.append("toReplyId", this.props.commentId);
        params.append("toReplyUid", this.props.commentUser);

       params.append("content", value);

       axios.post('/replyInfo/saveReplyInfo', params)
            .then(res2 => {
                if (res2.data.code === 0) {
                    this.setState({
                        loading: false,
                        value: ''
                    }, () => {
                        // this.props.ChangeLoad(false, '');
                        this.queryReplys();
                        message.success(res2.data.message);
                    });
                }
                else {
                    // this.props.ChangeLoad(false, '');
                    message.error(res2.data.message);
                }
            });
    }


    onChange(event) {
        this.setState({ value: event.target.value });
    }










    render() {
        return (
            <div>
                <div>{this.props.content}</div>
                <div >
                    {/* <Search value={this.state.value} onChange={this.onChange.bind(this)} placeholder="请输入您的评论" enterButton="评论" size="default" onSearch={this._handleContentSubmit.bind(this)} /> */}
                </div>
            </div>
        );
    }
}
export default Reply;