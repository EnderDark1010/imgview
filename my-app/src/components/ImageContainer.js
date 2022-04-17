import { type } from '@testing-library/user-event/dist/type';
import { wait } from '@testing-library/user-event/dist/utils';
import React from 'react';
import Buffer from 'buffer'
  
   
//displays image,id,score, button that increases score
/*
Usage:
const element = <Welcome name="Sara" />;
*/

export default class ImageContainer extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
 
      return <div className='img-container'>
        <img className='img-class' src={this.toImgLink()} />
      </div>;
    }

 

    toImgLink(){
      return this.props.prefix + ','+ this.props.img;
    }



  }

  //