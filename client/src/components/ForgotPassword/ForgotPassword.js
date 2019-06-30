import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {PostData} from '../../services/PostData';

class ForgotPassword extends Component {

  constructor(props){
    super(props);
    this.state = {
      otp: null,
      userCode: '',
      newPassword: '',
      confirmPassword: '',
      redirectToReferrer: false,
      errorMessage: '',
      samePassword: false,
      isUpdated: false,
      token: '',
      email: '',
      otpSent: false,
      otpVerified: false,
      updatePassword: false,
      isAuthorized: false,
      passwordUpdated: false,
      back: false,
      errorMessageOtp: false
     };
 
    //  this.update = this.update.bind(this);
     this.onChange = this.onChange.bind(this);
     this.sendOtpFunction = this.sendOtpFunction.bind(this);
    //  this.isAuthorizedFunction = this.isAuthorizedFunction.bind(this);
     this.updatePassword = this.updatePassword.bind(this);
    this.verifyOtpFunction = this.verifyOtpFunction.bind(this);
  }
  // On initialization
  // componentWillMount() {
  //   // this.isAuthorizedFunction();
  //  }

   // check for authorization
  //  isAuthorizedFunction() {
  //   let token = localStorage.getItem('token');
  //   let state = {
  //     token: token
  //   }

  //   PostData('verifyToken', state).then((result) => {
  //     let responseJson = result;
  //       if(responseJson.data && responseJson.data.success) {         
  //         this.setState({token: token});
  //         this.setState({isAuthorized: true})
  //       }
  //    })
  //    .catch((err) => {
  //      console.log(err);
  //    })
  //  }

  onChange(event){
    this.setState({[event.target.name]:event.target.value});
   }
   
  checkPasswords = () => {
    if(this.state.newPassword !== '' && this.state.otpVerified && this.state.newPassword === this.state.confirmPassword) {
      this.updatePassword();
    } else {
      this.setState({samePassword: true});
      this.setState({errorMessage: "Passowrds don't match"}); 
    }
  }
   
  sendOtpFunction() {
    // let token = localStorage.getItem('token');
    // this.setState({token: token});
    let state = {
      userCode: this.state.userCode,
      email: this.state.email
    }
   PostData('generateOTP', state).then((result) => {
     let responseJson = result;
     if(responseJson.success) {         
      //  localStorage.setItem('token',JSON.stringify(responseJson.data.token));
       this.setState({otpSent: true});
    //    this.setState({token: token});
       this.setState({isUpdated: true});
     }
    });
  }
   
  verifyOtpFunction() {
    let state = {
      // token: this.state.token,
      userCode: this.state.userCode,
      email: this.state.email,
      otp: this.state.otp
    }
   PostData('verifyOTP', state).then((result) => {
     let responseJson = result;
     if(responseJson.success) {         
      this.setState({errorMessageOtp: false})

      //  localStorage.setItem('token',JSON.stringify(responseJson.data.token));
       this.setState({otpSent: true});
      //  this.setState({token: responseJson.data.token});
       this.setState({otpVerified: true});
     } else if(responseJson.success === false && responseJson.redirectTo === 'wrongotp') {
        this.setState({errorMessageOtp: true})
     }
    });
  }

  updatePassword() {
    let state = {
    //   token: this.state.token,
      userCode: this.state.userCode,
      password: this.state.newPassword
    }
   PostData('updatePassword', state).then((result) => {
     let responseJson = result;
     if(responseJson.success) {   
       localStorage.removeItem('token');  
       this.setState({passwordUpdated: true});    
      //  localStorage.setItem('token',JSON.stringify(responseJson.data.token));
      //  this.setState({otpSent: true});
      //  this.setState({token: responseJson.data.token});
      //  this.setState({isUpdated: true});
     }  
    });
  }

  goBack = () => {
    this.setState({back: true});
  }
  
  render() {
    // if(!this.state.isAuthorized){
    //   return (<Redirect to={'/login'}/>)
    // }

    if(this.state.back) {
      return (<Redirect to={'/login'}/>)
    }

    if(this.state.passwordUpdated) {
      return (<Redirect to={'/login'}/>)
    }

  
    return (
        <div className="row" id="Body">
          <div className="medium-5 columns left">
          <a href="" onClick={this.goBack} className="goBack">Go Back</a>

          <h4>Forgot Password</h4>

          {!this.state.otpVerified && <input type="email" name="email"  placeholder="Email" onChange={this.onChange}/> }
          {!this.state.otpVerified && <input type="text" name="userCode"  placeholder="User Code" onChange={this.onChange}/> }          
          {!this.state.otpVerified && !this.state.otpSent && <input type="submit" className="button success" value="Send OTP" onClick={this.sendOtpFunction}/> }
          
          {this.state.otpSent && !this.state.otpVerified && <input type="number" name="otp"  placeholder="OTP" onChange={this.onChange}/> }
          {this.state.otpSent && !this.state.otpVerified && <input type="submit" className="button success" value="Verify OTP" onClick={this.verifyOtpFunction}/> }
          {this.state.errorMessageOtp && <span className='errorMessage' style={{color: 'red', fontStyle:'italic', float: 'right', fontWeight: 700}}>* Wrong OTP entered</span>}          

          {this.state.otpSent && this.state.otpVerified && <input type="password" name="newPassword"  placeholder="New Password" onChange={this.onChange}/>}
          {this.state.otpSent && this.state.otpVerified && <input type="password" name="confirmPassword"  placeholder="Re-enter Password" onChange={this.onChange}/>}
          {this.state.otpSent && this.state.otpVerified && this.state.samePassword && <span style={{color: 'red', fontStyle:'italic', float: 'right', fontWeight: 700}}>{this.state.errorMessage}</span> } 
          {this.state.otpSent && this.state.otpVerified && <input type="submit" className="button success" value="Update" onClick={this.checkPasswords}/>}
          {/* <a href="/signup">Registration</a> */}
          </div>
        </div>
      );
  }

}

export default ForgotPassword;