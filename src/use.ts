import { DiffDOM } from "diff-dom";
import {
  ensureComponentId,
  getComponentIdDataSetName,
  regenerateComponent,
  cleanUpRegisteredComponents,
  getChildComponents,
} from "./register";
import { getStateForComponent, setStateForComponent } from "./state";
import { elements } from "./elements";
import { v4 as uid } from "uuid";

const dd = new DiffDOM({
  preDiffApply: info => {
    if (
      info.diff.action === "modifyAttribute" &&
      info.diff.name === getComponentIdDataSetName()
    ) {
      return true;
    }
    return false;
  },
});

function _use(
  elementToInjectInto: HTMLElement,
  template: Template,
  state: State = {},
  appId: string,
  myUse: UseFunction,
  shouldRenderEl?: boolean,
  oldRoot?: HTMLElement,
  firstRender?: true,
) {
  const getState = () => {
    if (oldRoot) return { ...getStateForComponent(oldRoot, appId) };
    return state
  };
  const stateFor = (key: string) => {
    if (oldRoot) return getStateForComponent(oldRoot, appId)[key];
    return state[key]
  };
  const regenerateState = (newState: State) => {
    // Todo: Only diff current component, not children
    newState ||= state;
    const newRootEl = _use(
      elementToInjectInto,
      template,
      newState,
      appId,
      myUse,
      false,
      rootEl
    );
    const diff = dd.diff(rootEl, newRootEl);
    const wasAbleToApplyDiff = dd.apply(rootEl, diff);
    if (!wasAbleToApplyDiff) {
      ensureComponentId(rootEl, newRootEl);
      elementToInjectInto.replaceChild(rootEl, newRootEl);
    }
    if (shouldRenderEl) {
      // This is the end of the process for components that get mounted
      cleanUpRegisteredComponents(appId);
    }
  };

  const setState: SetState = (s: string, value: any) => {
    const newState = setStateForComponent(rootEl, s, value, appId);
    regenerateState(newState);
    getChildComponents(rootEl).forEach(e => {
      regenerateComponent(e as HTMLElement, appId);
    });
  };

  const rootEl = template({
    _: elementToInjectInto,
    elements: elements(state, oldRoot, regenerateState, appId, firstRender),
    setState,
    getState,
    stateFor,
  }).el;
  if (shouldRenderEl) {
    elementToInjectInto.appendChild(rootEl);
  }
  return rootEl;
}

const useCreator = (appId: string, el: HTMLElement, firstRender?: true) => {
  return function use(
    template: Template,
    state: State = {},
  ) {
    _use(el, template, state, appId, use, true, undefined, firstRender);
  };
};

function App(
  elementToInjectInto: HTMLElement,
  template: Template,
  state: State = {}
) {
  const appId = uid()
  const myUse = useCreator(appId, elementToInjectInto, true);
  myUse(template, state)
}

export { App, useCreator };
