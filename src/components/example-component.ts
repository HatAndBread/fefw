import { anotherComponent } from "./another-component";
import { use } from "../use";

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
    use(_, anotherComponent, { name: "fred" });
  });
}
