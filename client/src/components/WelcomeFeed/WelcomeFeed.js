import React, {Component} from 'react';

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
                <img src={require('../../images/'+ data.fileName + '.jpg')} style={{height: 100, width: 100}}/>

                <br/>
                
                </p>
               
              </div>    
            </div>
            {this.props.fromUserFeed &&
            <div className="small-12 medium-2 columns">
              <div className="add-friend-action">
             {!data.liked && <button className="button secondary small btnConfig" disabled={this.props.btnDisbale} onClick={() => this.props.onLike(data.id)} >
              Like
             </button> }
            <button>
              {data.numberOfLikes}
            </button>
            {data.liked && <button>
              <span className="likedConfig" style={{marginLeft: 10, color: 'green'}}>Liked</span>
                  
            </button>}
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