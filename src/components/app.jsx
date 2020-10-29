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
        <p>
          The raw JSON output will be shown below. To more easily navigate the
          results you can also view them in the console
        </p>
        <button onClick={this.handleClick}>Read ecoPortal data.txt</button>
        <div>
          <div>
            <pre>{JSON.stringify(this.state.results, null, 2)}</pre>
          </div>
        </div>
      </React.Fragment>
    );
  }

  /**
   * On click reads the remote document, generates the ordered hierarchy, and prints the results/sets the state
   */
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

/**
 * Maps the results from read CSV into a workable object
 */
function generateUserList(results) {
  return results.map((data) => ({
    id: data[0],
    name: data[1],
    parentId: data[2] !== "" ? data[2] : "0",
    children: [],
  }));
}

/**
 * Recursively generates a hierarchy of users and their children based on the parent ids
 */
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
