import { registeredComponents, getComponentIdDataSetName } from "./register";

const getId = (el: HTMLElement) => {
  const componentIdDataSetName = getComponentIdDataSetName();
  const id = el.getAttribute(componentIdDataSetName);
  if (!id) {
    throw new Error(`Expected component to have a uid but it did not: ${el.outerHTML}`)
  }
  return id;
}

function getStateForComponent(el: HTMLElement, appId: string) {
  return registeredComponents()[appId][getId(el)].state
}

function setStateForComponent(el: HTMLElement, key: string, value: any, appId: string) {
  registeredComponents()[appId][getId(el)].state[key] = value;
  return registeredComponents()[appId][getId(el)].state
}

export {getStateForComponent, setStateForComponent}