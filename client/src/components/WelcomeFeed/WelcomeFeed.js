import React, {Component} from 'react';
// import Linkify from 'react-linkify';
// import './UserFeed.css';
// import TimeAgo from 'react-timeago';
class WelcomeFeed extends Component {

  constructor(props){
    super(props);
  
    
  }

  render() {
    
  // {console.log('props',this.props)}
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
                {/* <Linkify>{data.feed}</Linkify> */}
                <br/>
                
                {/* <TimeAgo date={this.props.convertTime(data.created)} /> */}
                </p>
               
              </div>    
            </div>
            {this.props.fromUserFeed &&
            <div className="small-12 medium-2 columns add-friend">
              <div className="add-friend-action">
              <button className="button secondary small btnConfig" disabled={this.props.btnDisbale} onClick={() => this.props.onLike(data.id)} >
              <i className="fa fa-user-times" aria-hidden="true"></i>
              Like
            </button>
            <button>
              <i className="fa fa-user-times" aria-hidden="true"></i>
              {data.numberOfLikes}
            </button>
              </div>
            </div>
            }
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