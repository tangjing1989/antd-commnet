import React, { Component } from 'react';
import '../App.css';
import { Input, Row, Col, List, message, Form, Icon, Avatar } from 'antd';
import ShowTime from './time';
import Reply from './Reply'

import axios from 'axios';
const Search = Input.Search;
const FormItem = Form.Item;


const IconText = ({ type, text }) => (
    <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
    </span>
);

class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            targetSubType: 1, //目标主体类型1评论；2回复
            appInfo: { appId: '', topicId: '', topicType: '', token: '' },
            userInfo: { userId: '', nickName: '', avatar: '', },
            pageNum: 1,
            pageSize: 5,
            total: 0,
            data: [],
            showIndex: 0,
            initflag: true,
        }
    }

    componentDidMount = () => {
        this.setState({
            appInfo: this.props.appInfo,
            userInfo: this.props.userInfo,
        });
    }




    componentWillReceiveProps(nextProps) {
        if (nextProps.appInfo.token) {
            this.setState({
                appInfo: {
                    appId: nextProps.appInfo.appId,
                    topicId: nextProps.appInfo.topicId,
                    topicType: nextProps.appInfo.topicType,
                    token: nextProps.appInfo.token,
                }
            }, () => {
                if (this.state.initflag == true) {
                    this.setState({
                        initflag: false,
                    }, () => this.queryComments())

                }
            })
        }
    }


    //获取评论列表    
    queryComments() {
        this.props.ChangeLoad(true, ' 评论加载中...');
        var params = new URLSearchParams();
        params.append("token", this.state.appInfo.token);

        // params.append("appId", this.state.appInfo.appId);
        params.append("topicId", this.state.appInfo.topicId);
        params.append("topicType", this.state.appInfo.topicType);
        params.append("userId", this.state.userInfo.userId);


        params.append("pageNum", this.state.pageNum);
        params.append("pageSize", this.state.pageSize);
        params.append("expand", true);
        // params.append("expandSize", this.state.pageSize);
        axios.post('/comment/queryCommentInfoList', params)
            .then(res => {
                this.props.ChangeLoad(false, ' ');
                this.setState({
                    data: [],
                    data: res.data.data.list,
                    total: res.data.data.total,
                    loading: false
                }, () => {
                    this.props.ChangeLoad(false, '');
                });
            });
    }




    _handleSupport(value) {
        var params = new URLSearchParams();
        params.append("token", this.state.appInfo.token);
        params.append("topicId", this.state.appInfo.topicId);
        params.append("topicType", this.state.appInfo.topicType);

        params.append("userId", this.state.userInfo.userId);
        params.append("nickName", this.state.userInfo.nickName);
        params.append("avatar", this.state.userInfo.avatar);

        params.append("targetId", value);
        params.append("targetSubType", this.state.targetSubType);

        params.append("operType", 1);
        axios.post('/commentOper/saveCommentReplyOper', params).then(res => { this.queryComments() });
    }

    _handleOppose(value) {
        var params = new URLSearchParams();
        params.append("token", this.state.appInfo.token);
        params.append("topicId", this.state.appInfo.topicId);
        params.append("topicType", this.state.appInfo.topicType);

        params.append("userId", this.state.userInfo.userId);
        params.append("nickName", this.state.userInfo.nickName);
        params.append("avatar", this.state.userInfo.avatar);

        params.append("targetId", value);
        params.append("targetSubType", this.state.targetSubType);

        params.append("operType", 2);
        axios.post('/commentOper/saveCommentReplyOper', params).then(res => { this.queryComments() });
    }

    _handMessage(value){
        this.setState({
            showIndex: value != this.state.showIndex?value:0,
        })
        
    }


    _handleContentSubmit(value) {
        this.props.ChangeLoad(true, '数据保存中...');
        var params = new URLSearchParams();
        params.append("token", this.state.appInfo.token);
        params.append("topicId", this.state.appInfo.topicId);
        params.append("topicType", this.state.appInfo.topicType);

        params.append("userId", this.state.userInfo.userId);
        params.append("nickName", this.state.userInfo.nickName);
        params.append("avatar", this.state.userInfo.avatar);

        params.append("content", value);
        axios.post('/comment/saveCommentInfo', params)
            .then(res2 => {
                if (res2.data.code === 0) {
                    this.setState({
                        loading: false,
                        value: ''
                    }, () => {
                        this.props.ChangeLoad(false, '');
                        message.success(res2.data.message);
                        this.queryComments((res) => { })
                    });
                }
                else {
                    this.props.ChangeLoad(false, '');
                    message.error(res2.data.message);
                }
            });
    }


    onChange(event) {
        this.setState({ value: event.target.value });
    }


    render() {
        const pagination = {
            pageSize: this.state.pageSize,
            current: this.state.pageNum,
            total: this.state.total,
            onChange: ((res1) => {
                this.setState({ pageNum: res1 }, () => { this.queryComments((res2) => { }) })
            }),
        };

        return (
            <div  >
                <Form>
                    <FormItem>
                        <Row>
                            <Col span={12} offset={6}>
                                <div className='comment'>
                                    <div className="c-header">
                                        <em>{this.state.total} </em>条评论
                                    </div>
                                </div>
                                <Search value={this.state.value} onChange={this.onChange.bind(this)} placeholder="请输入您的评论" enterButton="评论" size="large" onSearch={this._handleContentSubmit.bind(this)} />
                            </Col>
                        </Row>
                    </FormItem>
                </Form>
                <Row >
                    <Col span={12} offset={6}>
                        <List
                            itemLayout="horizontal"
                            size="small"
                            split={false}
                            pagination={pagination}
                            dataSource={this.state.data}
                            renderItem={item => (
                                (<List.Item >
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.userHeadPortrait} />}
                                        title={<div>{item.userNickName}<ShowTime time={item.createTime} />
                                            <li style={{ float: 'right', marginLeft: '20px', 'listStyle': 'none' }} onClick={this._handMessage.bind(this,item.id)} >
                                                <IconText type="message" text={item.replyCount} />
                                            </li>
                                            <li style={{ float: 'right', marginLeft: '20px', 'listStyle': 'none' }} onClick={this._handleOppose.bind(this, item.id)}  >
                                                <IconText type={item.oppose === true ? 'dislike' : 'dislike-o'} text={item.opposeCount} />
                                            </li>
                                            <li style={{ float: 'right', marginLeft: '20px', 'listStyle': 'none' }} onClick={this._handleSupport.bind(this, item.id)}>
                                                <IconText type={item.support === true ? 'like' : 'like-o'} text={item.supportCount} />
                                            </li>
                                        </div>}
                                        description={<Reply key={item.id}
                                            token={this.state.appInfo.token}
                                            commentId={item.id}
                                            content={item.content}
                                            appInfo={this.state.appInfo}
                                            userInfo={this.state.userInfo} 
                                            commentUser={item.userId}
                                            showIndex={this.state.showIndex}
                                        />}
                                    />

                                </List.Item>)
                            )}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Comment;
