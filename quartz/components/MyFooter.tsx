import type { QuartzComponent, QuartzComponentConstructor } from "./types"

export default (() => {
  const MyFooter: QuartzComponent = () => {
    const year = new Date().getFullYear()
    return (
      <footer>
        <img
          src="https://tg.salix.eu.org/file/1784560281480_image.webp"
          alt="footer image"
          class="footer-img"
        />
        <p>blrain &copy; {year}</p>
      </footer>
    )
  }

  MyFooter.css = `
    footer {
      text-align: center;
      margin-bottom: 4rem;
      opacity: 0.7;
    }
    footer .footer-img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 0 auto 0.5rem;
    }
  `

  return MyFooter
}) satisfies QuartzComponentConstructor
