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


const differ = (rootEl, newRootEl, mySlots: HTMLElement[]) => {
  const dd = new DiffDOM({
    preDiffApply: info => {
      // Slots must be updated from their parent components
      let slot = info.node?.dataset?.slot || info.node?.parentNode?.dataset?.slot
      if (slot && mySlots.includes(info.node.dataset?.slot ? info.node : info.node.parentNode)) {
        return true
      }
      if (
        info.diff.action === "modifyAttribute" &&
        info.diff.name === getComponentIdDataSetName()
      ) {
        return true;
      }
      return false;
    },
  });

  const diff = dd.diff(rootEl, newRootEl)
  return dd.apply(rootEl, diff)
}

function _use(
  elementToInjectInto: HTMLElement,
  template: Template,
  state: State = {},
  appId: string,
  myUse: UseFunction,
  shouldRenderEl?: boolean,
  oldRoot?: HTMLElement,
  firstRender?: true,
  slots?: SlotList
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
    newState ||= state;
    const newRootEl = _use(
      elementToInjectInto,
      template,
      newState,
      appId,
      myUse,
      false,
      rootEl,
      undefined,
      slots
    );
    const wasAbleToApplyDiff = differ(rootEl, newRootEl, mySlots);
    if (!wasAbleToApplyDiff) {
      console.warn("Was not able to apply diff!")
      ensureComponentId(rootEl, newRootEl);
      elementToInjectInto.replaceChild(rootEl, newRootEl);
    }
    if (shouldRenderEl) {
      // This is the end of the process for components that get mounted
      newRootEl.remove()
      cleanUpRegisteredComponents(appId);
    }
  };

  const setState: SetState = (state: State) => {
    const newState = setStateForComponent(rootEl, state, appId);
    regenerateState(newState);
    getChildComponents(rootEl).forEach(e => {
      regenerateComponent(e as HTMLElement, appId);
    });
  };

  const elFuncs = elements(state, oldRoot, regenerateState, appId, firstRender)
  const mySlots: HTMLElement[] = []
  const slot = (key: string) => {
    if (!slots) return
    const result = slots[key](elFuncs as unknown as TemplateOptions)
    mySlots.push(result.el)
    result.el.dataset.slot = "1"
    result.el.querySelectorAll("*").forEach((el) => el.dataset.slot = "1")
  }

  const templateThis = {
    _: elementToInjectInto,
    ...elFuncs,
    setState,
    getState,
    stateFor,
    slots: slots as SlotList,
    slot
  }
  template.bind(templateThis)
  const rootEl = template.call(templateThis).el;
  if (shouldRenderEl) {
    elementToInjectInto.appendChild(rootEl);
  }
  return rootEl;
}

const useCreator = (appId: string, el: HTMLElement, firstRender?: true) => {
  return function use(
    template: Template,
    state: State = {},
    slots?: SlotList
  ) {
    _use(el, template, state, appId, use, true, undefined, firstRender, slots);
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
