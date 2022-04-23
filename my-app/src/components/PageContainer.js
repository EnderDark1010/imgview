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
    this.handleImgClick = this.handleImgClick.bind(this);
    this.removeImg = this.removeImg.bind(this);
    this.clickRandomize = this.clickRandomize.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.lastPage = this.lastPage.bind(this);
    this.clickSortScore = this.clickSortScore.bind(this);
  }
  state = {
    images: [],
    isClicked: false,
    ActiveImageSrc: '',
    search: '',
    pageNumber: 1,
    currentImgEndpoint:''
  }

  componentDidMount() {

  }

  render() {
    let modal;
    if (this.state.isClicked) {
      modal = <div className='modal' onClick={this.removeImg}>
        <img className='fullImage' src={this.state.ActiveImageSrc} />
      </div>;
    }
    else {
      modal = '';
    }
    return <div className='pageContainer' tabIndex="0" onKeyDown={this.handleInput}>
      {modal}
      <div className='page'>
        <div className='nav'>
          <ul>
            <li><div className='navbarElement'><input type='text' placeholder='tag1,tag2,....'></input></div></li>
            <li>
              <div className='navbarElement'>
                <button onClick={this.lastPage}>&lt;-</button>
                <input onChange={this.handlePageNumberChange} className='pageElement' type='text' placeholder='pagenumber' value={this.state.pageNumber}></input>
                <button onClick={this.nextPage}>-&gt;</button>
              </div>
            </li>
            <li><div className='navbarElement'><button onClick={'next page'}>Randomize</button></div></li>
            <li><div className='navbarElement'><button onClick={this.clickRandomize}>Randomize page order</button></div></li>
            <li><div className='navbarElement'><button onClick={this.clickSortScore}>Sort:score</button></div></li>
            <li><div className='navbarElement'><button onClick={''}>New to Old</button></div></li>
            <li><div className='navbarElement'><button onClick={''}>Old to new</button></div></li>
          </ul>
        </div>

        <div className="gallery">
          {this.state.images.map(item => {
            return <ImageContainer key={item.id} imgsm={item.imgsm} id={item.id} score={item.score} prefix={item.prefixs} onClick={this.handleImgClick} onButtonClick={this.handleScore} />;
          })}
        </div>
      </div>
    </div>
  }





  //Button Functions
  clickRandomize() {
    this.setState({ images: this.shuffle(this.state.images) });
  }
  clickSortScore(){
    console.log('sort score')
    console.log(`/score/down/${this.state.pageNumber}`);
    api.get(`/score/down/${this.state.pageNumber}`, {}, {
      auth: {
        username: 'master',
        password: 'master'
      }
    }).then(res => {
      this.setState({
        images: res.data,
        currentImgEndpoint:'sortscore' })
    })
  }

  //HandlePages
  lastPage() {
    console.log('click')
    console.log(this.state.pageNumber);
    if (this.state.pageNumber != 1) {
      this.setState({ pageNumber: this.state.pageNumber - 1 });
    }
  }
  nextPage() {
    this.setState({ pageNumber: this.state.pageNumber + 1 });
  }
  handlePageNumberChange(){
    
  }



  //MODAL SHIT
  removeImg() {
    this.setState({
      isClicked: false,
      ActiveImageSrc: ''
    });
  }
  handleImgClick(id) {
    console.log(id);
    this.setState({ isClicked: true });
    api.get('/img/id/' + id, {}, {
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
  handleInput(event) {
    if (event.key === 'Escape') {
      this.removeImg();
    } else {
      console.log(event.key);
    }
  }
  handleScore(id, addBool) {
    if (addBool) {
      api.post('/plusscore/' + id, {}, {
        auth: {
          username: 'master',
          password: 'master'
        }
      })
    } else {
      api.post('/minusscore/' + id, {}, {
        auth: {
          username: 'master',
          password: 'master'
        }
      })
    }


  }


  //Regular functions
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

