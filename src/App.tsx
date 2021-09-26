/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import CoursePage from './pages/CoursePage';
import HomePage from './pages/HomePage';
import store from './store';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/course/:id" render={() => <CoursePage />} />
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}
