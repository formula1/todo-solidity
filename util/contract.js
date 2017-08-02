const fs = require("fs");
const solc = require("solc");
const EVM = require("ethereumjs-vm");
const getCallerFile = require("get-caller-file");
const path = require("path");
const { promisify } = require("util");

const { forLoopParrallel } = require("./iteration");
const { getTransactionReceipt, getTransaction } = require("./transaction");

module.exports.requireSol = requireSol;
module.exports.constructContract = constructContract;
module.exports.isTransactionOfContractType = isTransactionOfContractType;
module.exports.resolveStructure = resolveStructure;

function requireSol(web3, filename){
  var callerFile = getCallerFile();
  var solToRequire = path.resolve(callerFile, "../", filename);
  let source = fs.readFileSync(solToRequire, "utf8");
  let compiledContract = solc.compile(source, 1);

  var contracts = compiledContract.contracts;

  return Object.keys(contracts).reduce(function(contractsAPI, contractName){
    const { bytecode, runtimeBytecode } = contracts[contractName];
    const abi = contracts[contractName].interface;
    var Contract = web3.eth.contract(JSON.parse(abi));

    Contract.runtimeBytecode = runtimeBytecode;
    Contract.bytecode = bytecode;
    Contract.name = contractName;
    contractsAPI[contractName] = Contract;
    return contractsAPI;
  }, {});
}

// module.exports.retrieveAllPendingContractConstructsOfType = function(web3, Contract){
//   var getBlock = promisify(web3.eth.getBlock.bind(web3.eth));
//
//   return getBlock("pending", false).then(function(block){
//     return Promise.all(block.transactions.map(function(hash){
//       return isTransactionOfContractType(web3, hash, Contract);
//     })).then(function(results){
//       var found = new Set();
//       return results.filter(function(result){
//         if(!result) return false;
//         if(found.has(result.contractAddress)) return false;
//         found.add(result.contractAddress);
//         return result;
//       });
//     });
//   }).then(function(results){
//     return results.reduce((fa, ra)=> fa.concat(ra), []);
//   });
// };

module.exports.retrieveAllVerifiedContractConstructsOfType = function(web3, Contract){
  var getBlockNumber = promisify(web3.eth.getBlockNumber.bind(web3.eth));
  var getBlock = promisify(web3.eth.getBlock.bind(web3.eth));

  return getBlockNumber().then(function(l){
    return forLoopParrallel(0, l, retrieveBlock);
  }).then(function(results){
    return results.reduce((fa, ra)=> fa.concat(ra), []);
  });

  function retrieveBlock(i){
    return getBlock(i, false).then(function(block){
      return Promise.all(block.transactions.map(function(hash){
        return isTransactionOfContractType(web3, hash, Contract);
      })).then(function(results){
        var found = new Set();
        return results.filter(function(result){
          if(!result) return false;
          if(found.has(result.contractAddress)) return false;
          found.add(result.contractAddress);
          return result;
        });
      });
    });
  }
};

function resolveStructure(p, keys){
  return p.then(function(values){
    return keys.reduce(function(obj, key, i){
      obj[key] = values[i];
      return obj;
    }, {});
  });
}

function isTransactionOfContractType(web3, transactionHash, Contract){
  var getCode = promisify(web3.eth.getCode.bind(web3.eth));
  return getTransaction(web3, transactionHash).then((transaction)=>{
    // this is a send transaction
    if(transaction.to !== "0x0"){
      throw "This is a send transaction";
    }
    return getTransactionReceipt(web3, transactionHash);
  }).then(function(receipt){
    if(!receipt.contractAddress){
      throw "No contract address found";
    }
    return getCode(receipt.contractAddress).then(function(code){
      var oldCode = "0x" + Contract.runtimeBytecode;
      if(oldCode !== code){
        throw "Found code is not the code we are looking for";
      }
      return receipt;
    });
  }).catch(function(e){
    if(typeof e === "string"){
      console.error(e);
      return false;
    }
    throw e;
  });
}

function constructContract(context, Contract, sendAccount, args){
  var contractData = Contract.new.getData.apply(
    Contract.new, args.concat([{ data: Contract.bytecode }])
  );
  return estimateGas(contractData).then(function(gasEstimate){
    var didResolve = false;
    return new Promise(function(res, rej){
      Contract.new.apply(Contract, args.concat([
        {
          from: sendAccount,
          data: Contract.bytecode,
          gas: gasEstimate
        }, function(err, contract){
          if(didResolve) return;// console.log("already resolved");
          didResolve = true;
          if(err) return rej(err);
          if(contract.address){
            return rej("contract has already been mined");
          }
          res(contract);
        }
      ]));
    });
  });
}

function estimateGas(code){

  //create a new VM instance
  //code needs to be a buffer
  return new Promise(function(res, rej){
    var vm = new EVM();
    code = new Buffer(code, "hex");
    vm.runCode({
      code: code,
      gasLimit: new Buffer("ffffffff", "hex")
    }, function(err, results){
      if(err) return rej(err);
      console.log("returned: " + results);
      res(results.gasUsed);
    });
  });
}
