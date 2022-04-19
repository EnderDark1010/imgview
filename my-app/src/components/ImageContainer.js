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
        this.handleClick =this.handleClick.bind(this);
    }
    state={
      isClicked:false
    }
    render() {
      let modal;
      if(this.state.isClicked){
        modal=<div className='modal'><img className='full-img' onClick={this.handleClick} src={'data:'+ this.props.prefix + ';base64,'+ this.props.img} /></div>
      }else{
          modal=''
      }

      return <div className='img-container'>
        <img onClick={this.handleClick} className='img-class' src={this.toImgLink()} />
        {modal}
      </div>
      ;
    }

    handleClick(){
     this.setState({isClicked:!this.state.isClicked});
      console.log(this.state.isClicked);
    }
 

    toImgLink(){
      return 'data:'+ this.props.prefix + ';base64,'+ this.props.imgsm;
    }
  }

  //