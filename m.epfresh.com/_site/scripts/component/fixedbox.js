'use strict';

class FixedBox extends React.Compontent {
  constructor(props) {
    super();
    this.state = {
      closed: props.closed || false
    }
  }
  closeFixedbox() {

  }
  render() {
    return (
      <div className="fixedbox">
        <button type="button" className="fixedbox-close" onClick={this.closeFixedbox.bind(this)}>×</button>
        <img src="images/logo_87.png" width="50" height="50" className="logo"/>
        <div className="logo">
          <p>产地直采 网上批发</p>
          <p>更快 更省 更赚钱！</p>
        </div>
        <button type="button" className="btn-download" onclick="">立即下载</button>
      </div>
    );
  }
}

module.exports.FixedBox = FixedBox;
