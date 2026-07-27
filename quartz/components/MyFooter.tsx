import type { QuartzComponent, QuartzComponentConstructor } from "./types"

export default (() => {
  const MyFooter: QuartzComponent = () => {
    return (
      <footer></footer>
    )
  }

  MyFooter.css = `
    footer {
      text-align: center;
      margin-bottom: 4rem;
      opacity: 0.7;
    }
  `

  return MyFooter
}) satisfies QuartzComponentConstructor
