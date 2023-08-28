import { DiffDOM } from "diff-dom"
import { register } from "./register"
import { elements } from "./elements"

function _use(elementToInjectInto: HTMLElement, template: Template, initialState: State = {}, shouldRenderEl?: boolean) {
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
    const newRootEl = _use(elementToInjectInto, template, state, false)
    const diff = dd.diff(rootEl, newRootEl)
    dd.apply(rootEl, diff)
  }
  const rootEl = template({
    _: elementToInjectInto,
    elements: elements(elementToInjectInto, state, isFirstRegister),
    setState,
    getState,
    stateFor,
  })
  if (shouldRenderEl) {
    elementToInjectInto.appendChild(rootEl)
  }
  return rootEl
}

function use(elementToInjectInto: HTMLElement, template: Template, initialState: State = {}) {
  _use(elementToInjectInto, template, initialState, true)
}

export { use }
