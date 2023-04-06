import req from './../https';

let prefix = (param: string) => {
  let pre = 'v1/experience';
  return pre + param
}

const experience = {
  insertOne(params: object) {
    return req('post', prefix(''), params)
  },
  updateOne(id: string, params: object) {
    return req('put', prefix(`/${id}`), params)
  },
  deleteOne(id: string) {
    return req('delete', prefix(`/${id}`))
  }
}

export default experience;