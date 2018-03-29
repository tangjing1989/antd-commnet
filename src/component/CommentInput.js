import React, { Component } from 'react';
import { Input, message } from 'antd';
import axios from 'axios';
import '../App.css';

const Search = Input.Search;

class CommentInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showReply: 'none',
            type: 0, //0 评论 1 回复
        }
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.item) {
            const item = nextProps.item;
            this.setState({
                support: item.support ? item.support : false,
                supportCount: item.supportCount ? item.supportCount : 0,
                oppose: item.oppose ? item.oppose : false,
                opposeCount: item.opposeCount ? item.opposeCount : 0,
            })
        }
    }


    componentDidMount = () => {
        this.setState({
            type:this.props.type
        });
        if (this.props.item) {
            const item = this.props.item;
            this.setState({
                support: item.support ? item.support : false,
                supportCount: item.supportCount ? item.supportCount : 0,
                oppose: item.oppose ? item.oppose : false,
                opposeCount: item.opposeCount ? item.opposeCount : 0,
            }, () => { })
        }
    }


    _handleExpend(event) {
        if (this.state.showReply === 'none') this.setState({ showReply: 'block' })
        else this.setState({ showReply: 'none' })
    }

    _handleSupport(value, event) {
        var params = new URLSearchParams();
        params.append("operType", 1);
        params.append("targetId", this.props.oprId);
        params.append("userId", this.props.userId)

        if (this.state.type === 0) {
            params.append("topicId", this.props.topicId);
            params.append("topicType", this.props.topicType);
        }
        else {
            params.append("commentId", this.props.targetId)
        }
        params.append("targetSubType", this.props.targetSubType);
        params.append("token", this.props.token);
        params.append("author", "{'id':'1','nickName':'test','avatarUrl':'1111111'}");
        axios.post('/commentOper/saveCommentReplyOper', params).then(res => { this.props.query() });
    }

    _handleOppose(value, event) {
        var params = new URLSearchParams();
        params.append("operType", 2);
        params.append("targetId", this.props.oprId);
        params.append("targetSubType", this.props.targetSubType);
        params.append("userId", this.props.userId)
        if (this.state.type === 0) {
            params.append("topicId", this.props.topicId);
            params.append("topicType", this.props.topicType);
        }
        else {
            params.append("commentId", this.props.targetId)
        }

        params.append("token", this.props.token);
        params.append("author", "{'id':'1','nickName':'test','avatarUrl':'1111111'}");
        axios.post('/commentOper/saveCommentReplyOper', params).then(res => { this.props.query() });
    }

    _handleContentSubmit(value, event) {
        var params = new URLSearchParams();
        params.append("commentId", this.props.targetId);
        params.append("userId", this.props.userId);
        params.append("token", this.props.token);
        params.append("toReplyId", this.props.oprId);
        params.append("toReplyUid", this.props.userId);
        params.append("content", value);
        params.append("author", "{'id':'1','nickName':'test','avatarUrl':'1111111'}");
        axios.post('/replyInfo/saveReplyInfo', params)
            .then(res2 => {
                if (res2.data.code === 0) {
                    this.setState({ loading: false, value: '' }, () => {
                        message.success(res2.data.message);
                        this.props.query(); 
                    });
                }
                else {
                    message.error(res2.data.message);
                    this.setState({ loading: false });
                }
            });
    }



    onChange(event) {
        this.setState({ value: event.target.value });
    }

    render() {
        return (
            <ul className="ant-list-item-action">
                <li onClick={this._handleSupport.bind(this)}>
                    <span>
                        <i className={this.state.support === true ? 'anticon anticon-like' : 'anticon anticon-like-o'} style={{ marginRight: 8 }} />
                        {this.state.supportCount}
                    </span>
                    <em className="ant-list-item-action-split"></em> </li>
                <li onClick={this._handleOppose.bind(this)}>
                    <span>
                        <i className={this.state.oppose === true ? 'anticon anticon-dislike' : 'anticon anticon-dislike-o'} style={{ marginRight: 8 }} />
                        {this.state.opposeCount}
                    </span>
                    <em className="ant-list-item-action-split" />
                </li>
                <li onClick={this._handleExpend.bind(this)} >
                    <i className="anticon anticon-message" style={{ marginRight: 8 }} />
                </li >
                <li style={{ display: this.state.showReply }} >
                    <span>
                        <Search placeholder="请输入您的评论" value={this.state.value} onChange={this.onChange.bind(this)} enterButton="评论" onSearch={this._handleContentSubmit.bind(this)} />
                    </span>
                </li>
            </ul>
        )
    }
}

export default CommentInput;
