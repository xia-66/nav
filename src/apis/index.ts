import request from "@/utils/request";

// 微服务对接统一授权
const WfwGetUserInfo = (code: string, state: string) => {
  return request({
    url: `/WfwGetUserInfo`,
    method: "GET",
    params: {
      code: code,
      state: state,
    },
  });
};

export {
  WfwGetUserInfo,
};
