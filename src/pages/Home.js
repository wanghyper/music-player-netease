import React from 'react'
import SongList from '../components/ListSong'
import {connect} from "react-redux"

import {netease} from '../api'
import logo from '../assets/logo.svg'
import '../styles/home.styl'
import {setUserAction, setPlayListAction, pauseAction} from "../actions"
import ListSheets from "../components/ListSheets"

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nav: 0, //0推荐recommend 1排行榜rank 2我的歌单 my
      user: this.props.user,
      recommendSheets: [],
      newSongs: [],
      topList: [],
      mySheets: []
    }
  }
  
  async checkStatus() {
    try {
      let res = await netease.loginStatus()
      if (res.data.code === 200) {
        this.props.setUser(res.data.profile)
      } else {
        this.props.setUser(null)
      }
    } catch (e) {
      this.props.setUser(null)
    }
    
  }
  
  async getRecommend() {
    let res = await netease.getRecommendSongSheets()
    this.setState({
      recommendSheets: res.data.result
    })
  }
  
  async getNewSong() {
    let res = await netease.getRecommendNewSong()
    this.setState({
      newSongs: res.data.result
    })
    if(this.props.player.playList.length<1){//当前播放列表为空则添加最新歌曲列表
      this.props.setPlayList(res.data.result)
    }
  }
  
  async getTopList() {
    let res = await netease.getTopList()
    this.setState({
      topList: res.data.list
    })
  }
  
  async getMySheets() {
    if (!this.props.user.userId) {
      window.Toast.show('请先登录').autoHide(2000, ()=> this.props.history.push('/login'))
      return
    }
    let res = await netease.getSongListByUserId(this.props.user.userId)
    this.setState({
      mySheets: res.data.playlist
    })
  }
  
  setNav(index) {
    if (index !== this.state.nav) {
      this.setState({
        nav: index
      })
      if (index === 1 && this.state.topList.length < 1) {
        this.getTopList()
      } else if (index === 2 && this.state.mySheets.length < 1) {
        this.getMySheets()
      }
    }
  }
  
  scrollTop = 0
  
  async componentWillMount() {
    this.checkStatus()
    const status = JSON.parse(sessionStorage.getItem('home_status'))
    if (status) {
      sessionStorage.removeItem('home_status')
      this.setState({...status.state})
      if(this.state.nav===2){
        this.getMySheets()
      }
      this.scrollTop = status.scrollTop
    } else {
      this.getRecommend()
      this.getNewSong()
    }
  }
  
  componentDidMount() {
    console.log('set top ' + this.scrollTop)
    document.querySelector('main').scrollTop = this.scrollTop
  }
  
  componentWillUnmount() {
    sessionStorage.setItem('home_status',
      JSON.stringify({
        state: this.state,
        scrollTop: document.querySelector('main').scrollTop
      }))
  }
  
  render() {
    const user = this.props.user
    const header = (
      <header>
        <img className='logo' src={logo} alt=""/>
        {
          user.userId ? (
            <div className="user">
              <img src={user.avatarUrl} alt=""/>
              <span>{user.nickname}</span>
            </div>
          ) : (
            <div className="user bigger">
              <span onClick={() => {
                this.props.history.push('/login')
              }}>登录</span>
            </div>
          )
        }
      </header>
    )
    
    const footHeight = 80;
    return (
      <main style={{height: 'calc(100vh - ' + (footHeight) + 'px)'}}>
        <div className="home">
          {header}
          <nav>
            {['热门推荐', '热歌排行', '我的歌单'].map((item, index) => {
              return (
                <div onClick={() => this.setNav(index)} className={this.state.nav === index ? 'curr' : ''} key={index}>
                  <span>{item}</span>
                </div>
              )
            })}
          </nav>
          {this.Recommend()}
          {this.TopList()}
          {this.MySheets()}
        </div>
      </main>
    )
  }
  
  Recommend() {
    const sheets = this.state.recommendSheets.slice(0, 6)
    const recommendSheets = (
      <div className="recommend-sheets">
        {sheets.map(item => (
          <div className="sheets" key={item.id} onClick={() => {
            this.props.history.push('/songlist/' + item.id)
          }}>
            <img src={item.picUrl} alt=""/>
            <div>{item.name}</div>
          </div>
        ))}
      </div>
    )
    return (
      <div style={{display: this.state.nav !== 0 ? 'none' : 'block'}}>
        <h4>推荐歌单</h4>
        {recommendSheets}
        <h4>最新音乐</h4>
        <div className="newsong">
          <SongList list={this.state.newSongs}/>
        </div>
      </div>
    )
  }
  
  TopList() {
    
    return (
      <div style={{display: this.state.nav !== 1 ? 'none' : 'block'}}>
        <ListSheets sheets={this.state.topList}/>
      </div>
    )
  }
  
  MySheets() {
    return (
      <div style={{display: this.state.nav !== 2 ? 'none' : 'block'}}>
        <ListSheets sheets={this.state.mySheets}/>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    user: state.user,
    player: state.player
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setUser: (user) => {
      dispatch(setUserAction(user))
    },
    setPlayList(list){
      dispatch(setPlayListAction(list))
      dispatch(pauseAction())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)