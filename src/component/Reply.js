import React, { Component } from 'react';
import '../App.css';
import { Row, Col, List, Input, Icon, Avatar, Form, message } from 'antd';
import ShowTime from './time'
import axios from 'axios';
import SubReply from './SubReply'



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
            data: [],
            showReply: 'none',

        }
    }
    componentDidMount = () => {
        this.setState({
            commentId: this.props.commentId,
            appInfo: this.props.appInfo,
            userInfo: this.props.userInfo,
        }, () => {
            this.queryReplys();
        })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.showIndex != this.props.showIndex) {
            if (nextProps.showIndex == this.props.commentId) {
                this.setState({ showReply: 'block', }, () => {
                    console.log(this.state.showReply);
                });
            }
            else
                this.setState({ showReply: 'none', }, () => {
                    console.log(this.state.showReply);
                });
        }
    }



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




    _handleExpend(event) {
        if (this.state.showReply === 'none') this.setState({ showReply: 'block' })
        else this.setState({ showReply: 'none' })
    }





    render() {
        return (
            <div >
                <div>{this.props.content}</div>
                <div style={{ display: this.state.showReply }}>
                    <div  >
                        <Search value={this.state.value} onChange={this.onChange.bind(this)} placeholder="请输入您的评论" enterButton="评论" size="default" onSearch={this._handleContentSubmit.bind(this)} />
                    </div>
                    <div style={{ marginTop: '10px', marginLeft: '10px' }}>
                        <List
                            itemLayout="horizontal"
                            size="small"
                            split={false}
                            dataSource={this.state.data}
                            renderItem={item => ((
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.userHeadPortrait} />}
                                        title={
                                            <div>{item.userNickName}<ShowTime time={item.createTime} />
                                                <li style={{ float: 'right', marginLeft: '20px', 'listStyle': 'none' }}>
                                                    <IconText type="message" text={item.replyCount} />
                                                </li>
                                                <li style={{ float: 'right', marginLeft: '20px', 'listStyle': 'none' }} onClick={this._handleOppose.bind(this, item.id)}  >
                                                    <IconText type={item.oppose === true ? 'dislike' : 'dislike-o'} text={item.opposeCount} />
                                                </li>
                                                <li style={{ float: 'right', marginLeft: '20px', 'listStyle': 'none' }} onClick={this._handleSupport.bind(this, item.id)}>
                                                    <IconText type={item.support === true ? 'like' : 'like-o'} text={item.supportCount} />
                                                </li>
                                            </div>}
                                        description={<SubReply key={item.id}
                                            token={this.state.appInfo.token}
                                            commentId={item.id}
                                            content={item.content}
                                            appInfo={this.state.appInfo}
                                            userInfo={this.state.userInfo}
                                            commentUser={item.userId}
                                        />} />
                                </List.Item>
                            ))}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
export default Reply;