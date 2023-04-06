import req from './../https';

let prefix = (param: string) => {
  let pre = 'v1/auth';
  return pre + param
}

const auth = {
  register(params: object) {
    return req('post', prefix('/register'), params)
  },
  login(params: object) {
    return req('post', prefix('/login'), params)
  },
  logout() {
    return req('post', prefix('/logout'))
  },
  findOne(params: object) {
    return req('put', prefix(''), params)
  }
}

export default auth;