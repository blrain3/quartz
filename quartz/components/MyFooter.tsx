import type { QuartzComponent, QuartzComponentConstructor } from "./types"

export default (() => {
  const MyFooter: QuartzComponent = () => {
    const year = new Date().getFullYear()
    return (
      <footer>
        <p>blrain &copy; {year}</p>
      </footer>
    )
  }

  MyFooter.css = `
    footer {
      text-align: left;
      margin-bottom: 4rem;
      opacity: 0.7;
    }
  `

  return MyFooter
}) satisfies QuartzComponentConstructor
