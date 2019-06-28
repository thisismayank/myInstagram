import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import './Home.css';
import {PostData} from '../../services/PostData';
import UserFeed from "../UserFeed/UserFeed";
import WelcomeFeed from "../WelcomeFeed/WelcomeFeed";
// import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert'; 
import '../../styles/react-confirm-alert.css';

class Home extends Component {
 

  constructor(props) {
    super(props);

    this.state = {
      data:[],
      userFeed: '',
      redirectToReferrer: false,
      redirectToUpdate: false,
      name:'',
      isAuthorized: false,
      token: '',
      viewFavorites: false,
      checkDone: false,
      favoritesFetched: false,
      user: false,
      back: false
    };

    this.getFiles = this.getFiles.bind(this);
    // this.feedUpdate = this.feedUpdate.bind(this);
    this.onChange = this.onChange.bind(this);
    // this.deleteFeed = this.deleteFeed.bind(this);
    // this.deleteFeedAction = this.deleteFeedAction.bind(this);
    // this.convertTime = this.convertTime.bind(this);

    // this.logout = this.logout.bind(this);
    this.update = this.update.bind(this);
    this.isAuthorizedFunction = this.isAuthorizedFunction.bind(this);

  }

  // On initialization
  componentWillMount() {
    let token = localStorage.getItem('token');
    if(token) { 
        this.isAuthorizedFunction();
        this.getFiles();
    } else {
        this.logout();
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
        if(responseJson.data && responseJson.data.success) {         
          this.setState({token: token});
          this.setState({isAuthorized: true})
          this.setState({checkDone: true})

        }
     });
   }

  getFiles = () => {

    let url = ''
    let data = {};

      PostData(url, data).then((result) => {
        console.log(result);
        let responseJson = result;
        this.setState({data: responseJson});
        // this.setState({filesFetched: true});

        console.log(this.state);
      });
  }

  // getFavoriteFilesFunction = () => {

  //   let token = localStorage.getItem('token');
  //   let url = 'favorites'
  //   let data = {
  //       token: token
  //     }

  //     PostData(url, data).then((result) => {
  //       console.log(result);
  //       let responseJson = result;
  //       this.setState({data: responseJson});
  //       // this.setState({filesFetched: true});

  //       console.log(this.state);
  //     });
  // }

  onChange(e){
    this.setState({userFeed:e.target.value});
   }

   logout(){
     localStorage.removeItem("token");
     this.setState({redirectToReferrer: true});
     this.setState({isAuthorized: false});

   }

   update(){
    this.setState({redirectToUpdate: true});
  }

  like = (id) => {
    let url = 'likes/' + id;
    let token = localStorage.getItem('token');
    let data = {
      token: token
    };
    PostData(url, data).then((result) => {
      let responseJson = result;
      window.location.reload();
      // this.setState({data: responseJson.feedData});
      // console.log(this.state);
    });
  } 

  disLike = (id) => {
    let url = 'dislikes/' + id;
    let token = localStorage.getItem('token');
    let data = {
      token: token
    };
    PostData(url, data).then((result) => {
      let responseJson = result;
      window.location.reload();
      // this.setState({data: responseJson.feedData});
      // console.log(this.state);
    });
  }

  viewFavorites = () => {
    this.setState({viewFavorites:true});
  }

  goBack = () => {
    this.setState({back: true});
  }


  render() {
    if(!this.state.isAuthorized && this.state.checkDone){
      return (<Redirect to={'/login'}/>)
    }

    if (this.state.redirectToReferrer) {
      return (<Redirect to={'/login'}/>)
    }

    if (this.state.redirectToUpdate) {
      return (<Redirect to={'/update'}/>)
    }

    if (this.state.viewFavorites) {
      return (<Redirect to={'/favorites'}/>)
    }

    if(this.state.back) {
      return (<Redirect to={'/home'} />)
    }
    // if(this.state.filesFetched) {
      return (
        <div className="row" id="Body">
          <div className="medium-12 columns">
          <a href="" onClick={this.logout} className="logout">Logout</a>
          <a href="" onClick={this.update} className="logout">Update</a>
          <a href="" onClick={this.viewFavorites} className="logout">View Favorites</a>
          <a href="" onClick={this.goBack} className="goBack">Go Back</a>

          </div>
      {/* {this.state.viewFavorites && this.state.favoritesFetched && <UserFeed feedData = {this.state.data} onLike={this.like} onDisLike={this.disLike} /> } */}
       <WelcomeFeed feedData = {this.state.data} fromUserFeed={true} onLike={this.like} onDisLike={this.disLike} btnDisable={false}/>
        </div>
      );
    // }
  }
}

export default Home;