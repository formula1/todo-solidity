import React, { Component } from "react";
import router from "../services/router";
import { Text } from "../generics";
import { promisify } from "util";
import resolveStructure from "../../util/contract";

export class ScreenStateContainer {
  constructor(dispatch){

  }
  deconstructor(){
    accepted_solution.id
  }
  contractToListable(contract, transactionReceipt, web3){
    return Promise.all([
      promisify(web3.eth.getBlock.bind(web3.eth))(transactionReceipt.blockHash).then(function(block){
        return block.timestamp;
      }),
      promisify(contract.accepted_solution.bind(contract))().then(function(solutionId){
        return resolveStructure(contract.solutions(solutionId));
      }),
      promisify(contract.creator.bind(contract))(),
      promisify(contract.totalbounty.bind(contract))(),
      promisify(contract.solutionCount.bind(contract))(),
    ]).then(function(results){
      return [
        "date", "title", "accepted", "creator", "totalbounty", "number_solutions"
      ].reduce(function(obj, key, i){
        obj[key] = results[i];
        return obj;
      }, {});
    });
  }
}

export default function ListTodos(props){
  return (
    <table>
      <thead>
        <tr>
          <th><Text>Date</Text></th>
          <th><Text>Title</Text></th>
          <th><Text>Chosen Solution</Text></th>
          <th><Text>Creator</Text></th>
          <th><Text>Bounty</Text></th>
          <th><Text># of Solutions</Text></th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(props.contracts).map(function(key){
          var contract = props.contracts[key];
          return (<tr>
            <td>
              <Link locaion={"/todo/" + contract.id}>
                <Text>{contract.title}</Text>
              </Link>
            </td>
            <td>{
              !contract.accepted_solution ?
              <Text>None</Text> :
              <Link locaion={
                "/todo/" + contract.id + "/solution/" + contract.accepted_solution.id
              }>
                <Text>{contract.accepted_solution.title}</Text>
              </Link>
            }</td>
            <td>{contract.creator}</td>
            <td>{contract.totalbounty}</td>
            <td>{contract.number_solutions}</td>
          </tr>);
        })}
      </tbody>
    </table>
  );
}
