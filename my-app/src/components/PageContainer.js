import React from 'react';
import axios from 'axios';
import ImageContainer from './ImageContainer'
import { Col } from 'react-bootstrap';
const api = axios.create({
  baseURL: 'http://localhost:5000',
})
//contains a searchbar and  imageContainers
//once imagecontainer data is base on what is in the searchbar

export default class PageContainer extends React.Component {


  constructor() {
    super();
    api.get('/', {}, {
      auth: {
        username: 'master',
        password: 'master'
      }
    }).then(res => {
      this.setState({ images: res.data })

    })
    this.handleImgClick = this.handleImgClick.bind(this);
    this.removeImg = this.removeImg.bind(this);
    this.clickRandomize= this.clickRandomize.bind(this);
    this.setState({ renderNum: 0 })
  }
  state = {
    images: [],
    isClicked: false,
    ActiveImageSrc: '',
    renderNum: 0
  }
  //todo try to wrap row around image container :36

  render() {
    if (this.state.renderNum == 0) {
      this.shuffle(this.state.images);
      this.setState({ renderNum: 1 });
    }

    let modal;
    if (this.state.isClicked) {
      modal = <div className='modal' onClick={this.removeImg}>
        <img className='fullImage' src={this.state.ActiveImageSrc} />
      </div>;
    }
    else {
      modal = '';
    }
    return <div>
      {modal}
      <button onClick={this.clickRandomize}>Randomize</button>
      <div className="gallery">
        {this.state.images.map(item => {
          return <ImageContainer key={item.id} imgsm={item.imgsm} id={item.id} score={item.score} prefix={item.prefixs} onClick={this.handleImgClick} />;
        })}
      </div>
    </div>;

  }
  clickRandomize(){
   this.setState({images:this.shuffle(this.state.images)}) ;
  }

  removeImg() {
    this.setState({
      isClicked: false,
      ActiveImageSrc: ''
    });
  }
  handleImgClick(id) {
    console.log(id);
    this.setState({ isClicked: true });
    api.get('/img/' + id, {}, {
      auth: {
        username: 'master',
        password: 'master'
      }
    }).then(res => {
      res.data.map(item => {
        this.setState({ ActiveImageSrc: 'data:' + item.prefix + ';base64,' + item.img })
      })

    })
  }
  toList() {
    let rows = {};
    let counter = 1;
    this.state.images.forEach((item, idx) => {
      rows[counter] = rows[counter] ? [...rows[counter]] : [];
      if (idx % 2 === 0 && idx !== 0) {
        counter++;
        rows[counter] = rows[counter] ? [...rows[counter]] : [];
        rows[counter].push(item);
      } else {
        rows[counter].push(item);
      }
    });
    return rows;
  }

  shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

}

