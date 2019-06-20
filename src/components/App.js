import React from "react"
import {HashRouter as Router, Route} from 'react-router-dom'

import SongSheets from "../pages/SongSheets"
import SongList from "../pages/SongList"
import Home from '../pages/Home'
import Login from '../pages/Login'
import Header from '../components/Header'
import Player from '../components/Player'
import '../styles/index.styl'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      msg: ''
    }
  }
  
  componentWillMount() {
    window.Toast = {
      app: this,
      show(msg) {
        this.app.setState({msg})
        return this
      },
      autoHide(ms = 1000, fun) {
        setTimeout(() => {
          this.hide()
          if (typeof fun === 'function') {
            fun()
          }
        }, ms)
      },
      hide() {
        this.app.setState({msg: ''})
      }
    }
  }
  
  render() {
    return (
      <Router>
        <Route exact path='/' component={Home}/>
        <Route path='/:content' component={Main}/>
        <Route component={Player}/>
        
        <div className="toast" style={{display: this.state.msg === '' ? 'none' : ''}}>
          <span className='msg'>{this.state.msg}</span>
        </div>
      </Router>
    )
  }
}

function Main(props) {
  if (props.match.params.content === 'login') {
    return (
      <Route path='/login' component={Login}/>
    )
  }
  const headHeight = 40, footHeight = 80;
  return (
    <div>
      <Header/>
      <main style={{height: 'calc(100vh - ' + (headHeight + footHeight) + 'px)', marginTop: headHeight + 'px'}}>
        <Route path="/sheets/:id" component={SongSheets}/>
        <Route path='/songlist/:id' component={SongList}/>
      </main>
    </div>
  )
}

export default App