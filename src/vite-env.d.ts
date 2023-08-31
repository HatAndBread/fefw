/// <reference types="vite/client" />

type SetState = (identifier: string, value: any) => void;
type GetState = () => State;
type StateFor = (identifier: string) => any;

type UseFunction = (
  template: Template,
  state: State = {}
) => void;
interface ElementWrapper {
  el: HTMLElement;
  onmount: (f: (el: HTMLElement) => any) => any;
  use: UseFunction;
  appId: string;
}
interface TemplateOptions {
  setState: SetState;
  getState: GetState;
  stateFor: any;
  elements: ElementList;
  _: HTMLElement;
}

type Template = ({
  setState,
  getState,
  stateFor,
  elements,
}: TemplateOptions) => ElementWrapper;

interface State {
  [key: string]: any;
}

type ElementOptions = { [key: string]: any };

type ElementFunction = (
  options: ElementOptions,
  callback?: (_: ElementWrapper) => void
) => ElementWrapper;
type ElementList = {
  a: ElementFunction;
  abbr: ElementFunction;
  acronym: ElementFunction;
  address: ElementFunction;
  applet: ElementFunction;
  area: ElementFunction;
  article: ElementFunction;
  aside: ElementFunction;
  audio: ElementFunction;
  b: ElementFunction;
  base: ElementFunction;
  basefont: ElementFunction;
  bdi: ElementFunction;
  bdo: ElementFunction;
  big: ElementFunction;
  blockquote: ElementFunction;
  body: ElementFunction;
  br: ElementFunction;
  button: ElementFunction;
  canvas: ElementFunction;
  caption: ElementFunction;
  center: ElementFunction;
  cite: ElementFunction;
  code: ElementFunction;
  col: ElementFunction;
  colgroup: ElementFunction;
  data: ElementFunction;
  datalist: ElementFunction;
  dd: ElementFunction;
  del: ElementFunction;
  details: ElementFunction;
  dfn: ElementFunction;
  dialog: ElementFunction;
  dir: ElementFunction;
  div: ElementFunction;
  dl: ElementFunction;
  dt: ElementFunction;
  em: ElementFunction;
  embed: ElementFunction;
  fieldset: ElementFunction;
  figcaption: ElementFunction;
  figure: ElementFunction;
  font: ElementFunction;
  footer: ElementFunction;
  form: ElementFunction;
  frame: ElementFunction;
  frameset: ElementFunction;
  h1: ElementFunction;
  to: ElementFunction;
  h6: ElementFunction;
  head: ElementFunction;
  header: ElementFunction;
  hr: ElementFunction;
  html: ElementFunction;
  i: ElementFunction;
  iframe: ElementFunction;
  img: ElementFunction;
  input: ElementFunction;
  ins: ElementFunction;
  kbd: ElementFunction;
  label: ElementFunction;
  legend: ElementFunction;
  li: ElementFunction;
  link: ElementFunction;
  main: ElementFunction;
  map: ElementFunction;
  mark: ElementFunction;
  meta: ElementFunction;
  meter: ElementFunction;
  nav: ElementFunction;
  noframes: ElementFunction;
  noscript: ElementFunction;
  object: ElementFunction;
  ol: ElementFunction;
  optgroup: ElementFunction;
  option: ElementFunction;
  output: ElementFunction;
  p: ElementFunction;
  param: ElementFunction;
  picture: ElementFunction;
  pre: ElementFunction;
  progress: ElementFunction;
  q: ElementFunction;
  rp: ElementFunction;
  rt: ElementFunction;
  ruby: ElementFunction;
  s: ElementFunction;
  samp: ElementFunction;
  script: ElementFunction;
  section: ElementFunction;
  select: ElementFunction;
  small: ElementFunction;
  source: ElementFunction;
  span: ElementFunction;
  strike: ElementFunction;
  strong: ElementFunction;
  style: ElementFunction;
  sub: ElementFunction;
  summary: ElementFunction;
  sup: ElementFunction;
  svg: ElementFunction;
  table: ElementFunction;
  tbody: ElementFunction;
  td: ElementFunction;
  template: ElementFunction;
  textarea: ElementFunction;
  tfoot: ElementFunction;
  th: ElementFunction;
  thead: ElementFunction;
  time: ElementFunction;
  title: ElementFunction;
  tr: ElementFunction;
  track: ElementFunction;
  tt: ElementFunction;
  u: ElementFunction;
  ul: ElementFunction;
  var: ElementFunction;
  video: ElementFunction;
  wbr: ElementFunction;
  [key: PossibleHTMLElements]: ElementFunction;
};

type PossibleHTMLElements =
  | "a"
  | "abbr"
  | "acronym"
  | "address"
  | "applet"
  | "area"
  | "article"
  | "aside"
  | "audio"
  | "b"
  | "base"
  | "basefont"
  | "bdi"
  | "bdo"
  | "big"
  | "blockquote"
  | "body"
  | "br"
  | "button"
  | "canvas"
  | "caption"
  | "center"
  | "cite"
  | "code"
  | "col"
  | "colgroup"
  | "data"
  | "datalist"
  | "dd"
  | "del"
  | "details"
  | "dfn"
  | "dialog"
  | "dir"
  | "div"
  | "dl"
  | "dt"
  | "em"
  | "embed"
  | "fieldset"
  | "figcaption"
  | "figure"
  | "font"
  | "footer"
  | "form"
  | "frame"
  | "frameset"
  | "h1"
  | "to"
  | "h6"
  | "head"
  | "header"
  | "hr"
  | "html"
  | "i"
  | "iframe"
  | "img"
  | "input"
  | "ins"
  | "kbd"
  | "label"
  | "legend"
  | "li"
  | "link"
  | "main"
  | "map"
  | "mark"
  | "meta"
  | "meter"
  | "nav"
  | "noframes"
  | "noscript"
  | "object"
  | "ol"
  | "optgroup"
  | "option"
  | "output"
  | "p"
  | "param"
  | "picture"
  | "pre"
  | "progress"
  | "q"
  | "rp"
  | "rt"
  | "ruby"
  | "s"
  | "samp"
  | "script"
  | "section"
  | "select"
  | "small"
  | "source"
  | "span"
  | "strike"
  | "strong"
  | "style"
  | "sub"
  | "summary"
  | "sup"
  | "svg"
  | "table"
  | "tbody"
  | "td"
  | "template"
  | "textarea"
  | "tfoot"
  | "th"
  | "thead"
  | "time"
  | "title"
  | "tr"
  | "track"
  | "tt"
  | "u"
  | "ul"
  | "var"
  | "video"
  | "wbr";
