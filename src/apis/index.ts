import request from "@/utils/request.ts";

// 微服务对接统一授权
export const GetUserInfo = (code: string) => {
  return request({
    url: `/login`,
    method: "GET",
    params: {
      code: code
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
export const checkScanStatus = (scene: string) => {
  return request({
    url: `/program/checkScanStatus`,
    method: "GET",
    params: {
      scene: scene,
    },
  })
}