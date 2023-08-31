import { anotherComponent } from "./another-component";

export function exampleComponent({
  setState,
  stateFor,
  elements,
}: TemplateOptions) {
  const { div, button } = elements;

  const handleButtonClick = (e: Event) => {
    const currentValue = stateFor("count");
    setState("count", currentValue + 1);
  };

  return div({ text: "I am a component", class: "bg-yellow" }, _ => {
    button({ text: () => "count", onclick: handleButtonClick });
    _.use(_, anotherComponent, { name: "fred" });
  });
}
