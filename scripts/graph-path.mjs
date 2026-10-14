/** Normalize Graph's pathname once, at its native outer resolver. */
export function graphPathToSlug(pathname, basePath = "/") {
  let path = decodeURI(pathname)
  let base = decodeURI(basePath || "/")
  while (base.endsWith("/")) base = base.slice(0, -1)
  if (base && path === base) path = "/"
  else if (base && path.startsWith(base + "/")) path = path.slice(base.length)
  while (path.startsWith("/")) path = path.slice(1)
  while (path.endsWith("/")) path = path.slice(0, -1)
  return path
}

// Serialize the tested implementation rather than maintaining another algorithm.
export const graphRuntimeFunction = `function u(){return (${graphPathToSlug.toString()})(window.location.pathname,Hu())}`

export const nativeGraphPathFunction =
  'function we(){let u=decodeURI(window.location.pathname);return u.endsWith("/")&&(u=u.slice(0,-1)),u.startsWith("/")&&(u=u.slice(1)),u}'

// Recognize and undo this task's previous inner-resolver patch.
export const legacyGraphPathFunction =
  'function we(){let u=decodeURIComponent(window.location.pathname),b=decodeURIComponent(document.body.dataset.basepath||"/");let q=b.endsWith("/")?b:b+"/";u=u===b.slice(0,-1)?"/":u.startsWith(q)?u.slice(q.length-1):u;return u.endsWith("/")&&(u=u.slice(0,-1)),u.startsWith("/")&&(u=u.slice(1)),u}'
