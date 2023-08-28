import { registeredComponents, getComponentIdDataSetName } from "./register";

const getId = (el: HTMLElement) => {
  const componentIdDataSetName = getComponentIdDataSetName();
  const id = el.getAttribute(componentIdDataSetName);
  if (!id) {
    throw new Error(`Expected component to have a uid but it did not: ${el.outerHTML}`)
  }
  return id;
}

function getStateForComponent(el: HTMLElement) {
  return registeredComponents()[getId(el)].state
}

function getStateForComponentWithoutError(el: HTMLElement) {
  return registeredComponents()[getComponentIdDataSetName()]?.state
}

function setStateForComponent(el: HTMLElement, key: string, value: any) {
  registeredComponents()[getId(el)].state[key] = value;
  return registeredComponents()[getId(el)].state
}

export {getStateForComponent, setStateForComponent, getStateForComponentWithoutError}