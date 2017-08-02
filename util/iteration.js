

module.exports.forLoopParrallel = function(start, length, run){
  var ps = [];
  for(var i = start; i < length; i++){
    ps.push(Promise.resolve(i).then(run));
  }
  return Promise.all(ps);
};

module.exports.forLoopSerial = function(start, length, run){
  var results = [];
  var i = start;
  return looper();

  function looper(){
    return run(i).then(function(result){
      results = results.concat([result]);
      i++;
      if(i === length){
        return results;
      }
      return looper();
    });
  }
};
