import React, { Component } from 'react';
import '../App.css';
import {  Row, Col, List } from 'antd';
import ShowTime from './time'
import CommentInput from './CommentInput'
import axios from 'axios';

class reply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadMore: false,
      showLoadingMore: true,
      targetSubType: '2',
      data: [],
      commentId: '',
      showList: 'none',
      showReply: 'none',
      replyCount: 0,
      pageNum: 1,
      pageSize: 5,
      total:0,
      replyTotal:0,
    }
  }

  //获取回复列表    
  queryReplys () {
    var params = new URLSearchParams();
    params.append("commentId", this.state.commentId);
    params.append("userId", this.state.userId);
    params.append("token", this.state.token);
    params.append("pageNum", this.state.pageNum);
    params.append("pageSize", this.state.pageSize);
    axios.post('/replyInfo/queryReplyInfoList', params)
      .then(res => {
        if(res.data.data)
        this.setState({
          data: res.data.data.list,
          total:res.data.data.total,
          loading: false
        });
      },()=>{});
  }


  _showReply(event) {
    if (this.state.showReply === 'none')
      this.setState({ showReply: 'block' });
    else this.setState({ showReply: 'none' });
  }

  componentDidMount = () => {
    this.setState({
      token: this.props.token,
      userId: this.props.userId,
      commentId: this.props.id,
      data: !this.props.replyInfos ? [] : this.props.replyInfos,
      showList: !this.props.replyInfos ? 'none' : 'block',
      total:!this.props.replyCount? 0:this.props.replyCount,
      replyTotal:!this.props.replyCount? 0:this.props.replyCount,
    })
  }


  componentWillReceiveProps(nextProps) {
    if(nextProps===this.props){
    this.setState({
      token: nextProps.token,
      userId: nextProps.userId,
      commentId: nextProps.id,
      data: !nextProps.replyInfos ? [] : nextProps.replyInfos,
      showList: !nextProps.replyInfos ? 'none' : 'block',
      replyTotal:!this.props.replyCount? 0:this.props.replyCount,
    },()=>(
      this.queryReplys((res)=>{})
    ))}
}


  render() {
    var me = this;

    const  pagination ={
      pageSize: this.state.pageSize,
      current: this.state.pageNum,
      total: this.state.total,
      onChange: ((res1) => { 
          this.setState({pageNum: res1 },()=>{this.queryReplys((res2)=>{}) })
      }),
    };


    return (
      <div>{this.props.context}</div>
    );

    
    return (
      <div className='reply-background detail-comment-left' >
        <a className="shrink" onClick={this._showReply.bind(me)}>
          {this.state.showReply === 'none' ? '展开'+this.state.replyTotal+'条回复' : '收起'+this.state.replyTotal+'条回复'}
        </a>
        <div style={{ display: this.state.showReply }} >
          <Row style={{ width: '100%'}} >
            <Col >
              <List
                itemLayout="vertical"
                size="small"
                split={false}
                // loadMore={loadMore}
                pagination={pagination}
                dataSource={this.state.data}
                renderItem={item => ((
                  <List.Item
                    key={item.title}
                  >
                    <List.Item.Meta
                      title={
                        <ul className="ant-list-item-action " >
                          <span className="ant-avatar ant-avatar-circle ant-avatar-image">
                           <img src={item.userHeadPortrait} alt="" /></span>
                          <li><a>{item.userNickName}</a></li>
                          <li>@{item.toReplyUid}</li>
                          <li><ShowTime time={item.createTime} /></li>
                          <li>{item.content}</li>
                          <li> 
                            <CommentInput
                              item={item}
                              token={this.state.token}
                              query={this.queryReplys.bind(this)}

                              userId={this.state.userId}
                              appId={this.state.appId}
                              topicId={this.state.topicId}
                              targetSubType={2}
                              topicType={this.state.topicType}
                              targetId={this.props.id}
                              oprId={item.id}
                              type={1}
                          />
                        </li>
                        </ul>}
                    />
                  </List.Item>
                ))}
              />
            </Col>
          </Row>
        </div>
      </div>);
  }
}
export default reply;