import React from 'react';
import axios from 'axios';
import Image from './Image'
import { Col } from 'react-bootstrap';
const api = axios.create({
  baseURL: 'http://localhost:5000',
})
//contains a searchbar and  imageContainers
//once imagecontainer data is base on what is in the searchbar
//https://fsymbols.com/generators/carty/
export default class PageContainer extends React.Component {

  constructor() {
    super();
    this.handleImgClick = this.handleImgClick.bind(this);
    this.removeImg = this.removeImg.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.lastPage = this.lastPage.bind(this);
    this.clickSortScoreDown = this.clickSortScoreDown.bind(this);
    this.clickSortNewOld = this.clickSortNewOld.bind(this);
    this.clickSortOldNew = this.clickSortOldNew.bind(this);
    this.updateSerchTags = this.updateSerchTags.bind(this);
    this.clickSearch = this.clickSearch.bind(this);
    this.clickSortScoreUp = this.clickSortScoreUp.bind(this);
  }
  state = {
    images: [],
    isClicked: false,
    ActiveImageSrc: '',
    search: '',
    pageNumber: 1,
    tags: ''
  }
  currentImgEndpoint = '';
  pageNumber = 1;
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
    console.log('render');
    console.log(this.state);
    return <div className='pageContainer' tabIndex="0" onKeyDown={this.handleInput}>
      {modal}
      <div className='page'>
        <div className='nav'>
          <ul>
            <li>
              <div className='navbarElement'>
                <input type='text' placeholder='tag1,tag2,....' value={this.state.tags} onChange={evt => this.updateSerchTags(evt)}></input>
              </div>
            </li>
            <li><button onClick={this.clickSearch} >Search</button></li>
            <li>
              <div className='navbarElement'>
                <button onClick={this.lastPage}>&lt;&lt;-</button>
                <button onClick={this.lastPage}>&lt;-</button>
                &nbsp;{this.pageNumber}&nbsp;
                <button onClick={this.nextPage}>-&gt;</button>
                <button onClick={this.nextPage}>-&gt;&gt;</button>
              </div>
            </li>
            <li><div className='navbarElement'><button onClick={'next page'}>Randomize</button></div></li>
            <li><div className='navbarElement'><button onClick={this.clickSortScoreDown}>Sort:score:down</button></div></li>
            <li><div className='navbarElement'><button onClick={this.clickSortScoreUp}>Sort:score:asc</button></div></li>
            <li><div className='navbarElement'><button onClick={this.clickSortNewOld}>New to Old</button></div></li>
            <li><div className='navbarElement'><button onClick={this.clickSortOldNew}>Old to new</button></div></li>
          </ul>
        </div>

        <div className="gallery">
          {this.state.images.map(item => {
            return <Image key={item.id} imgsm={item.imgsm} id={item.id} score={item.score} prefix={item.prefixs} onClick={this.handleImgClick} onButtonClick={this.handleScore} />;
          })}
        </div>
      </div>
    </div>
  }


  updateSerchTags(evt) {
    const val = evt.target.value;

    this.setState({
      tags: val
    });
  }




  setImages() {
    let endPoint = '';
    switch (this.currentImgEndpoint) {
      case 'sortscoredown':
        if (this.state.tags === '') {
          endPoint = `/query/scoredown/none/${this.pageNumber}`;
        } else {
          endPoint = `/query/scoredown/${this.state.tags}/${this.pageNumber}`;
        }
        break;

      case 'sortscoreasc':
        if (this.state.tags === '') {
          endPoint = `/query/scoreup/none/${this.pageNumber}`;
        } else {
          endPoint = `/query/scoreup/${this.state.tags}/${this.pageNumber}`;
        }
        break;
      case 'newold':
        if (this.state.tags === '') {
          endPoint = `/query/newfirst/none/${this.pageNumber}`;
        } else {
          endPoint = `/query/newfirst/${this.state.tags}/${this.pageNumber}`;
        }
        break;

      case 'oldnew':
        if (this.state.tags === '') {
          endPoint = `/query/oldfirst/none/${this.pageNumber}`;
        } else {
          endPoint = `/query/oldfirst/${this.state.tags}/${this.pageNumber}`;
        }
        break;

      case 'search':
        if (this.state.tags === '') {
          endPoint = `/query/none/${this.pageNumber}`;
        } else {
          endPoint = `/query/${this.state.tags}/${this.pageNumber}`;
        }
        break;

    }

    if (endPoint !== '') {
      api.get(endPoint, {}, {
        auth: {
          username: 'master',
          password: 'master'
        }
      }).then(res => {
        this.setState({
          images: res.data,
        })
      })
    }
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
  handleImgClick(id) {
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
    this.currentImgEndpoint = 'search';
    console.log('search')
    console.log('tags:')
    console.log(this.state.tags);
    this.setImages();
  }
  clickSortScoreDown() {
    this.currentImgEndpoint = 'sortscoredown';
    this.setImages();
  }
  clickSortScoreUp() {
    this.currentImgEndpoint = 'sortscoreasc';
    this.setImages();
  }
  clickSortNewOld() {
    this.currentImgEndpoint = 'newold';
    this.setImages();
  }
  clickSortOldNew() {
    this.currentImgEndpoint = 'oldnew';
    this.setImages();
  }


}

