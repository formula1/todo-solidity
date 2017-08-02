const React = require("react");
const { Component } = React;
const GridView = require("./GridView");

module.exports = class TableList extends GridView {
  renderHeader(headerText){

  }
  render(){
    const { headers } = this.props;
    return <GridView>{
      headers.map((header, i)=>{
        return React.cloneElement(
          this.renderHeader(header), { rowIndex: 0, colIndex: i}
        );
      }).concat(this.props.items.reduce(function(totalArray, item, i){
        return
      }, []))
    }</GridView>
  }
};
