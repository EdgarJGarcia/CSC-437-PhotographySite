import {
  Auth,
  define,
  History,
  Switch
} from "@calpoly/mustang";
import { html } from "lit";
import { HeaderElement } from "./components/photography-header";
import { HomeViewElement } from "./views/home-view";
import { GalleryViewElement } from "./views/gallery-view";
import { PhotoViewElement } from "./views/photo-view";
import { ServiceViewElement } from "./views/service-view";
import { BookingViewElement } from "./views/booking-view";
import { ShootViewElement } from "./views/shoot-view";
import { ClientViewElement } from "./views/client-view";

const routes = [
  {
    path: "/app/photo/:id",
    view: (params: Switch.Params) => html`
      <photo-view photo-id=${params.id}></photo-view>
    `
  },
  {
    path: "/app/gallery",
    view: () => html`
      <gallery-view></gallery-view>
    `
  },
  {
    path: "/app/shoot/:id",
    view: (params: Switch.Params) => html`
      <shoot-view shoot-id=${params.id}></shoot-view>
    `
  },
  {
    path: "/app/service",
    view: () => html`
      <service-view></service-view>
    `
  },
  {
    path: "/app/booking",
    view: () => html`
      <booking-view></booking-view>
    `
  },
  {
    path: "/app/client/:id",
    view: (params: Switch.Params) => html`
      <client-view client-id=${params.id}></client-view>
    `
  },
  {
    path: "/app",
    view: () => html`
      <home-view></home-view>
    `
  },
  {
    path: "/",
    redirect: "/app"
  }
];

define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "photography-header": HeaderElement,
  "home-view": HomeViewElement,
  "gallery-view": GalleryViewElement,
  "photo-view": PhotoViewElement,
  "service-view": ServiceViewElement,
  "booking-view": BookingViewElement,
  "shoot-view": ShootViewElement,
  "client-view": ClientViewElement,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "photography:history", "photography:auth");
    }
  }
});
