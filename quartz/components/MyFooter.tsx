import type { QuartzComponent, QuartzComponentConstructor } from "./types"

export default (() => {
  const MyFooter: QuartzComponent = () => {
    return (
      <footer>
        <p>blrain 2026</p>
      </footer>
    )
  }

  MyFooter.displayName = "MyFooter"
  return MyFooter
}) satisfies QuartzComponentConstructor
