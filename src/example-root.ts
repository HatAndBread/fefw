import { App } from "./use"
import { exampleComponent } from "./components/example-component"

const app = document.getElementById("app") as HTMLElement

App(app, ApplicationRoot, { count: 0 })

function ApplicationRoot(this: TemplateOptions) {
  const { setState, getState, stateFor, div, button, p } = this

  const handleButtonClick = () => {
    const currentValue = stateFor("count")
    setState({ count: currentValue + 1 })
  }

  const { count } = getState()
  const style = getStyle(count)

  return div({ style: style.main, dataStuff: "I am a dataset" }, _ => {
    _.text(`helloooo ${count}`)
    div(_ => {
      _.text("heLlo1")
      button({ style: { backgroundColor: "black", color: "white" }, text: "Wowwy" })
      div(_ => {
        _.text("hellLO2")
        div(_ => {
          _.text("textnode1")
          p("I am text in p")
          _.text("textnode2")
        })
        div("hello3!")
        div("hello4")
        div("ばか", {
          style: "background: purple; color: white; border-radius: 12px; padding: 22px",
        })
        div(_ => {
          _.text("hello5!!!$")
          button("I am a BUTTON", {
            onclick: handleButtonClick,
            style: style.button,
          })
        })
        ;[1, 2, 3, 4, 5].forEach(n => {
          if (!(n % 2)) {
            div({ class: n, text: n })
          }
        })
        for (let i = 0; i < count; i++) {
          div(count)
        }
      })
      _.use(
        exampleComponent,
        { count: 22 },
        {
          slot1: ({ div }) => div(`I am a slot and the count is ${count}`),
          slot2: ({ div }) => div(`I am also a slot!`),
        }
      )
    })
    div("gruffn")
  })
}

function getStyle(count: number) {
  return {
    main: {
      backgroundColor: "pink",
    },
    button: {
      borderWidth: `${count}px`,
      borderRadius: `8px`,
      cursor: "pointer",
      padding: `${count + 4}px`,
      backgroundColor: "skyblue",
      borderStyle: "solid",
      borderColor: "blue",
    },
  }
}
