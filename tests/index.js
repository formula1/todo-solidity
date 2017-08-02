var { promisify } = require("util");
var test = require("tap");

var { constructContract } = require("../util/contract");
const { initialize, mineNumberOfBlock, getAccounts } = require("../util/chain");

const constructAndMine = require("./helpers/construct-and-mine");

const catchError = require("./util/catch");
const { wrapFn } = require("./util/catch");

var genericTests = require("./generic-tests");

const TODO_TASK_NAME = ":ToDoTask";

test.test("Generic Tests", wrapFn(function(t){
  return genericTests(t, TODO_TASK_NAME);
})).then(function(){
  return test.test("Task", wrapFn(function(t){
    return t.test("Should fail if title too small", wrapFn(function(tt){
      return initialize([
        { balance: "0xffffffff", index: 0 },
        { balance: "0x0", index: 1 }
      ]).then(function(context){
        const { Contracts } = context;
        const TaskContract = Contracts[TODO_TASK_NAME];
        return constructAndMine(
          tt, context, TaskContract, ["Hel", "https://www.linux.org/"]
        ).then(function(){
          throw new Error("successfully mined");
        }, function(e){
          tt.pass("recieved an error");
          tt.ok(e, "The error is there");
        });
      });
    })).then(function(){
      return t.test("Should fail if title too large", wrapFn(function(tt){
        return initialize([
          { balance: "0xffffffff", index: 0 },
          { balance: "0x0", index: 1 }
        ]).then(function(context){
          const { Contracts } = context;
          const TaskContract = Contracts[TODO_TASK_NAME];
          return constructAndMine(
            tt, context, TaskContract, ["Hello World!".repeat(1000), "https://www.linux.org/"]
          );
        }).then(function(){
          throw new Error("successfully mined");
        }, function(e){
          tt.pass("recieved an error");
          tt.ok(e, "The error is there");
        });
      }));
    }).then(function(){
      return t.test("Can update title for task", wrapFn(function(tt){
        return initialize([
          { balance: "0xffffffff", index: 0 },
          { balance: "0x0", index: 1 }
        ]).then(function(context){
          const { Contracts } = context;
          const TaskContract = Contracts[TODO_TASK_NAME];
          return constructAndMine(
            t, context, TaskContract, ["Hello World!".repeat(1000), "https://www.linux.org/"]
          );
        }).then(function(){
          throw new Error("successfully mined");
        }, function(e){
          tt.pass("recieved an error");
          tt.ok(e, "The error is there");
        });
      }));
    }).then(function(){
      return t.test("Can add bounty to task", wrapFn(function(tt){
        return initialize([
          { balance: "0xffffffff", index: 0 },
          { balance: "0x0", index: 1 }
        ]).then(function(context){
          const { provider, TaskContract } = context;

          return chainUtil.getAccounts(provider).then(function(accounts){
            var sendAccount = accounts[0];
          });
        });
      }));
    }).then(function(){
      return t.test("Can cancel bounty on task", wrapFn(function(tt){
        return initialize([
          { balance: "0xffffffff", index: 0 },
          { balance: "0x0", index: 1 }
        ]).then(function(context){
          const { provider, TaskContract } = context;

          return chainUtil.getAccounts(provider).then(function(accounts){
            var sendAccount = accounts[0];
          });
        });
      }));
    }).then(function(){
      return t.test("Can add solution to task", wrapFn(function(tt){
        return initialize([
          { balance: "0xffffffff", index: 0 },
          { balance: "0x0", index: 1 }
        ]).then(function(context){
          const { provider, TaskContract } = context;

          return chainUtil.getAccounts(provider).then(function(accounts){
            var sendAccount = accounts[0];
          });
        });
      }));
    }).then(function(){
      return t.test("Can add cancel solution", wrapFn(function(tt){
        return initialize([
          { balance: "0xffffffff", index: 0 },
          { balance: "0x0", index: 1 }
        ]).then(function(context){
          const { provider, TaskContract } = context;

          return chainUtil.getAccounts(provider).then(function(accounts){
            var sendAccount = accounts[0];
          });
        });
      }));
    }).then(function(){
      return t.test("Can accept solution", wrapFn(function(tt){
        return initialize([
          { balance: "0xffffffff", index: 0 },
          { balance: "0x0", index: 1 }
        ]).then(function(context){
          const { provider, TaskContract } = context;

          return chainUtil.getAccounts(provider).then(function(accounts){
            var sendAccount = accounts[0];
          });
        });
      }));
    }).then(function(){
      return t.test("Can cancel a task", wrapFn(function(tt){
        return initialize([
          { balance: "0xffffffff", index: 0 },
          { balance: "0x0", index: 1 }
        ]).then(function(context){
          const { provider, TaskContract } = context;

          return chainUtil.getAccounts(provider).then(function(accounts){
            var sendAccount = accounts[0];
          });
        });
      }));
    });

  }));
}).then(function(){
  test.end();
  process.exit();
});
