//书写品牌管理模块接口
import request from '@/utils/request';
//品牌管理模块接口地址
enum API {
  //获取已有品牌接口，原接口文档：get /admin/product/baseTrademark/{page}/{limit}
  //因为请求路径需要携带参数，所以不能
  TRADEMARK_URL= "/admin/product/baseTrademark/"
}
//获取已有品牌接口的方法
//page：获取第几页 ---默认第一页
//limit：获取几个已有品牌的数据
export const reqHasTrademark = (page:number,limit:number) => request.get<any,any>(API.TRADEMARK_URL+`${page}/${limit}`);