/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import { MemoryRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import CoursePage from './pages/CoursePage';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/course">
          <CoursePage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
    </Router>
  );
}
