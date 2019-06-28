import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {PostData} from '../../services/PostData';
import './Login.css';
import VerifyOTP from '../VerifyOtp/VerifyOtp';

class Login extends Component {

  constructor(){
    super();
   
    this.state = {
     username: '',
     password: '',
     redirectToReferrer: false,
     forgotPassword: false,
     accountActivationPending: false,
     isAuthorized: false,
     token: '',
     checkDone: false
    };

    this.login = this.login.bind(this);
    this.onChange = this.onChange.bind(this);
    this.isAuthorizedFunction = this.isAuthorizedFunction.bind(this);

  }

  // On initialization
  componentWillMount() {
    this.isAuthorizedFunction();
    if(this.state.isAuthorized) {
      this.getUserFiles()
    }
   }

   // check for authorization
   isAuthorizedFunction() {
    let token = localStorage.getItem('token');
    let state = {
      token: token
    }

    PostData('verifyToken', state).then((result) => {
      let responseJson = result;
        if(responseJson.success) {         
          // this.setState({token: token});
          this.setState({isAuthorized: true})
          this.setState({checkDone: true})
        }
     });
   }


  login() {
    if(this.state.username && this.state.password){
      let state = {
        userCode: this.state.username,
        password: this.state.password
      }
      PostData('login', state).then((result) => {
       let responseJson = result;
       if (!responseJson.success && responseJson.redirectTo === 'verifyOtp') {
         this.setState({accountActivationPending: true});
       } else if (responseJson.token) { 
        // if(responseJson.userData.token) {        
         localStorage.setItem('token',JSON.stringify(responseJson.token));
         this.setState({redirectToReferrer: true});
       }
       
      });
    }
    
   }

  onChange(e){
    this.setState({[e.target.name]:e.target.value});
   }

   forgotPasswordFunction = () => {
     this.setState({forgotPassword: true});
   }

  render() {

    if(this.state.isAuthorized && this.state.checkDone) {
      return (<Redirect to={'home'} />)
    }

    if(this.state.accountActivationPending) {
      return (<Redirect to={'verifyOtp'} />)
    }

     if (this.state.redirectToReferrer && !this.state.accountActivationPending) {
      return (<Redirect to={'/home'}/>)
    }
   
    if(this.state.forgotPassword) {
      return (<Redirect to={'/forgotPassword'}/>)
    }

    if(!this.state.accountActivationPending) {
      return (
        <div className="row" id="Body">
          <div className="medium-5 columns left">
          <h4>Login</h4>
          {/* <label>Username</label> */}
          <input type="text" name="username" placeholder="User Code" onChange={this.onChange}/>
          {/* <label>Password</label> */}
          <input type="password" name="password"  placeholder="Password" onChange={this.onChange}/>
          <input type="submit" className="button success" value="Login" onClick={this.login}/>
          <a href="/signup">Registration</a>
          <button className='btn btn-danger'><a href="/forgotPassword" className="btnConfig" onClick={this.forgotPasswordFunction}>Forgot Password?</a></button>
          </div>
        </div>
      );
     } else {
       return ( <VerifyOTP userCode={ this.state.userCode} /> )
     }
  }
}

export default Login;