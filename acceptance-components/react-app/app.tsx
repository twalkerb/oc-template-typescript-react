import React from "react";
import {
  withDataProvider,
  withSettingProvider
} from "oc-template-typescript-react-compiler/utils";

import styles, { superSpecial } from "./styles.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name
    };
  }

  componentDidMount() {
    this.props.getData({ name: "Pippo" }, (err, data) => {
      this.setState({ name: data.name });
    });

    // Don't do this if you don't want to be fired
    oc.events.on("oc:componentDidMount", (ev, props) => console.log(props));
  }

  render() {
    const { getSetting } = this.props;
    const { name } = this.state;
    return (
      <div className={styles["just-special"]}>
        <h1 className={superSpecial} id="1">
          Hello {name}
        </h1>
        <p>component name: {getSetting("name")}</p>
        <p>component version: {getSetting("version")}</p>
        <p>registry baseUrl: {getSetting("baseUrl")}</p>
        <p>component staticPath: {getSetting("staticPath")}</p>
      </div>
    );
  }
}

export default withSettingProvider(withDataProvider(App));
