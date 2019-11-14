import React from 'react';
import ReactDOM from 'react-dom';

// import Home from './components/training/home'
// import EntityManage from './components/home/manage/entity';
import App from './App';
import * as serviceWorker from './serviceWorker';
// import Manage from './components/manage/manage';

ReactDOM.render(<App />, document.getElementById('root'));
// ReactDOM.render(<Manage/>,document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
