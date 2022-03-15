/**
 * @param el 需要推到屏幕顶部的元素
 * @return 还原元素位置的方法
 */
export const pushScreen = (
  el: HTMLElement,
  paddingBottom?: number
): (() => void) => {
  const { top } = el.getBoundingClientRect()
  const wrapper = document.getElementById('app')
  wrapper!.style.paddingBottom = `${paddingBottom ?? top}px`
  el.scrollIntoView()
  return () => {
    wrapper!.style.paddingBottom = '0'
  }
}

/**
 * @param funcs 多个函数
 * @returns 将多个函数从右到左串联起来
 */
export const compose = (...funcs: Function[]) => {
  // 没有传入函数则原样返回
  if (!funcs) {
    return (args: unknown) => args
  }
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce(
    (f1, f2) =>
      (...args: any[]) =>
        f1(f2(...args))
  )
}

/**
 * 获取 URL 中的参数
 * @param key
 */
export function getQueryString(key: string): string | null {
  const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return decodeURIComponent(r[2])
  }
  return null
}

export function getParams(): Record<string, string> {
  const result = {}
  let paramStr = window.location.search
  if (paramStr) {
    paramStr = paramStr.substring(1)
    const params = paramStr.split('&')
    for (let p = 0; p < params.length; p++) {
      // @ts-ignore
      result[params[p].split('=')[0]] = unescape(params[p].split('=')[1])
    }
  }
  return result
}

/**
 * url参数拼接
 * @param obj
 * @returns
 */
export const createQueryString = (obj: Record<string, any>, encode = true) => {
  return Object.entries(obj)
    .reduce((prev, [k, v]) => {
      if (v != null && v !== '') {
        prev += `${k}=${encode ? encodeURIComponent(v) : v}&`
      }
      return prev
    }, '?')
    .slice(0, -1)
}

/**
 * @description 深拷贝一个对象
 * @param source 源对象
 * @returns 返回一个新对象
 */
const deepCopy = (source: Record<string, any>) => {
  if (source === null || {} === source || [] === source) {
    return source
  }
  let newObject: any
  let isArray = false
  if (source instanceof Array) {
    newObject = []
    isArray = true
  } else {
    newObject = {}
  }
  for (const key of Object.keys(source)) {
    if (source[key] == null) {
      if (isArray) {
        newObject.push(null)
      } else {
        newObject[key] = null
      }
    } else {
      const sub =
        typeof source[key] === 'object' ? deepCopy(source[key]) : source[key]
      if (isArray) {
        newObject.push(sub)
      } else {
        newObject[key] = sub
      }
    }
  }
  return newObject
}

/**
 * 时效类型判断---重货包裹为SE0100、小票零担为SE0101
 *  @returns {boolean} 若为true表示为已经是重货，若为false则不是重货
 */
export const isAlreadyHeavyCargo = (productCode: string) => {
  return ['SE0101', 'SE0100'].indexOf(productCode) > -1
}
/**
 * 海关申报判断是否都是文件
 *  @returns {boolean} 若为true表示都是文件，若为false则存在物品
 * Array<{ [key: string]: string | number }>
 */
export const isAllFile = (data: Array<Record<string, string | number>>) => {
  let isFile = false
  if (data && data.length > 0) {
    isFile = data.every(item => {
      return item.name === '文件'
    })
  }
  return isFile
}

/**
 * 点击按钮，复制文本内容
 */
export const clipBoard = (text: string, success: Function, fail: Function) => {
  const element = document.createElement('textarea') // 直接构建input
  console.log('创建粘贴板元素', element)
  try {
    // Prevent zooming on iOS
    element.style.fontSize = '12pt'
    // Reset box model
    element.style.border = '0'
    element.style.padding = '0'
    element.style.margin = '0'
    // Move element out of screen horizontally
    element.style.position = 'absolute'
    element.style.left = '-9999px'
    // Move element to the same position vertically
    const yPosition = window.pageYOffset || document.documentElement.scrollTop
    element.style.top = `${yPosition}px`

    // element.setAttribute('readonly', '')
    element.value = text // 设置内容
    document.body.appendChild(element) // 添加临时实例

    element.select()
    element.setSelectionRange(0, element.value.length)
    console.log('选中复制文本：', element.value)
    // if (!isReadOnly) {
    //   element.removeAttribute('readonly')
    // }

    const status = document.execCommand('copy') // 执行复制
    console.log('复制状态：', status)
    document.body.removeChild(element) // 删除临时实例
    // 复制成功回调
    if (success && status) {
      success()
    } else if (fail) {
      fail()
    }
  } catch {
    // 复制失败回调
    if (fail) {
      fail()
    }
  }
}

/* 付款方式转换
 * @param paymethod
 * @returns
 */
export const toPaymethod = (paymethod: unknown) => {
  return paymethod === '4' ? '1' : paymethod
}

export const extraPopup = () => {
  const contentDom = document.querySelector('.ci-popup')
  const body = document.body
  const html = document.documentElement
  body.innerHTML = contentDom!.innerHTML
  body.className = ''
  body.className = 'extra-body'
  html.className = 'extra-document'
  // @ts-ignore
  const contentBox = document.querySelector('.content-box')
  contentBox!.className += 'extra-content'
  const btnBox = document.querySelector('.btn-box')
  btnBox!.innerHTML = '同意本条款，下次不用提醒我'
  // @ts-ignore
  btnBox.style.cssText = `
    color: red;
  `
}

export const arrAttrSplice = (array: any[], attr: string, mark: string) => {
  if (!array.length || !array[0][attr]) return ''
  const str = array.reduce((total, item, index, array) => {
    if (index === array.length - 1) {
      return total + item[attr]
    } else {
      return total + item[attr] + mark
    }
  }, '')
  return str
}

export const isNoEncode = (url: string) => {
  return url === decodeURIComponent(url)
}
