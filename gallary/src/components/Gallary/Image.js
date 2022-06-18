import React from 'react';
  
   
//displays image,id,score, button that increases score
/*
Usage:
const element = <Welcome name="Sara" />;
*/

export default class Image extends React.Component {
    constructor(props){
        super(props);
        this.state ={isLiked:props.isLiked==='True'};
    }
    

    render() {

      return <div className='img-container'>
        <img onClick={()=>this.props.onClick(this.props.id)}  src={this.toImgLink()} />
        
        <div>
          <input className='likeButton' type={"image"} onClick={(e)=>this.handleLike()} src={this.state.isLiked?"https://i.imgur.com/UvHANik.png":"https://i.imgur.com/pr5kEC6.png"}/>
          
        
      </div>
      </div>
      ;
    }

    handleLike(){
      this.props.onButtonClick(this.props.id);
      this.setState({isLiked:!this.state.isLiked});
    }
    toImgLink(){
      return this.props.prefix+this.props.imgsm;
    }
  }