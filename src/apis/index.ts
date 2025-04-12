import request from "@/utils/request.ts";

// 微服务对接统一授权
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

