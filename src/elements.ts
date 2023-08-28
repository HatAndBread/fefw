import { allHtmlElements } from "./all-html-elements"
import { allListeners } from "./all-listeners"
import { register, ensureComponentId } from "./register";
import { getStateForComponentWithoutError } from "./state";

function handleOptions(options: ElementOptions, element: HTMLElement, state: State) {
  getStateForComponentWithoutError(element)
  const keys = Object.keys(options)
  for (let i = 0; i < keys.length; i++) {
    const option = keys[i]
    const value = options[option]
    if (option === "text") {
      if (typeof value === "function") {
        element.innerText = state[value()]
      } else {
        element.innerText = value
      }
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

const elements = (state: State, oldRoot: undefined | HTMLElement, regenerate: any) => {
  const obj = {}
  let nesting = 0
  let nestingArr: number[] = []
  let nestedEls: HTMLElement[] = []
  let lastEl: HTMLElement
  allHtmlElements().forEach(el => {
    //@ts-ignore
    obj[el] = (options, callback) => {
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
            register(element, state, regenerate)
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
      if (typeof callback === "function") {
        callback(element)
        nesting -= 1
      }
      return element
    }
  })
  return obj as ElementList
}

export { elements }
