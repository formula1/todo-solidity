import React, { Component } from "react";
import router from "../services/router";
import { requireSol } from "../../util/contract";




export default class BrowseTodos extends Component {
  componentWillMount(){
    var Contracts = requireSol("../../contracts/Task.sol");

  }
  render(){
  }
}
