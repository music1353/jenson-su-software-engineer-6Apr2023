import req from './../https';

let prefix = (param: string) => {
  let pre = 'v1/profile';
  return pre + param
}

const profile = {
  create(params: object) {
    return req('post', prefix(''), params)
  },
  me() {
    return req('get', prefix('/me'))
  },
  updateOne(id: number, params: object) {
    return req('put', prefix(`/${id}`), params)
  },
  updateOneSetting(id: number, params: object) {
    return req('put', prefix(`/${id}/setting`), params)
  },
  findOneByUid(uid: string) {
    return req('get', prefix(`/user/${uid}`))
  },
  pass(params: object) {
    return req('post', prefix('/pass'), params)
  }
}

export default profile;