import {v4 as uid} from "uuid";
const componentIdDataSetName = `data-${uid()}`

const getComponentIdDataSetName = () => componentIdDataSetName;

function getIdForComponent(el: HTMLElement) {
  const id = el.getAttribute(componentIdDataSetName)
  if (!id) {
    throw new Error(`Expected old element to have a uid but it did not: ${el.outerHTML}`)
  }
  return id;
}

function setIdForComponent(el: HTMLElement, id: string) {
  el.setAttribute(componentIdDataSetName, id)
}

function ensureComponentId(oldEl: HTMLElement, newEl: HTMLElement) {
  const id = getIdForComponent(oldEl)
  setIdForComponent(newEl, id)
}

type RegisteredComponents = {
  [key: string]: {
    timesRendered: number,
    state: {[key: string]: any},
    regenerate: any
  }
}

const _registeredComponents: RegisteredComponents = {}
const registeredComponents = () => _registeredComponents

function regenerateComponent(el: HTMLElement) {
  _registeredComponents[getIdForComponent(el)].regenerate()
}

function getStateById(id: string) {
  return _registeredComponents[id]?.state
}

function registerComponentId(rootElement: HTMLElement) {
  let id = rootElement.getAttribute(componentIdDataSetName)
  if (!id) {
    id = uid()
    rootElement.setAttribute(componentIdDataSetName, id)
  };
  return id;
}

function register(rootElement: HTMLElement, state: State, regenerate: any) {
  if (rootElement.getAttribute(componentIdDataSetName)) return;

  const id = registerComponentId(rootElement)
  _registeredComponents[id] ||= {timesRendered: 0, state, regenerate}
  _registeredComponents[id].timesRendered += 1;
  return _registeredComponents[id].timesRendered === 1
}

export {register, registeredComponents, getComponentIdDataSetName, getIdForComponent, setIdForComponent, ensureComponentId, getStateById, regenerateComponent}