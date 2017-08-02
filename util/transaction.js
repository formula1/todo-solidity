const { promisify } = require("util");

module.exports.isTransactionPending = function(web3, transactionHash){
  return promisify(
    web3.eth.getTransaction.bind(web3.eth)
  )(transactionHash).then(function(transaction){
    if(transaction === null) return true;
    if(typeof transaction.blockNumber !== "number") return true;
    return false;
  });
};

module.exports.getTransactionReceipt = function(web3, hash){
  return promisify(web3.eth.getTransactionReceipt.bind(web3.eth))(hash);
};

module.exports.getTransaction = function(web3, hash){
  return promisify(web3.eth.getTransaction.bind(web3.eth))(hash);
};
