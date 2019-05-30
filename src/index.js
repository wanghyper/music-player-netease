import React from 'react'
import ReactDom from 'react-dom'
import {HashRouter as Router, Route, Link} from 'react-router-dom'
import './styles/index.css'

import SongSheets from './pages/SongSheets';
import Home from './pages/Home';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: 32953014
    }
  }
  
  render() {
    return (
      <Router>
        <Link to={'/sheets/'+this.state.userId}>歌单</Link>
        <Route path='/' component={Home}/>
        <Route exact path="/sheets/:id" component={SongSheets}/>
      </Router>
    )
  }
}

ReactDom.render(<App/>,
  document.getElementById('root'))