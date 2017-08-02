const React = require("react");

const { Component } = React;

module.exports = class GridView extends Component {

  render(){
    const children = React.Children.toArray(this.children);
    const { colWidths, rowHeights } = this.props;

    const grid = children.reduce(function(rows, item){
      var rowIndex = item.props.row;
      var colIndex = item.props.col;
      if(typeof rowIndex !== "number"){

      }
      if(typeof colIndex !== "number"){

      }
    }, {});
  }
}
