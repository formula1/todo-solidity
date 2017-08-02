
var contractUtil = require("../../util/contract");

module.exports = function(t, { web3 }, Contract, /*expectedPending, */ expectedMined){
  return Promise.all([

    // contractUtil.retrieveAllPendingContractConstructsOfType(web3, TaskContract),
    contractUtil.retrieveAllVerifiedContractConstructsOfType(web3, Contract),
  ]).then(function([/* pendingList, */ minedList]){
    // t.equal(
    //   pendingList.length, expectedPending,
    //   "expected number of pending contracts is correct"
    // );
    t.equal(minedList.length, expectedMined, "expected number of mined contracts is correct");
    return [/* pendingList, */minedList];
  });
};
