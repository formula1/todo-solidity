
const UPDATE_SUB_PATH = "APPLICATION_STATE_UPDATE_SUB_PATH";
const REMOVE_STATE_BINDER = "APPLICATION_STATE_REMOVE_STATE_BINDER";
const ADD_STATE_BINDER = "APPLICATION_STATE_ADD_STATE_BINDER";

const INITIAL_STATE = {
  stateBinder: null,
  state: {},
};

export function reducer(state=INITIAL_STATE, action){
  switch(action.type){
    case ADD_STATE_BINDER:
      action.payload.construct();
      return {
        stateBinder: action.payload,
        state: {}
      };
    case REMOVE_STATE_BINDER:
      if(state.stateBinder === null) return state;
      state.stateBinder.deconstruct();
      return {
        stateBinder: null,
        state: {}
      };
    case UPDATE_SUB_PATH:
      if(state.stateBinder === null) return state;
      return {
        stateBinder: state.stateBinder,
        state: updateSubPath(state.state, action.payload),
      };
  }
}

function updateSubPath(obj, { path, value }){
  if(typeof value === "undefined"){
    throw new Error("undefined values are not accepted");
  }
  if(value === null) return deleteSubPath(obj, path);
  else return createOrSetSubPath(obj, path, value);
}

function createOrSetSubPath(obj, path, value){
  path = sanitizePath(path);
  var lastIndex = path.length - 1;
  return path.reduce(function(context, part, i){
    if(i === lastIndex){
      context[part] = value;
      return obj;
    }
    if(!(part in context)){
      context[part] = {};
    }
    return context[part];
  }, obj);
}

function deleteSubPath(obj, path){
  path = sanitizePath(path);
  var context = obj;
  var lastReleventContext = null;
  var lastReleventKeys = [];
  var alreadyEmpty = path.some(function(part){
    if(!(part in context)) return true;
    if(Object.keys(context).length > 1){
      lastReleventContext = context;
      lastReleventKeys = [part];
    }else{
      lastReleventKeys = lastReleventKeys.concat([part]);
    }
    context = context[part];
    return false;
  });

  if(alreadyEmpty) return obj;
  delete lastReleventContext[lastReleventKeys[0]];
  return obj;
}

function sanitizePath(path){
  path = path.split(".");
  if(path[0] === "") path.shift();
  if(path[path.length - 1] === "") path.pop();
  return path;
}
