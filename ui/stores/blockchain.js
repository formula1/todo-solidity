
const CLEAR = "clear";
const HANDLE_BLOCK = "handle_block";

const INITIAL_STATE = {
  foundContracts: [],
  currentContract: null,
}

functon retrieveLastBlocks(number){
  return function(dispatch){

  };
}

function connectListener(web3, store){
  var currentBlock = null
  web3


  function compareBlock(){

  }
}

function reducer(state=INITIAL_STATE, action){
  switch(action.type){
    case CLEAR: return INITIAL_STATE;
    case HANDLE_BLOCK: return Object.assign({},
      state,
      {
        foundContracts: state.foundContracts.concat(parse),
      }
    }
  }
}
