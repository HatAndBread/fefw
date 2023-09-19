import { anotherComponent } from "./another-component"

export function exampleComponent(this: TemplateOptions) {
  const { setState, stateFor, div, button, slots } = this

  const handleButtonClick = (e: Event) => {
    const currentValue = stateFor("count")
    setState({count: currentValue + 1})
  }

  const style = {
    background: "yellow",
    color: "green",
    borderRadius: "16px",
    padding: "8px",
  }

  return div({ text: "I am a component", style }, _ => {
    slots.slot1("chicken", "choo choo")
    button(stateFor("count"), {onclick: handleButtonClick })
    slots.slot2()
    _.use(anotherComponent, { name: "fred" })
  })
}
