import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  Method,
  AxiosError,
} from 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    interceptorRequest?: (config: AxiosRequestConfig) => AxiosRequestConfig
    handleError?: (error: any, toast?: boolean) => any
    handleRes?: (res: any) => unknown
    getOrigin?: boolean // 是否需要获取原始值，在获取原始的时候，handleRes 不会对 response 进行任何处理
    toast?: boolean
  }
}

export default class Vxios {
  instance: AxiosInstance
  // 默认请求设置
  defaultConfig: AxiosRequestConfig = {
    timeout: 10000,
  }

  private config: AxiosRequestConfig
  constructor(config: AxiosRequestConfig) {
    this.config = config
    this.instance = axios.create({ ...this.defaultConfig, ...this.config })
    // 请求拦截（打开 loading 之类的操作）
    this.interceptorRequest()
    // 响应拦截（对请求进行自定义处理）
    // this.interceptorResponse()
  }

  interceptorRequest = () => {
    this.instance.interceptors.request.use(
      this.config?.interceptorRequest || ((v: any) => v),
      this.config?.handleError || ((error: AxiosError) => error)
    )
  }

  // 请求方法柯里化
  request =
    (method: Method, url: string, config?: AxiosRequestConfig) =>
    (params?: Record<string, any>) => {
      return this.instance
        .request({
          // 对请求处理
          // transformRequest: (data: { constructor: { new(form?: HTMLFormElement | undefined): FormData; prototype: FormData } }, header: any) => {
          //   if (config?.headers) {
          //     header = { ...header, ...config.headers }
          //   }
          //   // 如果请求参数是 FormData，加上响应的头部
          //   if (data?.constructor === FormData) {
          //     header = { ...header, 'Content-Type': 'application/x-www-form-urlencoded' }
          //   }
          //   return data
          // },
          ...config,
          method,
          url,
          ...params,
        })
        .then(
          (res: any) =>
            !config?.getOrigin && config?.handleRes
              ? config.handleRes(res)
              : res,
          (err) =>
            config?.handleError
              ? config?.handleError(err, config?.toast)
              : (err: any) => Promise.reject(err)
        )
        .catch((err) =>
          config?.handleError
            ? config?.handleError(err, config?.toast)
            : (err: any) => Promise.reject(err)
        )
    }

  // 获取原始 Axios 实例
  getBareInstance = () => axios.create()
  // 获取初始携带的 header
  getHeaders = () => this.config.headers
  get(url: string, config?: AxiosRequestConfig) {
    return (params?: Record<string, any>) =>
      this.request('get', url, { ...this.config, ...config })({ params })
  }

  post(url: string, config?: AxiosRequestConfig) {
    return (params: Record<string, any>) =>
      this.request('post', url, { ...this.config, ...config })({ data: params })
  }

  postQuery(url: string, config?: AxiosRequestConfig) {
    return (params: Record<string, any>) =>
      this.request('post', url, { ...this.config, ...config })({ params })
  }

  postForm(url: string, config?: AxiosRequestConfig) {
    return (params?: any) =>
      this.request('post', url, {
        ...this.config,
        ...config,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      })({ data: params })
  }
}
