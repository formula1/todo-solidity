import React, { Component, cloneElement, Children } from "react";

/*

Concept
- Router is a
  - First to pass, recieves the value
  - A component can
    - Be a list which checks
    - an inherited component
  - modify the props
  -

*/

export default FirstToPass;

function FirstToPass(props){
  var children = Children.toArray(props.children);
  if(children.length === 0) return null;

  var preProps = mapPropsForPass(props);
  var activeChild = findChild(children, preProps);
  var newProps = mapPropsForChild(props, activeChild.props);
  return cloneElement(activeChild, newProps);

  function mapPropsForPass(props){
    if(typeof props.mapPropsForPass !== "function"){
      var sanitizedProps = Object.assign({}, props);
      delete sanitizedProps.children;
      delete sanitizedProps.mapPropsForCheck;
      delete sanitizedProps.mapPropsForChild;
      return sanitizedProps;
    }
    return props.mapPropsForPass(props);
  }

  function findChild(children, props){
    var defaultChild = children[0];
    for(var i =0, l = children.length; i < l; i++){
      var child = children[i];
      var childProps = child.props;
      if(typeof childProps.doesPass === "function"){
        var sanitizedProps = Object.assign({}, props);
        if(childProps.doesPass(sanitizedProps, i)) return child;
      }
      if(childProps.isDefault){
        defaultChild = child;
      }
    }
    return defaultChild;
  }

  function mapPropsForChild(props, childProps){
    var sanitizedProps = Object.assign({}, props);
    delete sanitizedProps.children;
    delete sanitizedProps.mapPropsForCheck;
    delete sanitizedProps.mapPropsForChild;
    if(typeof props.mapPropsForChild !== "function") return null;
    return props.mapPropsForChild(props, childProps);
  }
}
