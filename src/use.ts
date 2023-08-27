import { elements } from "./elements"

function use(elementToInjectInto: HTMLElement, template: Template, initialState: State = {}) {
  const state = initialState
  const getState = () => {
    return { ...state }
  }
  const stateFor = (key: string) => {
    return state[key]
  }
  const setState = (s: string, value: any) => {
    state[s] = value
    rootEl.replaceWith(use(elementToInjectInto, template, state))
  }
  const rootEl = template({
    elements: elements(elementToInjectInto, state),
    setState,
    getState,
    stateFor,
  })
  return rootEl
}

export { use }
