import React, {Component} from 'react';
// import Linkify from 'react-linkify';
// import './UserFeed.css';
// import TimeAgo from 'react-timeago';
class WelcomeFeed extends Component {

  constructor(props){
    super(props);
  
    
  }

  render() {
    
  
    let userFeed = this
      .props
      .feedData
      .map(function (data, index) {
        return (
          <div className="medium-12 columns" key={index}>

          <div className="class1">
         
          <div className="row class2">
            <div className="small-12 medium-10 columns class3">
              
              <div className="class4">
                <p className="file-name">
                <b>{data.fileName}</b>
                <img src={require('../../images/'+ data.fileName + '.jpg')}/>
                {/* <Linkify>{data.feed}</Linkify> */}
                <br/>
                
                {/* <TimeAgo date={this.props.convertTime(data.created)} /> */}
                </p>
               
              </div>    
            </div>
            <div className="small-12 medium-2 columns add-friend">
              <div className="add-friend-action">
              {/* <button className="button secondary small" onClick={() => this.props.onLike(data.id)} >
              <i className="fa fa-user-times" aria-hidden="true"></i>
              Like
            </button> */}
            <button className="button secondary small" onClick={() => this.props.onDisLike(data.id)} >
              <i className="fa fa-user-times" aria-hidden="true"></i>
              DisLike
            </button>
              </div>
            </div>
          </div>
          
          
        </div>
         
          </div>
         
        )
      }, this);

    return (
      <div>
        {userFeed}

      </div>
    );
  }

}

export default WelcomeFeed;