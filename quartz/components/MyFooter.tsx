import type { QuartzComponent, QuartzComponentConstructor } from "./types"

export default (() => {
  const MyFooter: QuartzComponent = () => {
    return (
      <footer>
        <p>
          <a href="https://icp.gov.moe/?keyword=20260697" target="_blank" rel="noopener noreferrer">
            萌ICP备20260697号
          </a>
          <a href="https://travel.moe/go.html?travel=on" title="异次元之旅-跃迁-我们一起去萌站成员的星球旅行吧！" target="_blank">
            异次元之旅
          </a>
        </p>
      </footer>
    )
  }

  MyFooter.displayName = "MyFooter"
  return MyFooter
}) satisfies QuartzComponentConstructor
