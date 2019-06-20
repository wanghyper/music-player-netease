import React from 'react'
import arrowLeft from "../assets/arrow-left.svg"

import {connect} from 'react-redux'
import '../styles/header.styl'

const Header = (props) => {
  const {header} = props
  const historyBack = () => {
    if (header.hasHistory) {
      window.history.back()
    }
  }
  return (
    <header className='header'>
      <img src={header.hasHistory ? arrowLeft : ''} alt="" onClick={historyBack}/>
      <span>{header.name}</span>
    </header>
  )
}
const mapStateToProps = (state, ownProps) => {
  return {
    header: state.header
  }
}
// const mapDispatchToProps = () => {}

const HeaderContainer = connect(
  mapStateToProps
)(Header)
export default HeaderContainer