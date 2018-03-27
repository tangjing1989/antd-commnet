import React, { Component } from 'react';
import '../App.css';
import { Input, Row, Col, List, message, Form } from 'antd';
import ShowTime from './time'
import Reply from './Reply'
import CommentInput from './2LevelInput'

import axios from 'axios';
const Search = Input.Search;
const FormItem = Form.Item;

class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {

            appId: "973845890455969792",
            topicId: '13',
            targetSubType: '1',
            topicType: '1',
            token: '',
            code: '',

            userId: '',
            pageNum: 1,
            pageSize: 5,
            total: 0,
            data: [],
        }
    }

    componentDidMount = () => {
        this.getCode((res) => {
            this.getToken((res) => {
                this.getUserInfo((res) => {
                    this.queryComments();
                })
            });
        })
    }




    //获取评论列表    
    queryComments() {
        this.props.ChangeLoad(true, ' 评论加载中...');
        var params = new URLSearchParams();
        params.append("appId", "973845890455969792");
        params.append("topicId", "13");
        params.append("expand", true);
        params.append("userId", this.state.userId);
        params.append("token", this.state.token);
        params.append("topicType", this.state.topicType);
        params.append("pageNum", this.state.pageNum);
        params.append("pageSize", this.state.pageSize);
        // params.append("expandSize", this.state.pageSize);
        axios.post('/comment/queryCommentInfoList', params)
            .then(res => {
                this.props.ChangeLoad(false, ' ');
                this.setState({
                    data: res.data.data.list,
                    total: res.data.data.total,
                    loading: false
                }, () => {
                    this.props.ChangeLoad(false, '');
                });
            });
    }

    //获取授权的 Code
    getCode = (callback) => {
        axios.get('/app/appauthorize', {
            'params': {
                'appId': '973845890455969792',
                'redirectUri': 'test'
            }
        }).then(res => { this.setState({ code: res.data }, () => { callback(res.data) }); })
    }

    // 获取授权的 token
    getToken = (callback) => {
        axios.get('/app/token', {
            'params': {
                'appId': '973845890455969792',
                'appSecrt': 'BBE3D13BFA62162E20543DD2AAB20B4508D006EB4A5731E0A5C9BA2381A70FD92D179596E366A33E',
                'code': this.state.code
            }
        }).then(res => {
            if (res.data.code !== 0) {
                message.error(res.data.message)
            }
            else
                this.setState({ 'token': res.data.data.token }, () => { callback(res.data.data.token) })
        });
    }

    //获取用户信息
    getUserInfo = (callback) => {
        this.props.ChangeLoad(true, '授权成功...');
        var params = new URLSearchParams();
        params.append("appId", this.state.appId);
        params.append("appUserId", "11111");
        params.append("userNickName", "test");
        params.append("userHeadPortrait", "http://www.qqzhi.com/uploadpic/2014-09-23/000247589.jpg");
        params.append("token", this.state.token);
        axios.post('/userInfo/queryUserInfoByAppIdAndUserId', params).then(res => {
            this.setState({ userId: res.data.data.id }, () => {
                callback(res.data.data.id);
                this.props.ChangeLoad(true, '获取用户信息成功...');
            })
        });
    }




    _handleContentSubmit(value) {
        this.props.ChangeLoad(true, '数据保存中...');
        var params = new URLSearchParams();
        params.append("appId", "973845890455969792");
        params.append("topicId", this.state.topicId);
        params.append("userId", this.state.userId);
        params.append("token", this.state.token);
        params.append("topicType", "1");
        params.append("content", value);
        params.append("author", "{'id':'1','nickName':'test','avatarUrl':'1111111'}");
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
            <div className="detail-comment" >
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
                            itemLayout="vertical"
                            size="small"
                            split={false}
                            pagination={pagination}
                            dataSource={this.state.data}
                            renderItem={item => (
                                (<List.Item
                                    key={item.title}
                                    actions={[
                                        <Reply  replyCount={item.replyCount} parantItem={item} id={item.id} 
                                        userId={this.state.userId}
                                        token={this.state.token} />
                                    ]} >
                                    <List.Item.Meta
                                        title={
                                            <ul className="ant-list-item-action">
                                                <span className="ant-avatar ant-avatar-circle ant-avatar-image">
                                                        <img src={item.userHeadPortrait} alt=''  />
                                                </span>
                                                <li><a >{item.userNickName}</a>
                                                </li>
                                                <li><ShowTime time={item.createTime} />
                                                </li>
                                            </ul>}
                                        description={
                                            <div>
                                                <div className="ant-list-item-content">
                                                    {item.content}
                                                </div>
                                                <CommentInput
                                                    item={item}
                                                    token={this.state.token}
                                                    query={this.queryComments.bind(this)}

                                                    userId={this.state.userId}
                                                    appId={this.state.appId}
                                                    topicId={this.state.topicId}
                                                    targetSubType={1}
                                                    topicType={this.state.topicType}
                                                    targetId={item.id}
                                                    oprId={item.id}
                                                    type={0}
                                                />
                                            </div>
                                        }
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
