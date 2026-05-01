import { VIDEO_POSTER } from "@/lib/seo/video-posters";

const LOGIN_BG_VIDEO_SRC = "/videos/fond-login-botoologia.mp4";

/**
 * Layout des pages d’authentification (login, etc.) — vidéo de fond, pas de header/footer.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="login-theme min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="login-theme-video-wrap" aria-hidden>
        <video
          className="login-theme-video"
          poster={VIDEO_POSTER.login}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={LOGIN_BG_VIDEO_SRC} type="video/mp4" />
        </video>
        <div className="login-theme-video-overlay" />
      </div>
      {children}
    </div>
  );
}
