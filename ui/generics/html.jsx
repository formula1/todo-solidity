import React from "react";

export function Box(props){
  return (<div {...props} >{props.children}</div>);
}

export function Text(props){
  var text = React.Children.only(props.children);
  if(typeof text !== "string"){
    throw new Error("text can only recieve a text child");
  }
  return (<span {...props} >{text}</span>);
}
