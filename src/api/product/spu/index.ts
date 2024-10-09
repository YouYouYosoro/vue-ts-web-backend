//SPU管理模块接口
import request from '@/utils/request'
import type { HasSpuResponseData } from '@/api/product/spu/type'
enum API {
  HASSPU_URL = '/admin/product/'
}

//获取某一个三级分类下已有的SPU数据
export const reqHasSpu = (page: number, limit: number, category3Id: number | string) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`
  )
