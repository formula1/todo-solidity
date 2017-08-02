var { promisify } = require("util");

// var contractUtil = require("../../util/contract");
var transactionUtil = require("../../util/transaction");
var chainUtil = require("../../util/chain");

module.exports = function(t, { web3, provider }, sendAccount, construct){
  const getBalance = promisify(web3.eth.getBalance.bind(web3.eth));
  var unminedContract;
  var prevBalance;
  return t.test("before creation", function(tt){
    return getBalance(sendAccount).then(function(_prevBalance){
      prevBalance = _prevBalance;
      tt.ok(prevBalance.gt(0), "balance has more than 0 Ether");
    });
  }).then(function(){
    return t.test("creation", function(tt){
      return construct().then(function(_unminedContract){
        unminedContract = _unminedContract;
        tt.ok(!unminedContract.address, "The contract should not have been mined yet");
        return transactionUtil.isTransactionPending(web3, unminedContract.transactionHash);
      }).then(function(isPending){
        tt.ok(isPending, "Transaction should be pending");
      });
    });
  }).then(function(){
    return t.test("after creation", function(tt){
      return getBalance(sendAccount).then(function(newBalance){
        tt.ok(prevBalance.eq(newBalance), "balance is same after creating a pending contract");
        return chainUtil.increaseTime(provider, 3 * 1000).then(function(){
          tt.ok(!unminedContract.address, "The contract should not have been mined yet");
          return Promise.all([
            getBalance(sendAccount),
            transactionUtil.isTransactionPending(web3, unminedContract.transactionHash),
          ]);
        }).then(function([balance, isPending]){
          tt.ok(newBalance.eq(balance), "time doesn't change balances");
          tt.ok(isPending, "Transaction should be pending");
        });
      });
    });
  }).then(function(){
    return unminedContract;
  });
};
