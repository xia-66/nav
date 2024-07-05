
// 打开页面
export function openUrl(url: string) {
  window.open(url);
};
// 解析URL中参数的函数，返回一个对象，包含各个参数信息，若没有则返回null
export function serilizeUrl(url: string) {
  let urlObj: Object = {};
  if (/\?/.test(url)) {
    let urlStr = url.split("?")[1];
    let urlArr = urlStr.split("&");
    for (let i = 0; i < urlArr.length; i++) {
      let urlItem = urlArr[i];
      let item = urlItem.split("=");
      urlObj[item[0]] = item[1];
    }
    return urlObj;
  }
  return null;
}
// 判断是否为移动端
export function isMobile() {
  if (
    window.navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
  ) {
    return true; // 移动端
  } else {
    return false; // PC端
  }
};
// 判断是否为iOS系统
export function isIOS() {
  if (window.navigator.userAgent.match(/(iPad|iPhone|iPod)/i)) {
    return true; //IOS系统
  } else {
    return false;
  }
}
// 生成随机范围整数
export function randomInteger(min: number, max: number) {
  return Math.round(Math.random() * (max - min)) + min;
}
export function callPhone(phoneNumber: string) {
  window.location.href = 'tel:' + phoneNumber.slice(0, 13)
}

export function judgeBgType(value) {
  let tag = undefined;
  if (typeof value === 'string') {
    if (/^(((https?:\/\/)|(www\.))|((([0-9]{1,3}\.){3}[0-9]{1,3})|localhost)).+(gif|png|jpe?g)$/.test(value) || /img\//.test(value)) {
      tag = 'img';
    } else if (/^#[0-9a-fA-F]+$/.test(value)) {
      tag = 'color';
    } else if (/^data:image/.test(value)) {
      tag = 'base64';
    }
  } else {
    tag = 'module';
  }
  return tag;
}
export function handleURL(url = '', data = {}) {
  // 判断传输data数据是否是空对象，通过Object.keys获取对象属性数值，判断如果等于零就不执行
  if (Object.keys(data).length !== 0) {
    url = url.replace(/\/$/, '') + '?' // 如果链接尾部带有"/"则替换成为空字符，拼接"?"字符
    let params = ''
    for (const [name, value] of Object.entries(data)) {
      params += '&' + name + '=' + encodeURIComponent(value) // 将参数转变成为url编码后通过&name=参数拼接
    }
    params = params.replace(/^&/, '') // 利用正则去除参数中的第一个&符号
    url = url + params
  }
  return url // 返回URL
}

export class AF {
  constructor(scope, delay = 10) {
    this.delay = delay;
    this.timer = null;
    this.previous = 0;
    this.now = 0;
    this.scope = scope;
  }
  run(func, param) {
    const me = this.scope;
    this.now = new Date().getTime();
    if (this.now - this.previous < this.delay) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(
      function() {
        func.call(me, param);
        this.timer = null;
      }.bind(this),
      this.delay,
    );
    this.previous = this.now;
  }
}
