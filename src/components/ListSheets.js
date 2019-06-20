import React from 'react'
import LazyLoad from "react-lazyload"
import RightSvg from "../assets/triangle-right"
import '../styles/listSheets.styl'
import {NavLink} from "react-router-dom"
import Loading from "../assets/loading"

class ListSheets extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  
  render() {
    if (!this.props.sheets || this.props.sheets.length < 1) {
      return (
        <div className="loading">
          <Loading color={'#000'}/>
        </div>
      )
    }
    return (
      <div className="listSheets">
        {this.props.sheets.map(item => {
          return (
            <NavLink key={item.id} to={'/songlist/' + item.id} className='songsheets'>
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
            </NavLink>
          )
        })}
      </div>
    )
  }
}

export default ListSheets