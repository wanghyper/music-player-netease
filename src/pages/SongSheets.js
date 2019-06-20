import React from 'react';
import API from "../api";
import LazyLoad from 'react-lazyload';
import '../styles/songsheets.styl';
import RightSvg from '../assets/triangle-right'
import {setHeaderAction} from "../actions"
import {connect} from "react-redux"

class SongSheets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      userInfo: {},
      list: []
    }
    this.handleClick = this.handleClick.bind(this);
  }
  
  getUserInfo() {
    API.netease.getUserInfo(this.state.user.userId).then(res => {
      this.setState({
        userInfo: res.data
      })
    })
  }
  
  getList() {
    API.netease.getSongListByUserId(this.state.user.userId).then(res => {
      this.setState({
        list: res.data.playlist
      })
    })
  }
  
  handleClick(item) {
   this.props.history.push('/songlist/'+item.id)
  }
  componentWillMount() {
    this.props.setHeader({
      hasHistory: true,
      name: '歌单列表'
    })
    console.log(this.state)
    if(this.state.user.userId){
      this.getUserInfo();
      this.getList();
    }
  }
  
  render() {
    const sheets = this.state.list.map(item => {
      return (
        <div key={item.id} onClick={() => this.handleClick(item)} className='songsheets'>
          <LazyLoad height={60} overflow={true}>
            <img src={item.coverImgUrl} alt=""/>
          </LazyLoad>
          <div className='name'>
            <span className='title'>{item.name}</span>
            <div className='subtitle'>共{item.trackCount}首</div>
          </div>
          <div className="trail">
            <RightSvg/>
          </div>
        </div>
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
    <div style={{backgroundImage: 'url(' + profile.backgroundUrl + ')'}} className='user-info'>
      <img src={profile.avatarUrl} alt="" className='logo'/>
      <div className="nickname">
        <span>{profile.nickname}</span>
      </div>
    </div>
  )
}


const mapStateToProps = (state) => ({
  user: state.user
})
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setHeader: (header) => {
      dispatch(setHeaderAction(header))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SongSheets)