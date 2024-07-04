
// 打开页面
const openUrl = (url: string) => {
  window.open(url);
};
// 解析URL中参数的函数，返回一个对象，包含各个参数信息，若没有则返回null
function serilizeUrl(url: string) {
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
const isMobile = () => {
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
const isIOS = () => {
  if (window.navigator.userAgent.match(/(iPad|iPhone|iPod)/i)) {
    return true; //IOS系统
  } else {
    return false;
  }
}
// 生成随机范围整数
function randomInteger(min: number, max: number) {
  return Math.round(Math.random() * (max - min)) + min;
}
const callPhone = (phoneNumber: string) => {
  window.location.href = 'tel:' + phoneNumber.slice(0, 13)
}

// 将函数暴露出去
export {
  serilizeUrl,

  openUrl,

  isMobile,
  isIOS,
  randomInteger,
  callPhone
};
