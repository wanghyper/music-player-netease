import React from 'react'
import {connect} from 'react-redux'
import {netease} from '../api'
import '../styles/player.styl'
import {pauseAction, playAction, playLastAction, playNextAction, stopAction} from "../actions"
import BackwardBtn from '../assets/backward'
import ForwardBtn from '../assets/forward'
import PauseBtn from '../assets/pause'
import PlayBtn from '../assets/play'
import ListIcon from '../assets/listIcon'
import TriangleRightIcon from '../assets/triangle-right'
import ProgressBar from '../components/ProgressBar'
import ListSong from '../components/ListSong'

class Player extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cyclicMode: 0,//播放模式 0循环播放 1随机播放 2单曲循环
      isFullScreen: false,
      isFullHide: true,
      showList: false, //显示播放列表
      pos: -1,//当前播放的时间点
      audioLength: 0,
      song: {
        al: {}
      },
      lyric: {
        id: '',
        contents: []
      },
      noLyric: false
    }
    //定时器对象
    this.timer = {
      id: null,
      callbacks: [this.checkPos.bind(this)],
      step() {
        this.id = setTimeout(() => {
          this.callbacks.forEach(cb => cb())
          this.step()
        }, 200)
      },
      start() {
        this.stop()
        this.step()
      },
      stop() {
        clearTimeout(this.id)
      }
      
    }
  }
  
  async getSrc() {
    const state = this.props.player
    if (!state.playList[state.index]) {
      return
    }
    const id = state.playList[state.index].id
    let res = await netease.getPlayUrlById(id)
    this.audio.ondurationchange = () => {
      if (!this.audio) {//页面恰巧销毁
        return
      }
      this.setState({audioLength: this.audio.duration})
    }
    if (!res.data.data[0].url) {
      window.Toast.show('未获取到播放地址').autoHide(3000)
    } else {
      this.audio.src = res.data.data[0].url
    }
    netease.getSongDetailById(id).then(res => {
      this.setState({song: res.data.songs[0]})
    })
  }
  
  async getLyric() {
    const state = this.props.player
    if (!state.playList[state.index]) {
      return
    }
    const id = state.playList[state.index].id
    if (this.state.lyric.id === id) {
      setTimeout(() => this.syncLyricPos(this.state.pos))
      return
    }
    let res = await netease.getLyric(id)
    if (res.data.nolyric) {
      this.setState({noLyric: true})
      return
    }
    this.setState({
      lyric: {
        id,
        contents: this.parseLyric(res.data)
      }
    })
  }
  
  parseLyric(lyric) {
    try {
      lyric = lyric.lrc.lyric
      // eslint-disable-next-line
      lyric = lyric.replace(/^[^\[]*/, '')//清理前部非歌词部分
      // eslint-disable-next-line
      lyric = lyric.replace(/\]\[/g, '] [')//时间段内无歌词时添加空格,便于后续正则匹配
      // eslint-disable-next-line
      let arr = lyric.match(/[^\]\[]+/g)
      let larr = []
      for (let i = 0; i < arr.length; i += 2) {
        let t = arr[i]
        t = t.split(':')
        let time = t[0] * 60 + Number(t[1])
        time = isNaN(time) ? -1 : time
        larr.push({
          time: time,
          text: arr[i + 1]
        })
      }
      this.setState({noLyric: false})
      return larr
    } catch (e) {
      this.setState({noLyric: true})
      console.log('歌词解析失败')
      return []
    }
  }
  
  lastTargetIndex = 0//上次歌词所做位置
  
  checkPos() {
    this.setState({pos: this.audio.currentTime})
    let lyrics = this.state.lyric.contents
    if (lyrics.length < 1 || !this.state.isFullScreen) {
      return
    }
    let next = lyrics[this.lastTargetIndex + 1]
    if (next && this.state.pos > next.time) {
      console.log('curr: ' + this.lastTargetIndex)
      let curr = this.content.querySelector('div.curr')
      curr && curr.classList.remove('curr')
      this.lastTargetIndex++
      let dom = this.content.querySelector('div[data-time="' + next.time + '"]')
      dom.classList.add('curr')
      this.content.firstElementChild.style.top = -dom.offsetTop + 'px'
    }
  }
  
  //同步当前播放位置与歌词位置
  syncLyricPos(pos) {
    let lyrics = this.state.lyric.contents
    if (this.state.noLyric) {
      return
    }
    let curr = this.content && this.content.querySelector('div.curr')
    curr && curr.classList.remove('curr')
    for (let i = 0; i < lyrics.length; i++) {
      if (pos < lyrics[i].time) {
        this.lastTargetIndex = i - 1
        console.log('sync: ' + this.lastTargetIndex)
        break
      }
    }
    let dom = this.content.querySelector('div[data-time="' + lyrics[this.lastTargetIndex].time + '"]')
    dom.classList.add('curr')
    this.content.firstElementChild.style.top = -dom.offsetTop + 'px'
  }
  
  reset() {
    this.timer.stop()
    this.setState({pos: 0})//当前播放的时间点
    this.lastTargetIndex = 0//上次歌词所做位置
    if (this.content && this.content.firstElementChild) {
      this.content.firstElementChild.style.top = 0
      let curr = this.content.querySelector('div.curr')
      curr && curr.classList.remove('curr')
    }
  }
  
  playLast() {
    this.reset()
    this.props.playLast(this.state.cyclicMode)
  }
  
  playNext() {
    this.reset()
    this.props.playNext(this.state.cyclicMode)
  }
  
  play() {
    this.timer.start()
    this.audio.play()
  }
  
  pause() {
    this.timer.stop()
    this.audio.pause()
  }
  
  seek(pos) {
    console.log('seek: ' + pos)
    this.timer.stop()
    this.syncLyricPos(pos)
    this.audio.currentTime = pos
    this.timer.start()
  }
  
  changeCyclicMode() {
    let mode = this.state.cyclicMode + 1
    if (mode > 2) {
      mode = 0
    }
    this.setState({
      cyclicMode: mode
    })
  }
  
  setFullScreen(is) {
    if (is) {//设置显示全屏
      this.getLyric()
      this.setState({
        isFullScreen: is,
        isFullHide: is
      })
      setTimeout(() => {
        this.setState({
          isFullHide: false
        })
      },300)
    } else {
      this.setState({
        isFullHide: true
      })
      setTimeout(() => {
        this.setState({
          isFullScreen: is
        })
      }, 300)
    }
    
  }
  
  componentDidMount() {
    if (this.props.location.pathname === '/login') {
      return null
    }
    this.getSrc()
    this.audio.onended = () => {
      if (this.state.roundType === 2) {
        setTimeout(() => {
          this.play()
        }, 100)
      } else {
        this.playNext()
      }
    }
    this.audio.onpause = () => {
      this.pause()
    }
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    const state = this.props.player
    if (prevProps.player.index !== state.index
      || prevProps.player.playList !== state.playList) {//切换歌曲或更新列表
      this.getLyric()
      this.getSrc().then(() => {
        if (state.status === 'PAUSE') {
          this.pause()
        } else if (state.status === 'PLAYING') {
          this.play()
        }
      })
    } else {
      if (prevProps.player.status !== state.status) {
        if (state.status === 'PAUSE') {
          this.pause()
        } else if (state.status === 'PLAYING') {
          this.play()
        }
      }
    }
    
    
  }
  
  render() {
    if (this.props.location.pathname === '/login') {
      return null
    }
    return (
      <div className="player">
        {this.state.isFullScreen ? this.FullPlayer() : this.MiniPlayer()}
        {this.PlayList()}
        <audio src='' ref={audio => this.audio = audio}>浏览器版本太低，不支持audio标签</audio>
      </div>
    )
  }
  
  MiniPlayer() {
    return (
      <div className="mini">
        <div className="poster" onClick={() => this.setFullScreen(true)}>
          <img src={this.state.song.al.picUrl} alt=""/>
        </div>
        
        <div className="song">
          <div className="info">
            <span>{this.state.song.name}</span>
          </div>
          <div className="buttons">
            <div onClick={() => this.playLast()}>
              <BackwardBtn color='#ffffff'/>
            </div>
            <div onClick={() => {
              if (this.audio.src) {
                this.props.pauseOrPlay(this.props.player.status)
              }
            }
            }>
              {this.props.player.status === 'PLAYING' ?
                <PauseBtn color='#ffffff'/> : <PlayBtn color='#ffffff'/>}
            </div>
            <div onClick={() => this.playNext()}>
              <ForwardBtn color='#ffffff'/>
            </div>
          </div>
        </div>
        <div className="list-icon" onClick={() => this.setState({showList: true})}>
          <ListIcon color='#fff'/>
        </div>
      </div>
    )
  }
  
  FullPlayer() {
    return (
      <div className='full' style={{height: this.state.isFullHide ? '80px' : '100%'}}>
        <div className="top">
          <div className="wrapper">
            <div className="close" onClick={() => this.setFullScreen(false)}>
              <TriangleRightIcon color='#fff'/>
            </div>
            <div className="name">
              <span>{this.state.song.name}</span>
            </div>
            <div className="close"/>
          </div>
        </div>
        
        <div className="content" ref={node => {
          this.content = node
        }}>
          {this.state.noLyric ? '暂无歌词' : ''}
          <div className="lyric">
            {this.state.lyric.contents
              .map((item, index) =>
                (
                  <div key={index} data-time={item.time}>
                    {item.text}
                  </div>
                )
              )
            }
          </div>
        </div>
        
        <div className="bottom">
          <div className="progress">
            <ProgressBar
              max={this.state.audioLength}
              handleChange={(value) => this.seek(value)}
              value={this.state.pos}/>
          </div>
          
          <div className="buttons">
            <div className="mode" onClick={() => this.changeCyclicMode()}>
              {['循环', '随机', '单曲'][this.state.cyclicMode]}
            </div>
            
            <div className="btn">
              <div onClick={() => this.playLast()}>
                <BackwardBtn color='#ffffff'/>
              </div>
              <div className='playBtn'
                   onClick={() => this.props.pauseOrPlay(this.props.player.status)}>
                {this.props.player.status === 'PLAYING' ?
                  <PauseBtn color='#ffffff'/> : <PlayBtn color='#ffffff'/>}
              </div>
              <div onClick={() => this.playNext()}>
                <ForwardBtn color='#ffffff'/>
              </div>
            </div>
  
            <div className="list-icon" onClick={() => this.setState({showList: true})}>
              <ListIcon color='#fff'/>
            </div>
          </div>
          <div className="extra">
            {/*<div className="favor">喜欢</div>*/}
          </div>
        </div>
      </div>
    )
  }
  
  PlayList() {
    let playList = this.props.player.playList
    return (
      <div className="playList" style={{display: this.state.showList ? null : 'none'}}>
        <div className='title'>歌曲列表</div>
        <div className='songs'>
          <ListSong list={playList}/>
        </div>
        <div className="close">
          <span onClick={() => this.setState({showList: false})}>关闭</span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    player: state.player
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    playLast(cyclicMode) {
      dispatch(playLastAction(cyclicMode))
    },
    playNext(cyclicMode) {
      dispatch(playNextAction(cyclicMode))
    },
    pauseOrPlay(status) {
      if (status === 'PLAYING') {
        dispatch(pauseAction())
      } else {
        dispatch(playAction())
      }
    },
    stop() {
      dispatch(stopAction())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Player)