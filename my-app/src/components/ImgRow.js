import {Row,Col} from 'react-bootstrap'
import ImageContainer from './ImageContainer';
export default class ImgRow extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        var keys = Object.keys(this.props);
      return   <Row>
          {keys.map(key =>
            <Col>
            <ImageContainer img={this.props[key].img} id={this.props[key].id} score={this.props[key].score} type={this.props[key].type}/>
            </Col>)}
      </Row>
    }

 

    toImgLink(){
      return 'data:image/'+this.props.type+';base64,'+this.props.img;
    }


  }
