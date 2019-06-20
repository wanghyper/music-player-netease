import React from 'react'
import API from '../api'
// import LazyLoad from 'react-lazyload';
import SongList from '../components/ListSong'

import '../styles/songlist.styl'
import {setHeaderAction} from "../actions"
import {connect} from "react-redux"
import Loading from "../assets/loading"

class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listId: this.props.match.params.id,
      listInfo: {},
      currentIndex: 0,
      loaded: false
    }
  }
  
  getList() {
    API.netease.getListDetailById(this.state.listId).then(res => {
      this.setState({
        listInfo: res.data.playlist,
        loaded: true
      })
    })
  }
 
  
  componentWillMount() {
    this.props.setHeader({
      hasHistory: true,
      name: '歌单'
    })
    this.getList()
  }
  
  render() {
    const info = this.state.listInfo;
    if (!info.tracks) {
      return <div className='songlist'>
        <div className="loading">
          <Loading color={'#000'}/>
        </div>
      </div>;
    }
    return (
      <div className="songlist">
        <div className="cover">
          <div className="bg" style={{backgroundImage: 'url("' + info.creator.backgroundUrl + '")'}}/>
          <img src={info.coverImgUrl} alt="" className='poster'/>
          <div className="user">
            <div className="title">{info.name}</div>
            <img src={info.creator.avatarUrl} alt="" className='avatar'/>
            <span className='nickname'>{info.creator.nickname}</span>
          </div>
        </div>
        <SongList list={this.state.listInfo.tracks} loaded={this.state.loaded}/>
      </div>
    )
  }
}


const mapStateToProps = () => ({})
const mapDispatchToProps = (dispatch, ownProps) =>{
  return {
    setHeader: (header) => {
      dispatch(setHeaderAction(header))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(List)