# @sffs/http

基于 axios 的二次封装

## usage

```ts
import { Http } from '@sffs/http'

export const request = new Http({
  baseURL: '/',
  headers: {
    hehe: 'haha'
  },
  // 是否提示错误提示,默认设置为显示
  toast: true,
  handleError(res: any, toast?: boolean | undefined) {
    // dealWithMsg(res, toast)
    return Promise.resolve(res)
  },
  // 200 处理业务里面定义的错误
  handleRes(res: any) {
    if (!res?.data?.success) {
      // dealWithCustomError(res.data, this.toast)
      return Promise.resolve(res)
    }
    return res
  }
})
```
