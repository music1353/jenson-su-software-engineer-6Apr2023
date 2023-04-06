import req from './../https';

let prefix = (param: string) => {
  let pre = 'v1/file';
  return pre + param
}

const file = {
  insertOne(params: object) {
    return req('post', prefix(''), params)
  },
  deleteOne(id: number) {
    return req('delete', prefix(`/${id}`))
  }
}

export default file;