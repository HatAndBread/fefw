import { App } from "./use";
import { exampleComponent } from "./components/example-component";

const app = document.getElementById("app") as HTMLElement;

App(app, ApplicationRoot, { count: 0 });

function ApplicationRoot({ _, setState, stateFor, elements }: TemplateOptions) {
  const { div, button } = elements;

  const handleButtonClick = () => {
    const currentValue = stateFor("count");
    setState("count", currentValue + 1);
  };

  return div({ text: "hello", class: "bg-green", "data-stuff": "hello" }, _ => {
    div({ text: "hello1" }, _ => {
      div({ text: "hello2" }, _ => {
        div({ text: "hello3" });
        div({ text: "hello4" });
        div({ text: "hello4" });
        div({ text: "hello5" }, _ => {
          div({ text: { count: _ => `The count is ${_}` } });
          button({ text: "I am a button", onclick: handleButtonClick });
        });
        [1, 2, 3, 4, 5].forEach(n => {
          if (!(n % 2)) {
            div({ text: n, class: n });
          }
        });
      });
      _.use(_, exampleComponent, { count: 22});
    });
    div({ text: "last" });
  });
}
