import React from 'react'

import {connect} from "react-redux"
import {setUserAction} from "../actions"
import {netease} from '../api'
import '../styles/login.styl'
import logo from '../assets/logo.svg'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tip: '',
      loginType: 1, //1手机号, 2邮箱
      account: '17185381218',
      accountTip: '',
      password: '1708911WAwa',
      pwTip: ''
    }
    this.setAccount = this.setAccount.bind(this)
    this.setPassword = this.setPassword.bind(this)
    this.submit = this.submit.bind(this)
  }
  
  setAccount(e) {
    this.setState({
      accountTip: '',
      account: e.target.value
    })
  }
  
  setPassword(e) {
    this.setState({
      pwTip: '',
      password: e.target.value
    })
  }
  
  submit() {
    const state = this.state
    let error = false
    if (!state.account) {
      this.setState({accountTip: '账号不能为空'})
      error = true
    } else if (
      state.loginType === 1 &&
      (state.account.length < 11 || !/1[3-8]\d{9}/.test(state.account))
    ) {
      this.setState({accountTip: '手机号输入有误'})
      error = true
    } else if (
      state.loginType === 2 &&
      (state.account.length < 11
        || !/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,8}$ /.test(state.account))
    ) {
      this.setState({accountTip: '邮箱输入有误'})
      error = true
    }
    if (!state.password) {
      this.setState({pwTip: '请输入密码'})
      error = true
    }
    if(!error){
      netease.login(
        state.account,
        state.password,
        state.loginType
      ).then(res => {
        this.props.setUser(res.data.profile)
        this.props.history.replace('/')
      },(error) => {
        this.setState({
          pwTip: '用户名或密码错误'
        })
      })
    }
  }
  
  render() {
    return (
      <div className='login'>
        <div className="title">
          <img src={logo} alt=""/>
        </div>
        
       <div className='wrapper'>
         <div className="login-type">
           <div
             onClick={() => this.setState({loginType: 1})}
             className={this.state.loginType===1?'curr':''}>手机号登录</div>
           <div
             onClick={() => this.setState({loginType:2})}
             className={this.state.loginType===2?'curr':''}>网易邮箱登录</div>
         </div>
         <div className='panel'>
           <input type={this.state.loginType === 1 ? "number" : "email"}
                  maxLength={11}
                  onInput={this.setAccount}
                  placeholder={this.state.loginType === 1 ? '请输入手机号' : '请输入邮箱'}/>
           <div className="tip">
             {this.state.accountTip}
           </div>
           <input type="password"
                  onInput={this.setPassword}
                  placeholder="请输入密码"/>
           <div className="tip">
             {this.state.pwTip}
           </div>
           <button onClick={this.submit}>登陆</button>
         </div>
       </div>
      </div>
    
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}
const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => {
      dispatch(setUserAction(user))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)