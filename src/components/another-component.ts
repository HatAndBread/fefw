export function anotherComponent(this: TemplateOptions) {
  const { setState, getState, div, input, p, form } = this

  const handleInput = (e: Event) => {
    const target = e.currentTarget as HTMLInputElement
    setState({name: target.value})
  }

  const { name } = getState()

  return div({}, _ => {
    form(_ => {
      input({ text: "I am a component", oninput: handleInput, value: name }, _ =>
        _.onmount(_ => _.focus())
      )
      p({ text: name })
    })
  })
}
