//用户模块接口
import request from '@/utils/request'
import type { UserResponseData, User, AllRoleResponseData, SetRoleData } from './type'

//枚举地址
enum API {
  //获取全部已有用户账号信息
  ALLUSER_URL = '/admin/acl/user/',
  //添加一个新的用户账户
  ADDUSER_URL = '/admin/acl/user/save',
  //更新已有的用户账号
  UPDATEUSER_URL = '/admin/acl/user/update',
  //获取全部职位，当前账号拥有的职位接口
  ALLROLEURL = '/admin/acl/user/toAssign/',
  //分配职位接口
  SETROLE_url = '/admin/acl/user/doAssignRole',
  //单一账号删除
  DELETEUSER_URL = '/admin/acl/user/remove/',
  //批量账号删除
  DELETEALLUSER_URL = '/admin/acl/user/batchRemove'
}

//获取用户账号信息的接口方法
export const reqUserInfo = (page: number, limit: number, username: string) =>
  request.get<any, UserResponseData>(API.ALLUSER_URL + `${page}/${limit}/?username=${username}`)

//添加或者更新已有用户的接口
export const reqAddOrUpdateUser = (data: User) => {
  //携带参数有id：更新，无id：添加
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}

//获取全部职位，当前账号拥有的职位方法
export const reqAllRole = (userId: number) =>
  request.get<any, AllRoleResponseData>(API.ALLROLEURL + userId)

//给用户分配职位的接口方法
export const reqSetUserRole = (data: SetRoleData) => request.post<any, any>(API.SETROLE_url, data)

//单一账号删除
export const reqRemoveUser = (userId: number) =>
  request.delete<any, any>(API.DELETEUSER_URL + userId)

//批量账号删除
export const reqSelectUser = (idList: number[]) =>
  request.delete(API.DELETEALLUSER_URL, { data: idList })
