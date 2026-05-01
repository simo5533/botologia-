/**
 * Posters SVG locaux (/public/images/video-posters/) — évite cadre noir avant autoplay.
 * Clés alignées sur les sources vidéo du code.
 */

export const VIDEO_POSTER = {
  bannerHub: "/images/video-posters/botoologia-video-cover.svg",
  bannerAdvantage: "/images/video-posters/botoadvantage-poster.svg",
  bannerLab: "/images/video-posters/portail-ia-cover.svg",
  bannerBoToLink: "/images/video-posters/botolink-poster.svg",
  bannerWorks: "/images/video-posters/automatisation-ia-cover.svg",
  footer: "/images/video-posters/footer-video-poster.svg",
  logo: "/images/video-posters/botoologia-video-cover.svg",
  cardService: "/images/video-posters/card-services-poster.svg",
  widget: "/images/video-posters/botoologia-video-cover.svg",
  login: "/images/video-posters/login-poster.svg",
} as const;

export function posterForVideoSrc(src: string): string {
  switch (src) {
    case "/videos/banner_BOTOLOOGIA.mp4":
      return VIDEO_POSTER.bannerHub;
    case "/videos/banner-botoadvantage.mp4":
      return VIDEO_POSTER.bannerAdvantage;
    case "/videos/banner-botolab.mp4":
      return VIDEO_POSTER.bannerLab;
    case "/videos/Fond-BoToLink.mp4":
      return VIDEO_POSTER.bannerBoToLink;
    case "/videos/banniere-botoworks.mp4":
      return VIDEO_POSTER.bannerWorks;
    case "/videos/footer-bg.mp4":
      return VIDEO_POSTER.footer;
    case "/videos/logo-botoologia.mp4":
      return VIDEO_POSTER.logo;
    case "/videos/fond-carte-service.mp4":
      return VIDEO_POSTER.cardService;
    case "/videos/Widget-BOTO.mp4":
      return VIDEO_POSTER.widget;
    case "/videos/fond-login-botoologia.mp4":
      return VIDEO_POSTER.login;
    default:
      return VIDEO_POSTER.bannerHub;
  }
}
