'use strict';

class FancyBox extends React.Compontent {
  render() {
    var items = this.props.data.map(function(item) {
      return (
        <li><a href="item.href"><img src="item.src" alt="item.title" title="item.title"></a></li>
      );
    });

    return (
      <div className="fancybox">
        <ul>
          <li><a href="#"><img src="" alt=""></a></li>
        </ul>
      </div>
    );
  }
}

module.exports.FancyBox = FancyBox;
