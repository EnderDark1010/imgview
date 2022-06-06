import React from 'react';
import axios from 'axios';
import Image from './Image'
import { GETREQUEST, getRequest } from './API';
const api = axios.create({
  baseURL: 'http://192.168.1.114:5000',
})
//contains a searchbar and  imageContainers
//once imagecontainer data is base on what is in the searchbar
//https://fsymbols.com/generators/carty/
export default class PageContainer extends React.Component {

  constructor() {
    super();
    this.setActiveImageSrc = this.setActiveImageSrc.bind(this);
    this.removeImg = this.removeImg.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.lastPage = this.lastPage.bind(this);
    this.updateSerchTags = this.updateSerchTags.bind(this);
    this.clickSearch = this.clickSearch.bind(this);

  }
  state = {
    images: [],
    isClicked: false,
    ActiveImageSrc: '',
    ActiveImageID: 0,
    imgIDs: [],
    search: '',
    pageNumber: 1,
    tags: '',
    imgEndpoint: 'sortscoredown'
  }
  pageNumber = 1;



  render() {
    let modal;
    if (this.state.isClicked) {
      modal = <div className='modal' onClick={this.removeImg}>
        <img id='fullImage' className='fullImage' src={this.state.ActiveImageSrc} />
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

            <div className='navbarElement'>
            <label for="tagInput">Tags:</label>
              <input name='tagInput' type='text' placeholder='tag1,tag2,....' value={this.state.tags} onChange={evt => this.updateSerchTags(evt)}></input>
              <button onClick={this.clickSearch} >Search</button>
            </div>
            <div className='navbarElement'>
            <label for="orderSelection">Orderd by:</label>
            <select name="orderSelection" id="orderSelection" value={this.state.imgEndpoint} onChange={(e)=>this.changeImgSearchOrder(e)}>
              <option value="sortscoreasc">Score Up</option>
              <option value="sortscoredown">Score Down</option>
              <option value="newold">New to Old</option>
              <option value="oldnew">Old to new</option>
              <option value="random">Random</option>
            </select>
            </div>


            <div className='navbarElement'>
              <button onClick={this.lastPage}>&lt;&lt;-</button>
              <button onClick={this.lastPage}>&lt;-</button>
              &nbsp;{this.pageNumber}&nbsp;
              <button onClick={this.nextPage}>-&gt;</button>
              <button onClick={this.nextPage}>-&gt;&gt;</button>
            </div>

            
          </ul>
        </div>

        <div className="gallery">
          {this.state.images.map(item => {
            return <Image key={item.id} imgsm={item.imgsm} id={item.id} score={item.score} prefix={item.prefixs} onClick={this.setActiveImageSrc} onButtonClick={this.handleScore} />;
          })}
        </div>
      </div>
    </div>
  }

  setImages() {
    let endPoint = '';
    switch (this.state.imgEndpoint) {
      case 'sortscoredown': endPoint += `/query/scoreDown/`; break;
      case 'sortscoreasc': endPoint += `/query/scoreUp/`; break;
      case 'newold': endPoint += `/query/idDown/`; break;
      case 'oldnew': endPoint += `/query/idUp/`; break;
      case 'search': endPoint += `/query/`; break;

    }
    if (this.state.tags === '') {
      endPoint += `none/${this.pageNumber}`
    } else {
      endPoint += `${this.state.tags}/${this.pageNumber}`
    }

    api.get(endPoint, {}, {
      auth: {
        username: 'master',
        password: 'master'
      }
    }).then(res => {
      this.setState({
        images: res.data,
      })
      let ids = [];
      res.data.forEach(item => {
        ids.push(item.id);
      });
      this.setState({
        imgIDs: ids
      })
    });
  }

  /*
██████╗░░█████╗░░██████╗░███████╗░██████╗
██╔══██╗██╔══██╗██╔════╝░██╔════╝██╔════╝
██████╔╝███████║██║░░██╗░█████╗░░╚█████╗░
██╔═══╝░██╔══██║██║░░╚██╗██╔══╝░░░╚═══██╗
██║░░░░░██║░░██║╚██████╔╝███████╗██████╔╝
╚═╝░░░░░╚═╝░░╚═╝░╚═════╝░╚══════╝╚═════╝░
  */
  lastPage() {
    if (this.pageNumber != 1) {
      this.handlePageNumberChange(this.pageNumber - 1);
    }
  }
  nextPage() {
    this.handlePageNumberChange(this.pageNumber + 1);
  }
  handlePageNumberChange(value) {
    this.pageNumber = value;
    this.setImages();
  }





  /*
███╗░░░███╗░█████╗░██████╗░░█████╗░██╗░░░░░
████╗░████║██╔══██╗██╔══██╗██╔══██╗██║░░░░░
██╔████╔██║██║░░██║██║░░██║███████║██║░░░░░
██║╚██╔╝██║██║░░██║██║░░██║██╔══██║██║░░░░░
██║░╚═╝░██║╚█████╔╝██████╔╝██║░░██║███████╗
╚═╝░░░░░╚═╝░╚════╝░╚═════╝░╚═╝░░╚═╝╚══════╝
  */
  removeImg() {
    this.setState({
      isClicked: false,
      ActiveImageSrc: ''
    });
  }
  async setActiveImageSrc(id) {
    let data = await getRequest(GETREQUEST.SINGLE_IMAGE, { id: id })
    this.setState({
      ActiveImageSrc: data[0].prefix + data[0].img,
      isClicked: true, ActiveImageID: id
    })

  }
  handleInput(event) {
    if (event.key === 'Escape' && this.state.isClicked) {
      this.removeImg();
    }
    //if event key left
    if (event.key === 'ArrowLeft' && this.state.isClicked) {
      this.imgLeft();
    }
    //if event key right
    if (event.key === 'ArrowRight' && this.state.isClicked) {
      this.imgRight();
    }
  }
  imgLeft() {
    this.setActiveImageSrc(this.state.imgIDs[this.state.imgIDs.indexOf(this.state.ActiveImageID) - 1]);
  }
  imgRight() {
    this.setActiveImageSrc(this.state.imgIDs[this.state.imgIDs.indexOf(this.state.ActiveImageID) + 1]);
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


  /*
  ██████╗░██╗░░░██╗████████╗████████╗░█████╗░███╗░░██╗
  ██╔══██╗██║░░░██║╚══██╔══╝╚══██╔══╝██╔══██╗████╗░██║
  ██████╦╝██║░░░██║░░░██║░░░░░░██║░░░██║░░██║██╔██╗██║
  ██╔══██╗██║░░░██║░░░██║░░░░░░██║░░░██║░░██║██║╚████║
  ██████╦╝╚██████╔╝░░░██║░░░░░░██║░░░╚█████╔╝██║░╚███║
  ╚═════╝░░╚═════╝░░░░╚═╝░░░░░░╚═╝░░░░╚════╝░╚═╝░░╚══╝
  
  ███████╗██╗░░░██╗███╗░░██╗░█████╗░████████╗██╗░█████╗░███╗░░██╗░██████╗
  ██╔════╝██║░░░██║████╗░██║██╔══██╗╚══██╔══╝██║██╔══██╗████╗░██║██╔════╝
  █████╗░░██║░░░██║██╔██╗██║██║░░╚═╝░░░██║░░░██║██║░░██║██╔██╗██║╚█████╗░
  ██╔══╝░░██║░░░██║██║╚████║██║░░██╗░░░██║░░░██║██║░░██║██║╚████║░╚═══██╗
  ██║░░░░░╚██████╔╝██║░╚███║╚█████╔╝░░░██║░░░██║╚█████╔╝██║░╚███║██████╔╝
  ╚═╝░░░░░░╚═════╝░╚═╝░░╚══╝░╚════╝░░░░╚═╝░░░╚═╝░╚════╝░╚═╝░░╚══╝╚═════╝░
  */
  clickSearch() {
    this.setImages();
  }
  changeImgSearchOrder(evt) {
    const val = evt.target.value;
    this.setState({
      imgEndpoint: val
    });
  }

  updateSerchTags(evt) {
    const val = evt.target.value;
    this.setState({
      tags: val
    });
  }
}

