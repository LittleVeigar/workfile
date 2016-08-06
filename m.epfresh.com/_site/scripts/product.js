'use strict';

class FancyBox extends React.Component {

  constructor(props) {
    super();
    this.state = {
      index: 0,
      startX: 0,
      startY: 0,
      offsetX: 0,
      offsetY: 0
    }
  }

  scrollLeft() {
    var size = this.props.srcs.length;
    this.setState({index: this.state.index<(size-1)?(this.state.index+1):0});
  }

  scrollRight() {
    var size = this.props.srcs.length;
    this.setState({index: this.state.index>0?(this.state.index-1):(size-1)});
  }

  onTouchStart(event) {
    // 阻止触摸事件的默认行为
    event.preventDefault();
    var touch = event.touches[0];
    this.setState({
      startX: touch.pageX,
      startY: touch.pageY
    });
  }

  onTouchMove(event) {
    // 阻止触摸事件的默认行为
    event.preventDefault();

    // 当屏幕有多个touch或者页面被缩放过，就不执行move操作
    if (event.touches.length > 1 || event.scale && event.scale !== 1) return;

    var touch = event.touches[0];
    this.setState({
      offsetX: touch.pageX - this.state.startX,
      offsetY: touch.pageY - this.state.startY
    });
  }

  onTouchEnd(event) {
    if(this.state.offsetX > 50) {
      this.scrollRight();
    } else if(this.state.offsetX < -50) {
      this.scrollLeft();
    }
  }

  componentDidMount() {
    setInterval(() => {this.scrollLeft()}, 5000);
  }

  render() {
    var banners = this.props.srcs.map((item, index) => {
      var width = document.body.scrollWidth, height = width*0.75;
      return <li style={{width: width + 'px', height: height + 'px'}} className={index===this.state.index?'active':''} key={'item-'+index}><img src={item}/></li>
    });
    var indexes = this.props.srcs.map((item, index) => {
      return <li className={index===this.state.index?'active':''} key={'index-'+index}><span></span></li>
    });
    return (
      <div className="fancybox">
        <ul onTouchStart={this.onTouchStart.bind(this)} onTouchMove={this.onTouchMove.bind(this)} onTouchEnd={this.onTouchEnd.bind(this)} className="fancybox-items" style={{width: this.props.srcs.length*100 + '%', left: '-'+this.state.index*100+'%'}}>
        {banners}
        </ul>
        <ul className="fancybox-indexes">
        {indexes}
        </ul>
      </div>
    );
  }
}

class FixedBox extends React.Component {
  constructor(props) {
    super();
    this.state = {
      closed: false
    }
  }
  closeFixedbox() {
    this.setState({closed: true});
  }
  download() {

    var ua = navigator.userAgent.toLowerCase();

    // 微信
    if(/micromessenger/.test(ua)) {
      var backdrop = document.createElement('div');
      backdrop.style.cssText = 'position: fixed; background-color: rgba(0,0,0,0.6); left: 0; right: 0; top: 0; bottom: 0;';
      backdrop.innerHTML = '<div style="color: white; padding: 1em 1.25em 0 0;"><p style="text-align: right; "><img src="images/jiantou.png" width="33.33%"/></p><p style="margin: -0.8em 0 0 35%;">不能下载？</p><p style="margin: 0 0 0 35%;">请点击右上角用浏览器打开</p></div>';
      document.body.appendChild(backdrop);
      backdrop.onclick = function() {
        backdrop.remove();
      }
    } else {
      var downloadUrl;
      if(/iphone|ipad|ipod/.test(ua)) {
        downloadUrl = this.props.appInfo.ios.downloadUrl;
      } else if(/android/.test(ua)) {
        downloadUrl = this.props.appInfo.android.downloadUrl;
      }
      window.location.href = this.props.appInfo.urlSchema+'&type='+this.props.productType;
      setTimeout(() => {
      	window.location.href = downloadUrl;
      }, 500);
    }
  }
  render() {
    return (
      <div className={'fixedbox'+ (this.state.closed?' display-none':'')}>
        <div><button type="button" className="fixedbox-close" onClick={this.closeFixedbox.bind(this)}>×</button></div>
        <div className="logo"><img src="images/logo_87.png" width="32" height="32"/></div>
        <div className="">
          <p>产地直采 网上批发</p>
          <p>更快 更省 更赚钱！</p>
        </div>
        <div className="download"><button type="button" className="btn-download" onClick={this.download.bind(this)}>立即下载</button></div>
      </div>
    );
  }
}

class Tags extends React.Component {
  render() {
    var _tags = this.props.tags || [];
    var tags = _tags.map((item, index) => {
      return <span className="tag" key={'tag-'+index} style={{color: item.color, borderColor: item.color}}>{item.name}</span>
    });
    return (
      <div className={'product-tags'+ (_tags.length==0?' display-none':'')}>
      {tags}
      </div>
    );
  }
}

class Product extends React.Component {
  constructor(props) {
    super();
    this.state = {
      data: props.data || {banners:[], images:[], title: ''}
    }
  }
  loadInfo() {
    $.ajax({
      url: this.props.url,
      type: Request.type,
      dataType: 'jsonp',
      contentType: 'application/json;charset=UTF-8',
      data: this.props.postData,
      cache: true,
      success: function(data) {
        if(data && data.error) {
          alert(data.error.errorInfo);
        } else {
          this.setState({data: data.response});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }
  componentDidMount() {
    this.loadInfo();
  }
  render() {
    document.title = this.state.data.title + document.title;
    var images = this.state.data.images.map(function(item, index) {
      return <li key={'image-'+index}><img src={item}/></li>
    });
    return (
      <div className="content">
        <FancyBox srcs={this.state.data.banners}/>
        <div className="product-title">
            <h1>{this.state.data.title}</h1>
        </div>
        <Tags tags={this.state.data.tags}/>
        <div className="product-meta">
            <span className="product-meta-price">{this.state.data.price}</span>
            <span className={'product-meta-package'+(this.state.data.pack?'':' display-none')}>{this.state.data.pack}</span>
            <span> ({this.state.data.cityName})</span>
        </div>
        <div className={this.state.data.lowStockTip==""?"display-none":"product-warn"}>
            <p>{this.state.data.lowStockTip}</p>
        </div>
        <div className="product-info">
            <div><label>品名</label><span>{this.state.data.name}</span></div>
            <div><label>品种</label><span>{this.state.data.variety}</span></div>
            <div><label>产地</label><span>{this.state.data.origin}</span></div>
            <div><label>品牌</label><span>{this.state.data.brand}</span></div>
            <div><label>等级</label><span>{this.state.data.level}</span></div>
            <div><label>包装</label><span>{this.state.data.pack}</span></div>
        </div>
        <div className="product-desc">
          <hr/>
          <div>
              <label>商品简介</label>
              <p>{this.state.data.description}</p>
          </div>
        </div>
        <div className="product-images no-padding">
            <ul>{images}</ul>
        </div>
        <FixedBox appInfo={this.props.appInfo} id={this.props.postData.cityId} city={this.props.postData.parameters.productId} productType={this.state.data.type} />
      </div>
    );
  }
}

var hash = window.location.hash;
hash = hash.replace('#', '');
var parameters = hash.split('&');
var postData = {
  "cmd": "product/load",
  "cityId": parameters[1],
  "parameters": {
    "productId": parameters[0]
  }
};
var appInfo = {
  urlSchema: 'epfresh://product?id='+postData.parameters.productId+'&city='+postData.cityId,
  android: {
    downloadUrl: '',
    packageName: 'com.epfresh'
  },
  ios: {
    downloadUrl: '',
    bundleId: 'com.zxdz.epfresh'
  }
}

$.ajax({
  url: Request.url,
  data: {"cmd": "homepage/downloadUrl", "parameters": {}},
  type: Request.type,
  dataType: 'jsonp',
  contentType: 'application/json;charset=UTF-8',
  cache: true,
  async: false,
}).done(function (data) {
  data = data.response;
  appInfo.android.downloadUrl = data['appDownLoad.androidPurchase'];
  appInfo.ios.downloadUrl = data['appDownLoad.iosPurchase'];
}).fail(function() {
  alert('请求失败，请重试！');
});

ReactDOM.render(
  <Product url={Request.url} postData={postData} appInfo={appInfo} />,
  document.getElementById('wrapper')
);
