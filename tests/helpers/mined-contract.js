var { promisify } = require("util");

var contractUtil = require("../../util/contract");
var transactionUtil = require("../../util/transaction");
var chainUtil = require("../../util/chain");
const testContractCounts = require("./contract-counts");

module.exports = function(t, { web3, provider }, Contract, sendAccount, unminedContracts){
  const getBalance = promisify(web3.eth.getBalance.bind(web3.eth));
  var prevBalance;
  var minedContract;
  return t.test("before mine", function(tt){
    return getBalance(sendAccount).then(function(_prevBalance){
      prevBalance = _prevBalance;
      tt.ok(prevBalance.gt(0), "balance has more than 0 Ether");
    });
  }).then(function(){
    return t.test("mine", function(tt){
      return chainUtil.mineNumberOfBlock(provider, 2).then(function(){
        return Promise.all(unminedContracts.map(function(unminedContract){
          return transactionUtil.isTransactionPending(web3, unminedContract.transactionHash)
          .then(function(boo){
            tt.ok(!boo, "Transaction should no longer be pending");
            return transactionUtil.getTransactionReceipt(web3, unminedContract.transactionHash);
          }).then(function(receipt){
            // console.log(receipt);
            var _minedContract = Contract.at(receipt.contractAddress);

            // console.log(minedContract);
            tt.ok(_minedContract.address !== null, "The contract should have an address");

            return getBalance(sendAccount).then(function(balance){
              tt.ok(prevBalance.gt(balance), "balance should be less than it was");

              return contractUtil.isTransactionOfContractType(
                web3, receipt.transactionHash, Contract
              );
            }).then(function(boo){
              t.ok(boo, "Transaction is of expected type");
              minedContract = _minedContract;
              return minedContract;
            });
          });
        }));
      }).then(function(){
        return testContractCounts(tt, { web3 }, Contract, unminedContracts.length);
      }).then(function(results){
        var minedList = results[0];
        tt.ok(!minedList.some(function(minedContract){
          for(var i =0; i<unminedContracts.length; i++){
            if(minedContract.transactionHash === unminedContracts[i].transactionHash){
              return false;
            }
          }
          return true;
        }), "All mined contracts are found");
      });
    });
  }).then(function(){
    return t.test("mine", function(tt){
      return getBalance(sendAccount).then(function(balance){
        tt.ok(prevBalance.gt(balance), "previous balance is more than current balance");
      });
    });
  }).then(function(){
    return minedContract;
  });
};
