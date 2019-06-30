import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {PostData} from '../../services/PostData';

class VerifyOtp extends Component {

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
    //   otpSent: false,
      otpVerified: false,
    //   updatePassword: false,
    //   isAuthorized: false,
    //   passwordUpdated: false
     };
 
    //  this.update = this.update.bind(this);
     this.onChange = this.onChange.bind(this);
    //  this.sendOtpFunction = this.sendOtpFunction.bind(this);
    //  this.isAuthorizedFunction = this.isAuthorizedFunction.bind(this);
    //  this.updatePassword = this.updatePassword.bind(this);
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

   
  verifyOtpFunction() {
    let state = {
    //   token: this.state.token,
      userCode: this.state.userCode,
      email: this.state.email,
      otp: this.state.otp
    }
   PostData('verifyOTP', state).then((result) => {
     let responseJson = result;
     if(responseJson.success) {         
      //  localStorage.setItem('token',JSON.stringify(responseJson.data.token));
       this.setState({otpSent: true});
      //  this.setState({token: responseJson.data.token});
       this.setState({otpVerified: true});
     }  
    });
  }


  render() {
    // if(!this.state.isAuthorized){
    //   return (<Redirect to={'/login'}/>)
    // }

    if(this.state.otpVerified) {
      return (<Redirect to={'/login'}/>)
    }

  
    return (
        <div className="row" id="Body">
          <div className="medium-5 columns left">
          <h4>Account Activation</h4>
          {!this.state.otpVerified && <input type="email" name="email"  placeholder="Email" onChange={this.onChange}/> }
          {!this.state.otpVerified && <input type="text" name="userCode"  placeholder="User Code" onChange={this.onChange}/> }          
          {!this.state.otpVerified && <input type="number" name="otp"  placeholder="OTP" onChange={this.onChange}/> }
          {/* {!this.state.otpVerified && <input type="text" name="userCode"  placeholder="User Code" onChange={this.onChange}/> }           */}
          {!this.state.otpVerified && <input type="submit" className="button success" value="Verify OTP" onClick={this.verifyOtpFunction}/> }
          
          {/* <a href="/signup">Registration</a> */}
          </div>
        </div>
      );
  }

}

export default VerifyOtp;