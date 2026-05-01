/**
 * Catalogue des événements analytics — BoTooLogIA.
 * Utilisé par le hook useTrack / useAnalytics et l'API track.
 */
export const EVENTS = {
  PAGE_VIEW: "page_view",
  PAGE_EXIT: "page_exit",
  NAV_CLICK: "nav_click",
  SERVICE_VIEW: "service_view",
  SERVICE_CLICK: "service_click",
  SERVICE_CTA: "service_cta",
  FORM_START: "form_start",
  FORM_STEP: "form_step",
  FORM_COMPLETE: "form_complete",
  FORM_ABANDON: "form_abandon",
  FORM_ERROR: "form_error",
  CTA_CLICK: "cta_click",
  CTA_HERO: "cta_hero",
  CTA_FOOTER: "cta_footer",
  CTA_SECTION: "cta_section",
  BOT_OPEN: "bot_open",
  BOT_CLOSE: "bot_close",
  BOT_MESSAGE: "bot_message",
  BOT_CTA: "bot_cta",
  LOGIN_SUCCESS: "login_success",
  LOGIN_FAIL: "login_fail",
  LOGOUT: "logout",
  VIDEO_PLAY: "video_play",
  VIDEO_PAUSE: "video_pause",
  SCROLL_50: "scroll_50",
  SCROLL_100: "scroll_100",
  TIME_30S: "time_30s",
  TIME_2M: "time_2m",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];
