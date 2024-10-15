//角色管理模块接口
import request from '@/utils/request'
import type { RoleResponseData, RoleData, MenuResponseData } from './type'

enum API {
  //获取全部的职位接口
  ALLROLE_URL = '/admin/acl/role/',
  //添加职位请求接口
  ADDROLE_URL = '/admin/acl/role/save',
  //编辑职位请求接口
  UPDATEROLE_URL = '/admin/acl/role/update',
  //获取所有的权限接口
  ALLPERMISSION_URL = '/admin/acl/permission/toAssign/',
  //编辑权限接口
  SETPERMISSION_URL = '/admin/acl/permission/doAssign/?',
  //删除职位接口
  REMOVEROLE_URL = '/admin/acl/role/remove/'
}

//获取全部的职位的请求方法
export const reqAllRoleList = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleResponseData>(API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`)

//添加职位请求接口请求方法|编辑职位请求接口方法
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}

//获取菜单列表请求方法
export const reqAllMenuList = (roleId: number) =>
  request.get<any, MenuResponseData>(API.ALLPERMISSION_URL + roleId)

//编辑权限接口请求方法
export const reqSetPermission = (roleId: number, permissionId: number[]) =>
  request.post(API.SETPERMISSION_URL + `roleId=${roleId}&permissionId=${permissionId}`)

//删除职位接口请求方法
export const reqRemoveRole = (roleId: number) =>
  request.delete<any, any>(API.REMOVEROLE_URL + roleId)
