import React from 'react';
  
   
//displays image,id,score, button that increases score
/*
Usage:
const element = <Welcome name="Sara" />;
*/

export default class Image extends React.Component {
    constructor(props){
        super(props);
        this.state ={score:this.props.score};
        this.plus = this.plus.bind(this);
        this.minus = this.minus.bind(this);
    }

    render() {
      

      return <div className='img-container'>
        <img onClick={()=>this.props.onClick(this.props.id)}  src={this.toImgLink()} />
        
        <div><br/>
          <button onClick={this.minus}>-</button>
          &nbsp;&nbsp;
          Score({Math.round(this.state.score)})
          &nbsp;&nbsp;
          <button onClick={this.plus}>+</button></div>
        
      </div>
      ;
    }

    plus(){
      this.props.onButtonClick(this.props.id,true);
      this.setState({score:this.state.score+1});
    }
    minus(){
      if(this.state.score !=0){
        this.props.onButtonClick(this.props.id,false);
        this.setState({score:this.state.score-1});
      }
    }
    toImgLink(){
      return this.props.prefix+this.props.imgsm;
    }
  }

  //