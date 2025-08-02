import request from '@/utils/request';
export const GetCategories = (params?: any) => {
  return request({
    url: `/category`,
    method: "GET",
    params,
  })
}
//删除网站
export const DeleteCategory = (id: number) => {
  return request({
    url: `/category/${id}`,
    method: "DELETE",
  })
}
//网站搜索接口
export const GetCategoryData = (data: any) => {
  return request({
    url: `/category/search`,
    method: "GET",
    params: data,
  })
}
//添加网站
export const AddCategory = (data: any) => {
  return request({
    url: `/category/add`,
    method: "POST",
    data,
  })
}
//修改网站
export const EditCategory = (data: any) => {
  return request({
    url: `/category/update`,
    method: "POST",
    data,
  })
}

// 别名导出，保持兼容性
export const UpdateCategory = EditCategory

//删除网站
export const DeleteItem = (id: number) => {
  return request({
    url: `/item/${id}`,
    method: "DELETE",
  })
}
//网站搜索接口
export const GetItemData = (data: any) => {
  return request({
    url: `/item/search`,
    method: "GET",
    params: data,
  })
}
//添加网站
export const AddItem = (data: any) => {
  return request({
    url: `/item/add`,
    method: "POST",
    data,
  })
}
//修改网站
export const EditItem = (data: any) => {
  return request({
    url: `/item/update`,
    method: "POST",
    data,
  })
}

// 别名导出，保持兼容性
export const UpdateItem = EditItem

// 获取系统设置
export const GetSystemSettings = () => {
  return request({
    url: `/system/settings`,
    method: "GET",
  })
}

// 更新系统设置
export const UpdateSystemSetting = (data: any) => {
  return request({
    url: `/system/setting/update`,
    method: "POST",
    data,
  })
}

// 管理员登录
export const AdminLogin = (data: any) => {
  return request({
    url: `/admin/login`,
    method: "POST",
    data,
  })
}