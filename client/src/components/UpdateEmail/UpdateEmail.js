import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {PostData} from '../../services/PostData';
import Linkify from 'react-linkify';
// import './Update.css';
import TimeAgo from 'react-timeago';
class UpdateEmail extends Component {

  constructor(props){
    super(props);
    this.state = {
    //   otp: null,
    //   userCode: '',
    //   newPassword: '',
    //   confirmPassword: '',
    //   redirectToReferrer: false,
    //   errorMessage: '',
    //   samePassword: false,
    //   isUpdated: false,
      token: '',
      email: '',
      otpSent: false,
    //   otpVerified: false,
    //   updatePassword: false,
      isAuthorized: false,
      checkDone: false
    //   passwordUpdated: false
     };
 
    //  this.update = this.update.bind(this);
     this.onChange = this.onChange.bind(this);
     this.sendOtpFunction = this.sendOtpFunction.bind(this);
    //  this.isAuthorizedFunction = this.isAuthorizedFunction.bind(this);
    //  this.updatePassword = this.updatePassword.bind(this);
    // this.verifyOtpFunction = this.verifyOtpFunction.bind(this);
  }

//   On initialization
  componentWillMount() {
    // this.isAuthorizedFunction();
   }

//    check for authorization
   isAuthorizedFunction() {
    let token = localStorage.getItem('token');
    let state = {
      token: token
    }

    PostData('verifyToken', state).then((result) => {
      let responseJson = result;
        if(responseJson.data && responseJson.data.success) {         
          this.setState({token: token});
          this.setState({isAuthorized: true})
          this.setState({checkDone: true})
        }
     })
     .catch((err) => {
       console.log(err);
     })
   }

  onChange(event){
    this.setState({[event.target.name]:event.target.value});
   }
   
//   checkPasswords = () => {
//     if(this.state.newPassword !== '' && this.state.otpVerified && this.state.newPassword === this.state.confirmPassword) {
//       this.updatePassword();
//     } else {
//       this.setState({samePassword: true});
//       this.setState({errorMessage: "Passowrds don't match"}); 
//     }
//   }
   
  sendOtpFunction() {
    let token = localStorage.getItem('token');
    this.setState({token: token});
    let state = {
    //   userCode: this.state.userCode,
      email: this.state.email
    }
   PostData('generateOTP', state).then((result) => {
     let responseJson = result;
     if(responseJson.success) {         
      //  localStorage.setItem('token',JSON.stringify(responseJson.data.token));
       this.setState({otpSent: true});
    //    this.setState({token: token});
    //    this.setState({isUpdated: true});
     }
    });
  }
   
//   verifyOtpFunction() {
//     let state = {
//       token: this.state.token,
//     //   userCode: this.state.userCode,
//       email: this.state.email,
//       otp: this.state.otp
//     }
//    PostData('verifyOTP', state).then((result) => {
//      let responseJson = result;
//      if(responseJson.success) {         
//       //  localStorage.setItem('token',JSON.stringify(responseJson.data.token));
//        this.setState({otpSent: true});
//       //  this.setState({token: responseJson.data.token});
//        this.setState({otpVerified: true});
//      }  
//     });
//   }

//   updatePassword() {
//     let state = {
//       token: this.state.token,
//     //   userCode: this.state.userCode,
//       password: this.state.newPassword
//     }
//    PostData('updatePassword', state).then((result) => {
//      let responseJson = result;
//      if(responseJson.success) {   
//        localStorage.removeItem('token');  
//        this.setState({passwordUpdated: true});    
//       //  localStorage.setItem('token',JSON.stringify(responseJson.data.token));
//       //  this.setState({otpSent: true});
//       //  this.setState({token: responseJson.data.token});
//       //  this.setState({isUpdated: true});
//      }  
//     });
//   }

  render() {
    if(!this.state.isAuthorized && this.state.checkDone){
      return (<Redirect to={'/login'}/>)
    }

    if(this.state.otpSent) {
      return (<Redirect to={'/login'}/>)
    }

  
    return (
        <div className="row" id="Body">
          <div className="medium-5 columns left">
          <h4>Update Password</h4>

          {!this.state.otpSent && <input type="email" name="email"  placeholder="New Email" onChange={this.onChange}/> }
          {/* {!this.state.otpVerified && <input type="text" name="userCode"  placeholder="User Code" onChange={this.onChange}/> }           */}
          {!this.state.otpSent && <input type="submit" className="button success" value="Send OTP" onClick={this.sendOtpFunction}/> }
          
          {/* <a href="/signup">Registration</a> */}
          </div>
        </div>
      );
  }

}

export default UpdateEmail;