import React from 'react'
import PlayBtn from "../assets/play"
import PauseBtn from '../assets/pause'
import '../styles/listSong.styl'
import {setPlayListAction, playAction, pauseAction} from "../actions"
import {connect} from "react-redux"

class List extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {}
  }
  
  play(index) {
    const player = this.props.player
    const currSong = player.playList[player.index]
    if (currSong && (currSong.id === this.props.list[index].id)) {
      if (player.status === 'PAUSE') {
        this.props.play(index)
      } else {
        this.props.pause()
      }
    } else {
      this.props.setPlayList(this.props.list)
      this.props.play(index)
    }
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
  
  }
  
  render() {
    const {list, player} = this.props
    const currentIndex = list.findIndex(item =>
      item.id === (player.playList[player.index] && player.playList[player.index].id))
    const isPlaying = player.status === 'PLAYING'
    if (list.length < 1 && !this.props.loaded) {
      return <div className='ListSong tip'>Loading</div>;
    } else if (list.length < 1 && this.props.loaded) {
      return <div className='ListSong tip'>暂无内容</div>;
    }
    const artists = (item) => {
      const ar = item.ar || (item.song && item.song.artists)
      if (ar && ar.length >= 1) {
        return ar.map(val => val && val.name).join('/')
      } else {
        return ''
      }
    }
    const li = list.map(
      (item, index) => (
        <li className={index === currentIndex ? 'curr' : ''}
            onClick={() => {
              this.play(index)
            }} key={item.id}>
          <div className="left">
            <div className="name">
              <span>{item.name}</span>
              <span className='alia'>{item.alia && item.alia.length > 0 ? '(' + item.alia.join('/') + ')' : ''}</span>
            </div>
            <div className="sub">{artists(item)}</div>
          </div>
          <div className="right">
            {(index === currentIndex) && isPlaying ? <PauseBtn color='#4d4d4d'/> : <PlayBtn color='#4d4d4d'/>}
          </div>
        </li>
      )
    )
    return (
      <ul className='ListSong'>
        {li}
      </ul>
    )
  }
}

const mapStateToProps = (state) => ({
  player: state.player
})
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setPlayList(playList) {
      dispatch(setPlayListAction(playList))
    },
    //播放列表中第几首歌, 是否是同一个播放列表需在之前检验
    play(index) {
      dispatch(playAction(index))
    },
    pause() {
      dispatch(pauseAction())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(List)