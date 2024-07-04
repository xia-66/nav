import { defineStore } from "pinia";

// const wfwUserRoleSession = localStorage.getItem("wfwUserRole");
// let wfwUserRole = 0;
// if(wfwUserRoleSession){
//   wfwUserRole = parseInt(wfwUserRoleSession);
// }

export const useMainStore = defineStore("mainStore", {
  state: () => {
    return {
      role: 0, // 灵感小站角色
      userName: "", // 微服务用户姓名
      userNumber: "", // 微服务用户学号
      userSection: "", // 微服务用户所在部门
      userPhone: "", // 灵感小站用户手机号
      jwtToken: "", // jwt_token
      wfw_visit: null, // 微服务访问量
      unreadMessage: null, // 我的消息未读数量
      is_henau_lan: false, // 是否校园网
      // wfwUserRole: wfwUserRole, // 微服务用户身份0本科生 1研究生 2教职工
      services: null, // 服务列表
      baseUrl: '', // 后端接口根链接
      topNotice: [{
        item_id: 0,
        item_name: "请持续关注微服务平台，优质服务等你来使用。",
      }], // 顶部通知栏
      noticeList: [], // 公告列表
      campusServicePhone: [], // 校园服务电话
      bottomAlert: [], // 技术支持弹出链接
      release: '', // 微服务版本号
      ideasType: [], // 灵感小站建议类型
      businessFormList:[], //校内业务用表
      businessClassify:[],//校内业务用表分类
    };
  },
  getters: {},
  actions: {},
  persist: {
    enabled: true, // 开启数据缓存
  },
});
