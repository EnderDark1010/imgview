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

    
    constructor(){
        super();
        api.get('/',{},{
          auth:{
            username:'master',
            password:'master'
          }
        }).then(res=>{
          this.setState({images: res.data})
        })
        
    }
    state ={
      images:[]
  }
//todo try to wrap row around image container :36

    render() {
      let rows = this.toList();
      return <div className="fullSize">


          {Object.keys(rows).map(row => {
            return (
              <div className="row items__row" key={row}>
                {rows[row].map(item => {
                  return <Col><ImageContainer img={item.img} id={item.id} score={item.score} prefix={item.prefixs}/></Col>;
                })}
              </div>
            );
          })}

    </div>
    }

  
    toList(){
      let rows = {};
      let counter = 1;
      this.state.images.forEach((item, idx) => {
        rows[counter] = rows[counter] ? [...rows[counter]] : [];
        if (idx % 4 === 0 && idx !== 0) {
          counter++;
          rows[counter] = rows[counter] ? [...rows[counter]] : [];
          rows[counter].push(item);
        } else {
          rows[counter].push(item);
        }
      });
      return rows;
    }
    
  }
  
