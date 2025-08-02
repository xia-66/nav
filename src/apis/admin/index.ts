import request from '/@/utils/request';
export const GetCategories = () => {
  return request({
    url: `/category`,
    method: "GET",
  })
}
//删除网站
export const DeleteCategory = (id) => {
  return request({
    url: `/category/${id}`,
    method: "DELETE",
  })
}
//网站搜索接口
export const GetCategoryData = (data) => {
  return request({
    url: `/category/search`,
    method: "GET",
    params: data,
  })
}
//添加网站
export const AddCategory = (data) => {
  return request({
    url: `/category/add`,
    method: "POST",
    data,
  })
}
//修改网站
export const EditCategory = (data) => {
  return request({
    url: `/category/update`,
    method: "POST",
    data,
  })
}

//删除网站
export const DeleteItem = (id) => {
  return request({
    url: `/item/${id}`,
    method: "DELETE",
  })
}
//网站搜索接口
export const GetItemData = (data) => {
  return request({
    url: `/item/search`,
    method: "GET",
    params: data,
  })
}
//添加网站
export const AddItem = (data) => {
  return request({
    url: `/item/add`,
    method: "POST",
    data,
  })
}
//修改网站
export const EditItem = (data) => {
  return request({
    url: `/item/update`,
    method: "POST",
    data,
  })
}