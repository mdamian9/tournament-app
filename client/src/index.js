import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import UserHomePage from './components/UserHomePage';
import RoundRobinPage from './components/RoundRobinPage';

ReactDOM.render(
    <Router>
        <Route exact path='/' component={App} />
        <Route exact path='/home' component={UserHomePage} />
        <Route exact path='/round-robin' component={RoundRobinPage} />
    </Router>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
