import { DiffDOM } from "diff-dom"
import { register } from "./register"
import { elements } from "./elements"

function use(elementToInjectInto: HTMLElement, template: Template, initialState: State = {}) {
  const isFirstRegister = register(template)
  const state = initialState
  const getState = () => {
    return { ...state }
  }
  const stateFor = (key: string) => {
    return state[key]
  }
  const setState = (s: string, value: any) => {
    state[s] = value
    const dd = new DiffDOM()
    const newRootEl = use(elementToInjectInto, template, state)
    console.log(rootEl, newRootEl)
    const diff = dd.diff(rootEl, newRootEl)
    dd.apply(rootEl, diff)
    // rootEl.replaceWith(use(elementToInjectInto, template, state))
  }
  const rootEl = template({
    elements: elements(elementToInjectInto, state, isFirstRegister),
    setState,
    getState,
    stateFor,
  })
  return rootEl
}

export { use }
