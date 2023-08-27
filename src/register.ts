type RegisteredComponents = {
  [key: string]: {
    timesRendered: number
  }
}
const _registeredComponents: RegisteredComponents = {}
const registeredComponents = () => _registeredComponents
function register(template: Template) {
  _registeredComponents[template.name] ||= {timesRendered: 0}
  _registeredComponents[template.name].timesRendered += 1;
  return _registeredComponents[template.name].timesRendered === 1
}

export {register, registeredComponents}