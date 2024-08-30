//createUserList:每次函数执行会返回一个数组，数组里面包含两个用户详细
function createUserList() {
  return [
    {
      userId: 1,
      avatar:
        'https://img.picgo.net/2024/08/21/IMG_183720240712-173206d25432ace335678f.jpg',
      username: 'admin',
      password: '111111',
      desc: '平台管理员',
      roles: ['平台管理员'],
      buttons: ['cuser.detail'],
      routes: ['home'],
      token: 'Admin Token',
    },
    {
      userId: 2,
      avatar:
        'https://img.picgo.net/2024/08/21/IMG_183720240712-173206d25432ace335678f.jpg',
      username: 'system',
      password: '1111111',
      desc: '系统管理员',
      roles: ['系统管理员'],
      buttons: ['cuser.detail', 'cuser.user'],
      routes: ['home'],
      token: 'Admin Token',
    },
  ]
}

//对外暴露一个数组:数组里面包含两个接口
//登录假的接口
//获取用户信息的假的接口
export default [
  //用户登录接口
  {
    url: '/api/user/login',//请求地址
    method: 'POST',//请求方式
    response: ({ body }) => {
      //获取请求体携带过来的用户名与密码
      const { username, password } = body;
      //调用获取用户信息函数，用于判断是否有此用户
      const checkUser = createUserList().find(
        (item) => item.username === username && item.password === password,
      )
      //没有用户返回失败信息
      if (!checkUser) {
        return {
          code: 201,
          data: {
            message: '账号或者密码不正确'
          }
        }
      }
      //如果有返回成功信息
      const {token} = checkUser
      return {
        code: 200,
        data: {
          token
        }
      }
    },
  },
  // 获取用户信息
  {
    url: '/api/user/info',
    method: 'GET',
    response: (request) => {
      //获取请求头携带token
      const token = request.headers.token;
      //产看用户信息是否包含有次token用户
      const checkUser = createUserList().find((item) => item.token === token)
      //没有返回失败的信息
      if (!checkUser) {
        return {
          code: 201,
          data: {
            message: '获取用户信息失败'
          }
        }
      }
      //如果有返回成功信息
      return {
        code: 200,
        data: {
          checkUser
        }
      }
    },
  },
]