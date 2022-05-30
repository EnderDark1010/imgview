import React from 'react';
  
   
//displays image,id,score, button that increases score
/*
Usage:
const element = <Welcome name="Sara" />;
*/

export default class Video extends React.Component {
    constructor(props){
        super(props);
        this.state ={score:this.props.score};
        
    }

    render() {
      

      return <div className='video-class'>
          <video>
              <source src="data:video/mp4;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="/>  </video>
      </div>
      ;
    }

  
  }

  //