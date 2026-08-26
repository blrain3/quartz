declare module "*.scss" {
  const content: string
  export = content
}

// Type declarations for packages whose exports field doesn't include types condition
declare module "micromorph" {
  export default function micromorph(from: Node, to: Node): Promise<void>
  export interface Patch {
    type: number
    [key: string]: any
  }
}

declare module "remark-parse/lib" {
  export { Root } from "mdast"
}

// dom custom event
interface CustomEventMap {
  prenav: CustomEvent<{}>
  nav: CustomEvent<{ url: FullSlug }>
  themechange: CustomEvent<{ theme: "light" | "dark" }>
  readermodechange: CustomEvent<{ mode: "on" | "off" }>
  render: CustomEvent<{}>
}

type ContentIndex = Record<FullSlug, ContentDetails>
declare const fetchData: Promise<ContentIndex>
