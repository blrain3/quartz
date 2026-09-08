import { QuartzComponentProps } from "./types"
export const COMMENT_PAGE_SLUGS: string[] = ["关于"]

function normalizeSlug(slug: unknown): string {
  if (typeof slug !== "string") return ""
  let decoded = slug
  try {
    decoded = decodeURIComponent(slug)
  } catch {
    // 非法百分号编码（例如路径里本来就有 %）时退回原始值
  }
  return decoded
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase()
}

const allowedSlugs = new Set(COMMENT_PAGE_SLUGS.map(normalizeSlug))

/** 判断当前页面是否应该渲染评论区。作为布局条件 `about-page` 使用。 */
export function isCommentPage(props: QuartzComponentProps): boolean {
  const frontmatter = props.fileData.frontmatter as Record<string, unknown> | undefined
  const override = frontmatter?.comments
  if (override === true || override === "true") return true
  if (override === false || override === "false") return false
  return allowedSlugs.has(normalizeSlug(props.fileData.slug))
}

export const COMMENT_SPA_GUARD = `(() => {
  const resetComments = () => {
    document.querySelectorAll(".giscus").forEach((el) => el.replaceChildren())
  }
  document.addEventListener("nav", resetComments)
})();`
