import { DiffDOM } from "diff-dom";
import {
  ensureComponentId,
  getComponentIdDataSetName,
  regenerateComponent,
  cleanUpRegisteredComponents,
  getChildComponents,
  getIdForComponent,
} from "./register";
import { getStateForComponent, setStateForComponent } from "./state";
import { elements } from "./elements";

function _use(
  elementToInjectInto: HTMLElement,
  template: Template,
  state: State = {},
  shouldRenderEl?: boolean,
  oldRoot?: HTMLElement
) {
  const ids: string[] = [];

  const dd = new DiffDOM({
    preDiffApply: info => {
      if (
        info.diff.action === "modifyAttribute" &&
        info.diff.name === getComponentIdDataSetName()
      ) {
        if (!ids.includes(info.diff.oldValue)){
          ids.push(info.diff.oldValue)
        }
        return true;
      }
      return false;
    },
  });

  const isAppRoot =  !elementToInjectInto.getAttribute(getComponentIdDataSetName());

  const getState = () => {
    return { ...getStateForComponent(rootEl) };
  };
  const stateFor = (key: string) => {
    return getStateForComponent(rootEl)[key];
  };
  const regenerateState = (newState: State) => {
    // Todo: Only diff current component, not children
    newState ||= state;
    const newRootEl = _use(
      elementToInjectInto,
      template,
      newState,
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
      cleanUpRegisteredComponents();
    }
  };

  const setState: SetState = (s: string, value: any) => {
    const newState = setStateForComponent(rootEl, s, value);
    regenerateState(newState);
    getChildComponents(rootEl).forEach(e => {
      regenerateComponent(e as HTMLElement);
    });
  };

  const rootEl = template({
    _: elementToInjectInto,
    elements: elements(state, oldRoot, regenerateState),
    setState,
    getState,
    stateFor
  });
  if (shouldRenderEl) {
    elementToInjectInto.appendChild(rootEl);
  }
  return rootEl;
}

function use(
  elementToInjectInto: HTMLElement,
  template: Template,
  state: State = {}
) {
  _use(elementToInjectInto, template, state, true);
}

export { use };
