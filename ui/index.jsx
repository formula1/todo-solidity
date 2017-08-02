import React from "react";
import { RouterComponent } from "./services/router";
import { Box } from "./generics";
import Web3 from "web3"
import { Provider } from "react-redux";
import { combineReducers } from "redux";

import { reducer as blockchain } from "./stores/blockchain";
import { reducer as router } from "./stores/router";

import ListTodos from "./screens/BrowseTodos";
import TodoDetails from "./screens/TodoDetails";
import SolutionDetails from "./screens/SolutionDetails";
import UserDetails from "./screens/UserDetails";

import { connectHistory, locationReducer } from "redux-history";
import { createHistory, useQueries } from "history";

const store = configureStore();

export default class Application{
  constructor(){
    this.store = createStore(combineReducers({
      blockchain,
      location: locationReducer
    }));

    this.history = useQueries(createHistory)();
    this.unconnectHistory = connectHistory(this.history, store);

    var web3 = new Web3();
    var
    setInterval(function(){

    }, 5 * 1000);

  }

  deconstructor(){
    this.unconnectHistory();
  }
}

function MainPage({ store }){

  return (
    <Provider store={store} >
      <Router>
        <BrowseTodos path="/" />
        <TodoDetails path="/todo" />
        <SolutionDetails path="/solution" />
        <UserDetails path="" />
      </Router>
    </Provider>
  );
}


function createStore(){
}
