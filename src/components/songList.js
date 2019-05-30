import React from 'react'
import API from '../api'
import '../styles/songlist.css'

class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      sublist: [],
      currentIndex: 0
    }
  }
  
  getList() {
    API.netease.getSongListByUserId(this.props.userId).then(res => {
      this.setState({
        list: res.data.playlist
      })
    })
  }
  
  componentDidMount() {
    this.getList()
  }
  render() {
    return (
      <div className="songlist">
        <SongList list={this.state.list} handleClick={(id) => this.props.handleClick(id)}/>
      </div>
    )
  }
}
function SongList(props){
  let list = props.list;
  let songs = list.map(
    (item, index) =>
      <li key={item.id}
          onClick={()=> props.handleClick(item.id)}>
        {item.name}
      </li>)
  return (<ul>
    {songs}
  </ul>)
}

export default List