import { anotherComponent } from "./another-component";

export function exampleComponent({
  setState,
  stateFor,
  elements,
  slots
}: TemplateOptions) {
  const { div, button } = elements;

  const handleButtonClick = (e: Event) => {
    const currentValue = stateFor("count");
    setState("count", currentValue + 1);
  };

  const {slot1, slot2} = slots;

  return div({ text: "I am a component", class: "bg-yellow" }, _ => {
    slot1(_)
    _.img({text: "what the fuck?"})
    button({ text: () => "count", onclick: handleButtonClick });
    slot2(_)
    _.use(anotherComponent, { name: "fred" });
  });
}
