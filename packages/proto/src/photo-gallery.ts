import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { Observer, Auth } from "@calpoly/mustang";
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

  _authObserver = new Observer<Auth.Model>(this, "photo:auth");
  _user?: Auth.User;

  connectedCallback() {
    super.connectedCallback();
    
    this._authObserver.observe((auth: Auth.Model) => {
      this._user = auth.user;
      if (this.src) this.hydrate(this.src);
    });
  }

  get authorization() {
    return (
      this._user?.authenticated && {
        Authorization: `Bearer ${(this._user as Auth.AuthenticatedUser).token}`
      }
    );
  }

  hydrate(src: string) {
    fetch(src, { headers: this.authorization || {} })
      .then(res => {
        if (res.status === 200) return res.json();
        throw new Error(`Failed to load photos: ${res.status}`);
      })
      .then((json: Array<Photo>) => {
        if (json) {
          this.photos = json;
        }
      })
      .catch(err => {
        console.error("Error loading photos:", err);
        this.photos = [];
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
