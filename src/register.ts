import { v4 as uid } from "uuid"

const componentIdDataSetName = `data-${uid()}`

const getComponentIdDataSetName = () => componentIdDataSetName

function getIdForComponent(el: HTMLElement) {
  const id = el.getAttribute(componentIdDataSetName)
  if (!id) {
    throw new Error(
      `Expected old element to have a uid but it did not: ${el.outerHTML}`
    )
  }
  return id
}

function setIdForComponent(el: HTMLElement, id: string) {
  el.setAttribute(componentIdDataSetName, id)
}

function ensureComponentId(oldEl: HTMLElement, newEl: HTMLElement) {
  const id = getIdForComponent(oldEl)
  setIdForComponent(newEl, id)
}

const _registeredComponents: RegisteredComponents = {}

const registeredComponents = () => _registeredComponents;
// const registeredComponents = () => _newRegisteredComponents
function regenerateComponent(el: HTMLElement, appId: string) {
  _registeredComponents[appId][getIdForComponent(el)].regenerate()
}
const getStateById = (id: string, appId: string) => {
  return _registeredComponents[appId][id]?.state
}

function registerComponentId(rootElement: HTMLElement) {
  let id = rootElement.getAttribute(componentIdDataSetName)
  if (!id) {
    id = uid()
    rootElement.setAttribute(componentIdDataSetName, id)
  }
  return id
}

function register(rootElement: HTMLElement, state: State, regenerate: any, appId: string) {
  if (rootElement.getAttribute(componentIdDataSetName)) return

  const id = registerComponentId(rootElement)
  _registeredComponents[appId] ||= {}
  _registeredComponents[appId][id] ||= { state, regenerate }
}

function getChildComponents(el: HTMLElement) {
  return el.querySelectorAll(`[${getComponentIdDataSetName()}]`)
}

function cleanUpRegisteredComponents(appId: string) {
  // Todo: Instead of whole body only search the current app.
  const validIds = Array.from(getChildComponents(document.body)).map(el =>
    getIdForComponent(el as HTMLElement)
  )
  const registerKeys = Object.keys(_registeredComponents[appId])
  for (let i = 0; i < registerKeys.length; i++) {
    const key = registerKeys[i]
    if (!validIds.includes(key)) {
      delete _registeredComponents[appId][key]
    }
  }
}

export {
  register,
  registeredComponents,
  getComponentIdDataSetName,
  getIdForComponent,
  setIdForComponent,
  ensureComponentId,
  getStateById,
  regenerateComponent,
  getChildComponents,
  cleanUpRegisteredComponents,
}
