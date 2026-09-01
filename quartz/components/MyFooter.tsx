import type { QuartzComponent, QuartzComponentConstructor } from "./types"

export default (() => {
  const MyFooter: QuartzComponent = () => {
    return (
      <footer>
        <p>
          blrain 2026 ·{" "}
          <a href="https://icp.gov.moe/?keyword=20260697" target="_blank" rel="noopener noreferrer">
            萌ICP备20260697号
          </a>
        </p>
      </footer>
    )
  }

  MyFooter.displayName = "MyFooter"
  return MyFooter
}) satisfies QuartzComponentConstructor
