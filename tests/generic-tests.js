const { initialize, mineNumberOfBlock, getAccounts } = require("../util/chain");
const { wrapFn } = require("./util/catch");
const { constructContract } = require("../util/contract");

const createAndTestPendingContract = require("./helpers/pending-contract");
const mineAndTestContracts = require("./helpers/mined-contract");
const testContractCounts = require("./helpers/contract-counts");

const NOT_ENOUGH_FUNDS_REGEXP = new RegExp(
  `^sender doesn't [\\w ]+. The upfront cost is: (\\d+) [\\w ]+ account only has: (\\d+)$`
);

module.exports = function(t, contractName){
  return t.test("Can compile TaskContract", wrapFn(function(tt){
    return initialize().then(function(){
      tt.pass("successfully compiles");
    });
  })).then(function(){
    return t.test(
      "mining blocks should not create contracts if there is no pending transaction",
      wrapFn(function(tt){
        return initialize([
          { balance: "0xffffffff", index: 0 },
          { balance: "0x0", index: 1 }
        ]).then(function(context){
          const { provider, Contracts } = context;
          const Contract = Contracts[contractName];
          return testContractCounts(
            tt, context, Contract,/* 0, */ 0
          ).then(function(){
            return mineNumberOfBlock(provider, 3);
          }).then(function(){
            return testContractCounts(tt, context, Contract,/* 0, */ 0);
          });
        });
      }
    ));
  }).then(function(){
    return t.test("Can create a task", wrapFn(function(tt){
      return initialize([
        { balance: "0xffffffff", index: 0 },
        { balance: "0x0", index: 1 }
      ]).then(function(context){
        const { provider, Contracts } = context;
        const Contract = Contracts[contractName];

        return mineNumberOfBlock(provider, 3).then(function(){
          return getAccounts(provider);
        }).then(function(accounts){
          var sendAccount = accounts[0];
          return createAndTestPendingContract(
            tt, context, sendAccount, function(){
              return constructContract(
                context, Contract,
                sendAccount, ["Hello World", "https://www.linux.org/"]
              );
            }
          ).then(function(unminedContract){
            return testContractCounts(tt, context, Contract, /*1,*/ 0).then(function(){
              return mineAndTestContracts(
                tt, context, Contract, sendAccount, [unminedContract]
              );
            });
          });
        });
      });
    }));
  }).then(function(){
    return t.test("Cannot create a task without enough money", wrapFn(function(tt){
      return initialize([
        { balance: "0xff", index: 0 },
        { balance: "0x0", index: 1 }
      ]).then(function(context){
        const { provider, Contracts } = context;
        const Contract = Contracts[contractName];

        return getAccounts(provider).then(function(accounts){
          var sendAccount = accounts[0];
          return createAndTestPendingContract(
            tt, context, sendAccount, function(){
              return constructContract(
                context, Contract,
                sendAccount, ["Hello World", "https://www.linux.org/"]
              );
            }
          ).then(function(/* unminedContract */){
            return testContractCounts(tt, context, Contract, /* 1, */ 0).then(function(){
              return mineNumberOfBlock(provider, 2).then(function(){
                throw new Error("successfully mined");
              }, function(e){
                tt.pass("recieved an error");
                var matches = NOT_ENOUGH_FUNDS_REGEXP.exec(e.message);
                tt.ok(matches, "error is the expected error");
                tt.ok(parseInt(matches[1]) > parseInt(matches[2]), "Values are expected");
              });
            });
          });
        });
      });
    }));
  }).then(function(){
    return t.test("Can create a and mine multiple tasks at once", wrapFn(function(tt){
        return initialize([
          { balance: "0xffffffff", index: 0 },
          { balance: "0x0", index: 1 }
        ]).then(function(context){
          const { provider, Contracts } = context;
          const Contract = Contracts[contractName];

          return getAccounts(provider).then(function(accounts){
            var sendAccount = accounts[0];
            return createAndTestPendingContract(
              tt, context, sendAccount, function(){
                return constructContract(
                  context, Contract,
                  sendAccount, ["Hello World", "https://www.linux.org/"]
                );
              }
            ).then(function(a){
              return createAndTestPendingContract(
                tt, context, sendAccount, function(){
                  return constructContract(
                    context, Contract,
                    sendAccount, ["Hello World", "https://www.linux.org/"]
                  );
                }
              ).then(function(b){
                return [a, b];
              });
            }).then(function(unminedContracts){
              return testContractCounts(tt, context, Contract,/* 2, */ 0).then(function(){
                return mineAndTestContracts(
                  tt, context, Contract, sendAccount, unminedContracts
                );
              });
            });
          });
        });
      }
    ));
  });
};
