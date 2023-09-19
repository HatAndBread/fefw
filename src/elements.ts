import { allHtmlElements } from "./all-html-elements"
import { allListeners } from "./all-listeners"
import { register, ensureComponentId } from "./register"
import { useCreator } from "./use"
import kebab from "lodash.kebabcase"

function handleOptions(options: ElementOptions, element: HTMLElement, state: State) {
  const keys = Object.keys(options)
  for (let i = 0; i < keys.length; i++) {
    let option = keys[i]
    const value = options[option]
    if (option.match(`^data[A-Z]`)) {
      option = kebab(option)
    }
    if (option === "style" && Object.getPrototypeOf(value) === Object.prototype) {
      let style = ""
      Object.entries(value).forEach(([k, v]) => {
        style += `${kebab(k)}:${v};`
      })
      element.setAttribute("style", style)
    } else if (option === "text") {
      element.innerText = value
    } else if (allListeners.includes(option)) {
      if (typeof value !== "function") {
        throw new Error(`Expected listener ${option} to be function but was: ${typeof value}`)
      } else {
        //@ts-ignore
        element[option] = value
      }
    } else {
      element.setAttribute(option, typeof value === "function" ? state[value()] : value)
    }
  }
}

const elements = (
  state: State,
  oldRoot: undefined | HTMLElement,
  regenerate: any,
  appId: string,
  firstRender?: true
) => {
  const obj = {} as ElementList
  obj.get = (key: string) => obj[key]
  let nesting = 0
  let nestingArr: number[] = []
  let nestedEls: (HTMLElement)[] = []
  let lastEl: HTMLElement
  allHtmlElements().forEach(el => {
    //@ts-ignore
    obj[el] = function (): ElementWrapper {
      const text: string | undefined = Array.from(arguments).find(a => typeof a === "string" || typeof a === "number")
      const options: {[key: string]: string} = Array.from(arguments).find(a => Object.getPrototypeOf(a) === Object.prototype) || {}
      const callback: Function | undefined = Array.from(arguments).find(a => typeof a === "function")
      if (text) options.text = text
      if (callback) nesting += 1
      nestingArr.push(nesting)
      const element = document.createElement(el)
      if (nesting > (nestingArr[nestingArr.length - 2] || 0)) {
        nestedEls.push(element)
        if (lastEl) {
          lastEl.appendChild(element)
        } else {
          if (oldRoot) {
            // Add ID to already existing components
            ensureComponentId(oldRoot, element as HTMLElement)
          } else {
            // Set id for new components
            register(element as HTMLElement, state, regenerate, appId)
          }
        }
        lastEl = element
      } else if (nesting < nestingArr[nestingArr.length - 2]) {
        nestedEls.splice(nesting, nestedEls.length)
        lastEl = nestedEls[nestedEls.length - 1]
        lastEl.appendChild(element)
      } else {
        lastEl.appendChild(element)
      }
      handleOptions(options, element as HTMLElement, state)
      const wrapper = createElementWrapper(element as HTMLElement, appId, obj)
      if (typeof callback === "function") {
        callback(wrapper)
        nesting -= 1
      }
      return wrapper
    }
  })
  return obj
}

const createElementWrapper = (
  el: HTMLElement,
  appId: string,
  elementList: ElementList
): ElementWrapper => {
  const wrapper = {
    el,
    appId,
    use: useCreator(appId, el),
    onmount: (f: Function) => setTimeout(() => f(el)),
    text: (text: string | number) => {
      const textNode = document.createTextNode(text.toString())
      el.appendChild(textNode)
    }
  }
  allHtmlElements().forEach(elementName => {
    wrapper[elementName] = () => elementList.get(elementName)
  })
  return wrapper as unknown as ElementWrapper
}

export { elements, createElementWrapper }
