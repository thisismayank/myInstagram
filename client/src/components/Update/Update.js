import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {PostData} from '../../services/PostData';

import './Update.css';

class Update extends Component {

  constructor(props){
    super(props);
    this.state = {
      // otp: null,
      // newPassword: '',
      // confirmPassword: '',
      // redirectToReferrer: false,
      // errorMessage: '',
      // samePassword: false,
      // isUpdated: false,
      // token: '',
      // email: '',
      // otpSent: false,
      // otpVerified: false,
      updatePassword: false,
      updateEmail: false,
      isAuthorized: false,
      checkDone: false,
      back: false
     };
 
    //  this.update = this.update.bind(this);
    //  this.onChange = this.onChange.bind(this);
    //  this.sendOtpFunction = this.sendOtpFunction.bind(this);
     this.isAuthorizedFunction = this.isAuthorizedFunction.bind(this);
     this.updatePasswordFunction = this.updatePasswordFunction.bind(this);
    this.updateEmailFunction = this.updateEmailFunction.bind(this);
  }
  // On initialization
  componentWillMount() {
    this.isAuthorizedFunction();
   }

  //  check for authorization
   isAuthorizedFunction() {
    let token = localStorage.getItem('token');
    let state = {
      token: token
    }

    PostData('verifyToken', state).then((result) => {
      let responseJson = result;
        if(responseJson.success) {         
          this.setState({token: token});
          this.setState({isAuthorized: true})
          this.setState({checkDone: true})

        }
     })
     .catch((err) => {
       console.log(err);
     })
   }

  updateEmailFunction = () => {
    this.setState({updateEmail: true})
  }
  updatePasswordFunction = () => {
    this.setState({updatePassword: true});
  }

  goBack = () => {
    this.setState({back: true});
  }

  render() {
    // if(this.state.checkDone) {
    if(!this.state.isAuthorized && this.state.checkDone) {
      return (<Redirect to={'/login'}/>)
    }

    if(this.state.updateEmail) {
      return (<Redirect to={'/updateEmail'}/>)
    }
    if(this.state.updatePassword) {
      return (<Redirect to={'/updatePassword'}/>)
    }

    if(this.state.back) {
      return (<Redirect to={'/login'}/>)
    }
    
    return (
      <div className="row " id="Body">
        <div className="medium-12 columns">
        <a href="" onClick={this.goBack} className="goBack">Go Back</a>

          <a href="" className="button btnConfig" onClick={this.updateEmailFunction}>Update Email</a>
          <a href="" className="button success btnConfig" onClick={this.updatePasswordFunction}>Update Passowrd</a>
          <h1></h1>
        </div>
        {/* <div className="images">
          <WelcomeFeed feedData = {this.state.data} name={this.state.name}/>
        </div> */}
      </div>
        // <div className="row" id="Body">
        //   <div className="medium-5 columns left">
        //   <h4>Update</h4>


        //   {!this.state.otpVerified && <input type="email" name="email"  placeholder="Email" onChange={this.onChange}/> }
        //   {!this.state.otpVerified && !this.state.otpSent && <input type="submit" className="button success" value="Send OTP" onClick={this.sendOtpFunction}/> }
          
        //   {this.state.otpSent && !this.state.otpVerified && <input type="number" name="otp"  placeholder="OTP" onChange={this.onChange}/> }
        //   {this.state.otpSent && !this.state.otpVerified && <input type="submit" className="button success" value="Verify OTP" onClick={this.verifyOtpFunction}/> }
          
        //   {this.state.otpSent && this.state.otpVerified && <input type="password" name="newPassword"  placeholder="New Password" onChange={this.onChange}/>}
        //   {this.state.otpSent && this.state.otpVerified && <input type="password" name="confirmPassword"  placeholder="Re-enter Password" onChange={this.onChange}/>}
        //   {this.state.otpSent && this.state.otpVerified && this.state.samePassword && <span>{this.state.errorMessage}</span> } 
        //   {this.state.otpSent && this.state.otpVerified && <input type="submit" className="button success" value="Update" onClick={this.checkPasswords}/>}
        //   {/* <a href="/signup">Registration</a> */}
        //   </div>
        // </div>
      );
    }
  // }

}

export default Update;