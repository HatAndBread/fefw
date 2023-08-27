export function anotherComponent({ setState, stateFor, elements }: TemplateOptions) {
  const { div, input, p, br } = elements

  const handleInput = (e: Event) => {
    const target = e.currentTarget as HTMLInputElement
    setState("name", target.value)
  }

  return div({}, _ => {
    input({ text: "I am a component", oninput: handleInput, value: () => "name" })
    p({ text: () => "name" })
  })

}
