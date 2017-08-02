


module.exports = function(fn){
  return function(t){
    return Promise.resolve(t).then(fn).then(function(){
      t.end();
    }, function(err){
      console.log("error one", err);
      t.fail(err);
      t.end();
    });
  };
};

module.exports.wrapFn = function(fn){
  return function(t){
    return Promise.resolve(t).then(fn).then(function(){
      t.end();
    });
  };
};
