import request from "@/utils/request.ts";

// 微服务对接统一授权
export const WfwGetUserInfo = (code: string, state: string) => {
  return request({
    url: `/WfwGetUserInfo`,
    method: "GET",
    params: {
      code: code,
      state: state,
    },
  });
};
export const GetData = () => {
  return request({
    url: `/item`,
    method: "GET",
  })
}
export const GetCategories = () => {
  return request({
    url: `/category`,
    method: "GET",
  })
}

export const GetProgramAvatar = () => {
  return request({
    url: `/program/getAvatar`,
    method: "GET",
  })
}