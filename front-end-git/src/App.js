import React, { Component } from 'react';
import './App.css'
import {BrowserRouter as Router, Route} from 'react-router-dom';
// import Menu from './components/training/menu';
// import Header from './components/training/header';

import Training from './components/training/training';
import Home from './components/home/home';
import Manage from './components/manage/manage';
import Chat from './components/chat/chat';

class App extends Component {
	state = {  }
	render() { 
		return (  
			<Router>
				{/* <Header/> */}
				{/* <Menu /> */}
				<Route exact path="/" component={Home} />
				<Route path="/training" component={Training} />
				<Route path="/manage" component={Manage} />
				<Route path="/chat" component={Chat} />
			</Router>
		);
	}
}
 
export default App;