import React from "react";
//to get uri this.state.file['base64']
//from here
//https://codesandbox.io/s/convert-file-to-base64-in-react-lqi1e
export default class Base64 extends React.Component {
  state = {
    file: null,
    base64URL: ""
  };

  getBase64 = file => {
    return new Promise(resolve => {
      let fileInfo;
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        
        baseURL = reader.result;
        
        resolve(baseURL);
      };
      
    });
  };

  handleFileInputChange = e => {
    
    let  file  = this.state;

    file = e.target.files[0];

    this.getBase64(file)
      .then(result => {
        file["base64"] = result;
        
        this.setState({
          base64URL: result,
          file
        });
       
      })
      .catch(err => {
        console.log(err);
      });

    this.setState({
      file: e.target.files[0]
    });
    
  };

  render() {
    return (
      <div>
        <input type="file" name="file" onChange={this.handleFileInputChange} />
      </div>
    );
  }
}

