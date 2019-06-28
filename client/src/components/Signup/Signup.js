import React, {Component} from 'react';
import {PostData} from '../../services/PostData';
import {Redirect} from 'react-router-dom';
import './Signup.css';

class Signup extends Component {

  constructor(props){
    super(props);
   
    this.state = {
      firstName: '',
      lastName: '',
     userCode: '',
     password: '',
     email: '',
     dob: '',
     redirectToReferrer: false
    };

    this.signup = this.signup.bind(this);
    this.onChange = this.onChange.bind(this);

  }
 

  signup() {
    if(this.state.userCode && this.state.password && this.state.email) {
    PostData('signup',this.state).then((result) => {
      let responseJson = result;
      if(responseJson.success) {         
        // localStorage.setItem('token',JSON.stringify(responseJson));
        this.setState({redirectToReferrer: true});
      }  
     });
    }
  }

 onChange(e){
   this.setState({[e.target.name]:e.target.value});
  }

  render() {
    if (this.state.redirectToReferrer || localStorage.getItem('token')) {
      return (<Redirect to={'/home'}/>)
    }
   
    return (
      
      <div className="row " id="Body">
        <div className="medium-5 columns left">
        <h4>Signup</h4>
        {/* <label>First Name</label> */}
        <input type="text" name="firstName"  placeholder="First Name" onChange={this.onChange}/>
        {/* <label>Last Name</label> */}
        <input type="text" name="lastName"  placeholder="Last Name" onChange={this.onChange}/>
        {/* <label>Email</label> */}
        <input type="text" name="email"  placeholder="Email" onChange={this.onChange}/>
        {/* <label>Usern</label> */}
        <input type="text" name="userCode" placeholder="User Code" onChange={this.onChange}/>
        {/* <label>Password</label> */}
        <input type="password" name="password"  placeholder="Password" onChange={this.onChange}/>
        <input type="date" name="dob"  placeholder="DOB" onChange={this.onChange}/>
        
        <input type="submit" className="button" value="Sign Up" onClick={this.signup}/>
        <a href="/login">Login</a>
        </div>
        
      </div>
    );
  }
}

export default Signup;