import React from 'react';
  
   
//displays image,id,score, button that increases score
/*
Usage:
const element = <Welcome name="Sara" />;
*/

export default class Image extends React.Component {
    constructor(props){
        super(props);
        this.state ={isLiked:props.isLiked==='True',
      likes:this.props.score};
    }
    

    render() {

      return <div className='img-container'>
        <img onClick={()=>this.props.onClick(this.props.id)}  src={this.toImgLink()} />
        
        <div>
         <p className='image-likeButton'> <input className='likeButton' type={"image"} onClick={(e)=>this.handleLike()} src={this.state.isLiked?"https://i.imgur.com/UvHANik.png":"https://i.imgur.com/pr5kEC6.png"}/></p>
         <p className='image-score'> {this.state.likes} Likes</p>
        
      </div>
      </div>
      ;
    }

    handleLike(){
      this.props.onButtonClick(this.props.id);
      //if is liked remove one like
      if(this.state.isLiked){
        this.setState({likes:this.state.likes-1,isLiked:false});
      }
      //if is not liked add one like
      else{
        this.setState({likes:this.state.likes+1,isLiked:true});
      }
    }
    
    toImgLink(){
      return this.props.prefix+this.props.imgsm;
    }
  }