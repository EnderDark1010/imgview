import React from 'react';
  
   
//displays image,id,score, button that increases score
/*
Usage:
const element = <Welcome name="Sara" />;
*/

export default class ImageContainer extends React.Component {
    constructor(props){
        super(props);
        this.state ={isClicked:false};
    }

    render() {
      

      return <div className='img-container'>
        <img onClick={()=>this.props.onClick(this.props.id)}  src={this.toImgLink()} />
      </div>
      ;
    }


    toImgLink(){
      return 'data:'+ this.props.prefix + ';base64,'+ this.props.imgsm;
    }
  }

  //