import logo from './logo.svg';

import PageContainer from './components/PageContainer'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Container} from 'react-bootstrap'
import Upload from './components/Upload';
import TestU from './components/Testu';
import Base64 from './components/Base64';
function App() {
  return (
    <div className="App">
      <Container fluid>
      <TestU/>

      <PageContainer/>
      

</Container>
    </div>
  );
}

export default App;


/*
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>  
      </header>
*/