//书写品牌管理模块接口
import request from '@/utils/request';
//引入返回数据的ts类型
import type {TradeMarkResponseData,TradeMark} from './type'

//品牌管理模块接口地址
enum API {
  //获取已有品牌接口，原接口文档：get /admin/product/baseTrademark/{page}/{limit}
  //因为请求路径需要携带参数，所以不能
  TRADEMARK_URL= "/admin/product/baseTrademark/",
  //添加品牌
  ADDTRADEMARK_URL= "/admin/product/baseTrademark/save",
  //修改已有品牌
  UPDATETRADEMARK_URL= "/admin/product/baseTrademark/update",

}
//获取已有品牌接口的方法
//page：获取第几页 ---默认第一页
//limit：获取几个已有品牌的数据
export const reqHasTrademark = (page:number,limit:number) => request.get<any,TradeMarkResponseData>(API.TRADEMARK_URL+`${page}/${limit}`);

export const reqAddOrUpdateTrademark = (data:TradeMark) => {
  //如果有id，修改已有品牌
  if (data.id) {
    //该接口没有返回参数，直接定义为any
    return request.put<any,any>(API.UPDATETRADEMARK_URL,data);
  } else {
    //没有id，新增品牌
    return request.post<any,any>(API.ADDTRADEMARK_URL,data);
  }
}

