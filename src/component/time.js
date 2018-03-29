import React, { Component } from 'react';





class ShowTime extends Component {

  // constructor(props) { super(props); }

  componentDidMount = () => { }

  timeText() {
    var sendTime = new Date(this.props.time);
    var nowTime = (new Date()).valueOf();
    //差值
    var date3 = nowTime - sendTime;
    //天
    var days = Math.floor(date3 / (24 * 3600 * 1000))
    //时
    var leave1 = date3 % (24 * 3600 * 1000)
    var hours = Math.floor(leave1 / (3600 * 1000))
    //分
    var leave2 = leave1 % (3600 * 1000)
    var minutes = Math.floor(leave2 / (60 * 1000))
    //秒
    var leave3 = leave2 % (60 * 1000)
    var seconds = Math.round(leave3 / 1000)
    var disAndTimeText;
    var myText;
    if (days > 0) {
      myText = days + '天前'
      disAndTimeText = <a >{myText}</a>
    }

    if (days === 0 && hours > 0) {
      myText = hours + '小时前'
      disAndTimeText = <a >{myText}</a>
    }

    if (days === 0 && hours === 0 && minutes > 0) {
      myText = minutes + '分钟前'
      disAndTimeText = <a >{myText}</a>
    }
    if (days === 0 && hours === 0 && minutes === 0 && seconds >= 0) {
      myText = '刚刚'
      disAndTimeText = <a>{myText}</a>
    }
    return disAndTimeText;
  }

  render() {
    const text = this.timeText();
    return <a style={{marginLeft:'10px'}}>
      {text}
    </a>
  }
}
export default ShowTime;