import React from 'react';
import API from "../api"
import '../styles/songsheets.styl'


class SongSheets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.match.params.id,
      userInfo: {},
      list: []
    }
  }
  
  getUserInfo() {
    API.netease.getUserInfo(this.state.userId).then(res => {
      this.setState({
        userInfo: res.data
      })
    })
  }
  
  getList() {
    API.netease.getSongListByUserId(this.state.userId).then(res => {
      this.setState({
        list: res.data.playlist
      })
    })
  }
  
  showSubList(id) {
    API.netease.getListDetailById(id).then(res => {
      this.setState({
        sublist: res.data.playlist
      })
    })
  }
  
  componentDidMount() {
    this.getUserInfo();
    this.getList();
  }
  
  render() {
    const sheets = this.state.list.map(item => {
      return (
        <div key={item.id}>
          <img src={item.coverImgUrl} alt=""/>
          {item.name}</div>
      )
    })
    return (
      <div className='songsheets'>
        <UserInfo info={this.state.userInfo}/>
        <div className="sheets">
          {sheets}
        </div>
      </div>
    
    )
  }
}

function UserInfo(props) {
  const info = props.info;
  let profile = info.profile || {};
  return (
    <div style={{background: 'url(' + profile.backgroundUrl + ')'}} className='user-info'>
      <img src={profile.avatarUrl} alt="" className='logo'/>
      <div className="nickname">
        <span>{profile.nickname}</span>
      </div>
    </div>
  )
}


export default SongSheets