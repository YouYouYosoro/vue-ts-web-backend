//数据类型定义
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
//菜单数据与按钮数据的ts类型
export interface Permission {
  id: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: null
  toCode: null
  type: number
  status: null
  level: number
  children?: PermissionList
  select: boolean
}
//菜单数据与按钮数据的数组ts类型
export type PermissionList = Permission[]

//菜单接口返回的数据类型
export interface PermissionResponseData extends ResponseData {
  data: PermissionList
}

export interface MenuParams {
  id?: number
  code: string
  level: number
  name: string
  pid: number
}
