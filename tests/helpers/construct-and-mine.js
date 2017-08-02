const { getAccounts } = require("../../util/chain");
var { constructContract } = require("../../util/contract");
const createAndTestPendingContract = require("./pending-contract");
const mineAndTestContracts = require("./mined-contract");
const testContractCounts = require("./contract-counts");

module.exports = function(t, context, Contract, args){
  const { provider } = context;
  return getAccounts(provider).then(function(accounts){
    console.log("accounts got");
    var sendAccount = accounts[0];
    return createAndTestPendingContract(
      t, context, sendAccount, function(){
        return constructContract(
          context, Contract,
          sendAccount, args
        ).then(function(arg){
          console.log("consructed");
          return arg;
        });
      }
    ).then(function(unminedContract){
      console.log("constructed");
      return testContractCounts(t, context, Contract, /*1,*/ 0).then(function(){
        return mineAndTestContracts(
          t, context, Contract, sendAccount, [unminedContract]
        );
      });
    });
  });
};
