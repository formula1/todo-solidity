const catchError = require("../util/catch");

module.exports = function(t){
  return new Promise(function(res){
    t.onFinish(res);
  });
};

module.exports.wrapTest = function(t, str, fn){
  console.log("before promise");
  return new Promise(function(res, rej){
    console.log("before test");
    t.test(str, function(tt){
      console.log("before run");
      catchError(fn)(tt).then(function(){
        console.log("done a");
        res();
      }, rej);
    });
  }).then(function(){
    console.log("after promise");
  });
};
