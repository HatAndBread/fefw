export function anotherComponent({
  setState,
  elements,
  onmount,
}: TemplateOptions) {
  const { div, input, p, form } = elements;

  const handleInput = (e: Event) => {
    const target = e.currentTarget as HTMLInputElement;
    setState("name", target.value);
  };

  return div({}, _ => {
    form({}, _ => {
      input(
        { text: "I am a component", oninput: handleInput, value: () => "name" },
        _ => onmount(()=> {
          console.log("mountin!")
          _.focus()
        })
      );
      p({ text: () => "name" });
    });
  });
}
