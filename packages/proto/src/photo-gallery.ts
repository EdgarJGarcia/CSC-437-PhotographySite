import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import reset from "./styles/reset.css.ts";

interface Photo {
  src: string;
  alt: string;
  href: string;
}

export class PhotoGalleryElement extends LitElement {
  @property()
  src?: string;

  @state()
  photos: Array<Photo> = [];

  connectedCallback() {
    super.connectedCallback();
    if (this.src) this.hydrate(this.src);
  }

  hydrate(src: string) {
    fetch(src)
      .then(res => res.json())
      .then((json: Array<Photo>) => {
        if (json) {
          this.photos = json;
        }
      });
  }

  render() {
    const { photos } = this;

    function renderPhoto(photo: Photo) {
      return html`
        <photo-card 
          src="${photo.src}" 
          alt="${photo.alt}"
          href="${photo.href}">
        </photo-card>
      `;
    }

    return html`
      <ul class="photo-grid">
        ${photos.map(renderPhoto)}
      </ul>
    `;
  }

  static styles = [
    reset.styles,
    css`
      .photo-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        list-style: none;
        padding: 0;
      }
    `
  ];
}
