import React from 'react'
import '../styles/progressBar.styl'

export default class ProgressBar extends React.Component {
  constructor(props) {
    super(props)
    const {max, value} = this.props
    console.log('max:' + max)
    let percent = ((value >= 0 ? value : 0) / max) * 100
    this.state = {
      percent
    }
    this.setPosStart = this.setPosStart.bind(this)
    this.setPosByMove = this.setPosByMove.bind(this)
    this.setPosEnd = this.setPosEnd.bind(this)
  }
  
  clientLeft = 0
  
  componentDidMount() {
    this.bar.addEventListener('mousedown', this.setPosStart)
    this.bar.addEventListener('mousemove', this.setPosByMove)
    this.bar.addEventListener('mouseup', this.setPosEnd)
    
    this.bar.addEventListener('touchstart', this.setPosStart)
    this.bar.addEventListener('touchmove', this.setPosByMove)
    this.bar.addEventListener('touchend', this.setPosEnd)
    this.clientLeft = this.bar.querySelector('.curr').getBoundingClientRect().left
    console.log(this.clientLeft)
  }
  
  componentWillUnmount() {
    //兼容鼠标控制
    this.bar.removeEventListener('mousedown', this.setPosStart)
    this.bar.removeEventListener('mousemove', this.setPosByMove)
    this.bar.removeEventListener('mouseup', this.setPosEnd)
    
    this.bar.removeEventListener('touchstart', this.setPosStart)
    this.bar.removeEventListener('touchmove', this.setPosByMove)
    this.bar.removeEventListener('touchend', this.setPosEnd)
  }
  
  isTouched = false//是否正在触摸
  
  setPosStart(ev) {
    ev.preventDefault()
    this.isTouched = true
    if (ev.type === 'mousedown') {
      this.setCurrPos(ev.pageX - this.clientLeft)//去掉边框宽度
    } else {
      this.setCurrPos(ev.touches[0].pageX - this.clientLeft)//去掉边框宽度
    }
  }
  
  setPosEnd(ev) {
    ev.preventDefault()
    this.isTouched = false
    this.props.handleChange(this.props.max * this.state.percent / 100)
  }
  
  setPosByMove(ev) {
    ev.preventDefault()
    if (!this.isTouched) {
      return
    }
    if (ev.type === 'mousemove') {
      this.setCurrPos(ev.pageX - this.clientLeft)//去掉边框宽度
    } else {
      this.setCurrPos(ev.touches[0].pageX - this.clientLeft)
    }
  }
  
  
  //设置当前进度条位置
  setCurrPos(pos) {
    let percent = 0
    if (pos >= this.bar.clientWidth) {
      percent = 1
    } else if (pos < this.bar.clientWidth && pos > 0) {
      percent = pos / this.bar.clientWidth
    }
    this.setState({percent: percent * 100})
  }
  
  render() {
    let percent = this.state.percent
    if (!this.isTouched) {//不在触摸时才使用播放器的进度
      percent = this.props.value / this.props.max * 100
    }
    return (
      <div className='progress-bar'>
        <span className="time curr">{formatTime(this.props.value)}</span>
        <div className="bar" ref={node => this.bar = node}>
          <div className="curr" style={{width: percent + '%'}}>
            <div className="btn"/>
          </div>
        </div>
        <span className="time max">{formatTime(this.props.max)}</span>
      </div>
    );
  }
}

function formatTime(second) {
  second = Math.round(second)
  if (second < 0) {
    return '00:00'
  }
  let min = Math.floor(second / 60)
  if (min <= 0) {
    return '00:' + (second < 10 ? '0' + second : second)
  } else {
    let sec = second - min * 60
    return (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec)
  }
}