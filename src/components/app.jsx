import React, { Component } from "react";
import { readRemoteFile } from "react-papaparse";

export default class App extends Component {
  state = {
    results: [],
  };

  render() {
    return (
      <React.Fragment>
        <h4>Q8: JS Framework</h4>
        <p>
          This web app reads a CSV file from a remote location, parses the data
          and then orders the data in a hierarchy
        </p>
        <p>View the results in the console</p>
        <button onClick={this.handleClick}>Read ecoPortal data.txt</button>
      </React.Fragment>
    );
  }

  handleClick = () => {
    readRemoteFile(
      "https://raw.githubusercontent.com/ecoPortal/dev-test/master/data.txt",
      {
        complete: (results) => {
          var orderedHierarchy = orderHierarchy(
            generateUserList(results.data),
            "0"
          );
          console.log("Results:", orderedHierarchy);

          this.setState({ results: orderedHierarchy });
        },
      }
    );
  };
}

function generateUserList(results) {
  return results.map((data) => ({
    id: data[0],
    name: data[1],
    parentId: data[2] !== "" ? data[2] : "0",
    children: [],
  }));
}

function orderHierarchy(userList, parentId) {
  var results = [];

  for (var user in userList) {
    if (userList[user].parentId === parentId) {
      var children = orderHierarchy(userList, userList[user].id);

      if (children.length) {
        userList[user].children = children;
      }

      results.push(userList[user]);
    }
  }

  return results;
}
