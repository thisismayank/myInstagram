import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {PostData} from '../../services/PostData';
import WelcomeFeed from "../WelcomeFeed/WelcomeFeed";
import './Welcome.css';

class Welcome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data:[],
      userFeed: '',
      redirectToReferrer: false,
      redirectToUpdate: false,
      name:'',
      isAuthorized: false
    };

    // this.getUserFeed = this
    //   .getUserFeed
    //   .bind(this);
    // this.feedUpdate = this.feedUpdate.bind(this);
    // this.onChange = this.onChange.bind(this);
    // this.deleteFeed = this.deleteFeed.bind(this);
    // this.deleteFeedAction = this.deleteFeedAction.bind(this);
    // this.convertTime = this.convertTime.bind(this);

    // // this.logout = this.logout.bind(this);
    // this.update = this.update.bind(this);
    // this.isAuthorizedFunction = this.isAuthorizedFunction.bind(this);
  }

  // On initialization
  componentWillMount() {
      this.getFiles();
    }

    getFiles = () => {
      let postData = {}; 
        PostData('', postData).then((result) => {
          console.log(result);
          let responseJson = result;
          this.setState({data: responseJson});
          console.log(this.state);
        });
    }

    Like = () => {

    }

    disLike = () => {

    }
    
  render() {
    return (
      <div className="row " id="Body">
        <div className="medium-12 columns">
          <a href="/login" className="button btnConfig">Login</a>
          <a href="/signup" className="button success btnConfig">Signup</a>
          <h1></h1>
        </div>
        <div className="images">
          <WelcomeFeed feedData = {this.state.data} fromUserFeed={false} name={this.state.name} btnDisable={true} onLike={this.like} onDisLike={this.disLike}/>
        </div>
      </div>
        
    );
  }
}

export default Welcome;