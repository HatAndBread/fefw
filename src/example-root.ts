import { use } from "./use"
import { exampleComponent } from "./components/example-component"

const app = document.getElementById("app") as HTMLElement

use(app, template, { count: 0 })

function template({ _, setState, stateFor, elements }: TemplateOptions) {
  const { div, button } = elements

  const handleButtonClick = (e: Event) => {
    const currentValue = stateFor("count")
    setState("count", currentValue + 1)
  }

  return div({ text: "hello", class: "bg-green", "data-stuff": "hello" }, _ => {
    div({ text: "hello1" }, _ => {
      div({ text: "hello2" }, _ => {
        div({ text: "hello3" })
        div({ text: "hello4" })
        div({ text: "hello5" }, _ => {
          div({ text: () => "count" })
          button({ text: "I am a button", onclick: handleButtonClick })
        })
        ;[1, 2, 3, 4, 5].forEach(n => {
          if (!(n % 2)) {
            div({ text: n, class: n })
          }
        })
      })
      use(_, exampleComponent, { count: 3 })
    })
    div({ text: "last" })
  })
}
