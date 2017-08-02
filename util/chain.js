
const { promisify } = require("util");
const { forLoopSerial } = require("./iteration");
const contractUtil = require("./contract");
var TestRPC = require("ethereumjs-testrpc");
var Web3 = require("web3");

module.exports.initialize = initialize;
module.exports.mineNumberOfBlock = mineNumberOfBlock;
module.exports.increaseTime = increaseTime;
module.exports.mineBlock = mineBlock;
module.exports.getAccounts = getAccounts;

function initialize(accounts){
  var web3 = new Web3();
  var provider = TestRPC.provider({
    accounts: accounts,
    locked: false
  });

  web3.setProvider(provider);
  const Contracts = contractUtil.require(web3, "../contracts/Task.sol");

  return promisify(provider.sendAsync.bind(provider))({
    jsonrpc: "2.0",
    method: "miner_stop",
    params: [],
    id: Date.now()
  }).then(function(){
    return {
      web3, provider, Contracts,
    };
  });

}

function getAccounts(provider){
  return promisify(provider.sendAsync.bind(provider))({
    jsonrpc: "2.0",
    method: "eth_accounts",
    params: [],
    id: Date.now()
  }).then(function(result){
    return result.result;
  });
}

function createLatestBlockListener(web3, cb){


  function unlisten(){

  }
}

function increaseTime(provider, amount){
  return promisify(provider.sendAsync.bind(provider))({
    jsonrpc: "2.0",
    method: "evm_increaseTime",
    params: [amount],
    id: Date.now()
  }).then(function(result){
    return result.result;
  });
}

function mineNumberOfBlock(provider, number){
  return promisify(provider.sendAsync.bind(provider))({
    jsonrpc: "2.0",
    method: "miner_stop",
    params: [],
    id: Date.now()
  }).then(function(){
    return forLoopSerial(0, number, function(){
      return mineBlock(provider);
    });
  });
}

function mineBlock(provider){
  return increaseTime(provider, 1).then(function(){
    return promisify(provider.sendAsync.bind(provider))({
      jsonrpc: "2.0",
      method: "evm_mine",
      params: [],
      id: Date.now()
    });
  }).then(function(result){
    return result.result;
  });
}
