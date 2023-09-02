import { allHtmlElements } from "./all-html-elements"
import { allListeners } from "./all-listeners"
import { register, ensureComponentId } from "./register"
import { useCreator } from "./use"

function handleOptions(
  options: ElementOptions,
  element: HTMLElement,
  state: State
) {
  const keys = Object.keys(options)
  for (let i = 0; i < keys.length; i++) {
    const option = keys[i]
    const value = options[option]
    if (option === "text") {
      if (typeof value === "function") {
        element.innerText = state[value()]
      } else if (Array.isArray(value)) {
        const variable = value[0]
        const func = value[1]
        if (typeof variable !== "string" || typeof func !== "function") {
          throw new Error(
            `Expected ${option} to be an array [string, () => {}] but was ${JSON.stringify(
              value
            )}`
          )
        }
        element.innerText = func(state[variable])
      } else if (Object.getPrototypeOf(value) === Object.prototype) {
        const keys = Object.keys(value)
        const variable = keys[0]
        const func = value[variable]
        if (keys.length > 1 || typeof func !== "function") {
          throw new Error(
            `Expected ${option} to be: {key: () => {} but was ${JSON.stringify(
              value
            )}}`
          )
        }
        element.innerText = func(state[variable])
      } else {
        element.innerText = value
      }
    } else if (allListeners.includes(option)) {
      if (typeof value !== "function") {
        throw new Error(
          `Expected listener ${option} to be function but was: ${typeof value}`
        )
      } else {
        //@ts-ignore
        element[option] = value
      }
    } else {
      element.setAttribute(
        option,
        typeof value === "function" ? state[value()] : value
      )
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
  const obj = {} as ElementList;
  obj.get = (key: string) => obj[key]
  let nesting = 0
  let nestingArr: number[] = []
  let nestedEls: HTMLElement[] = []
  let lastEl: HTMLElement
  allHtmlElements().forEach(el => {
    //@ts-ignore
    obj[el] = (options, callback): ElementWrapper => {
      if (callback && typeof callback !== "function") {
        throw new Error(
          `Expected callback for ${el} to be a function, but its type was: ${typeof callback}`
        )
      }
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
            ensureComponentId(oldRoot, element)
          } else {
            // Set id for new components
            register(element, state, regenerate, appId)
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
      handleOptions(options, element, state)
      const wrapper = createElementWrapper(element, appId, obj)
      if (typeof callback === "function") {
        callback(wrapper)
        nesting -= 1
      }
      return wrapper
    }
  })
  return obj;
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
    onmount: (f: Function) => setTimeout(() => f(el))
  }
  allHtmlElements().forEach((elementName) => {
    wrapper[elementName] = () => elementList.get(elementName)
  })
  return wrapper as unknown as ElementWrapper;
}

export { elements, createElementWrapper }
