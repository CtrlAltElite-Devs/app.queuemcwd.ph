/**
 * Parses zustand-cookie-storage format.
 *
 * zustand-cookie-storage URL-encodes cookie names, so pipes become %7C:
 *   admin-auth-token%7Cstate%7CaccessToken = <URL-encoded JWT>
 *   admin-auth-token%7Cstate%7CrefreshToken = <URL-encoded JWT>
 *   admin-auth-token%7Cversion = 0
 *
 * All lookups decode cookie names before comparing.
 */

export class ZustandCookieParser {
  private static readonly TOKEN_COOKIE_NAME =
    "admin-auth-token|state|accessToken";
  private static readonly REFRESH_TOKEN_COOKIE_NAME =
    "admin-auth-token|state|refreshToken";

  /**
   * Extract access token from zustand cookie in proxy/middleware (Edge Runtime)
   */
  static parseFromRequest(
    cookies: { name: string; value: string }[],
  ): string | null {
    try {
      const tokenCookie = cookies.find(
        (cookie) =>
          decodeURIComponent(cookie.name) === this.TOKEN_COOKIE_NAME,
      );
      if (tokenCookie?.value) {
        return decodeURIComponent(tokenCookie.value);
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Extract access token from zustand cookie in client-side (Browser)
   */
  static parseFromBrowser(): string | null {
    if (typeof window === "undefined") return null;

    try {
      const cookies = document.cookie.split("; ");
      for (const row of cookies) {
        const eqIndex = row.indexOf("=");
        if (eqIndex === -1) continue;
        const name = decodeURIComponent(row.substring(0, eqIndex));
        if (name === this.TOKEN_COOKIE_NAME) {
          return decodeURIComponent(row.substring(eqIndex + 1));
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Extract refresh token from zustand cookie in proxy/middleware (Edge Runtime)
   */
  static parseRefreshTokenFromRequest(
    cookies: { name: string; value: string }[],
  ): string | null {
    try {
      const tokenCookie = cookies.find(
        (cookie) =>
          decodeURIComponent(cookie.name) === this.REFRESH_TOKEN_COOKIE_NAME,
      );
      if (tokenCookie?.value) {
        return decodeURIComponent(tokenCookie.value);
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Extract refresh token from zustand cookie in client-side (Browser)
   */
  static parseRefreshTokenFromBrowser(): string | null {
    if (typeof window === "undefined") return null;

    try {
      const cookies = document.cookie.split("; ");
      for (const row of cookies) {
        const eqIndex = row.indexOf("=");
        if (eqIndex === -1) continue;
        const name = decodeURIComponent(row.substring(0, eqIndex));
        if (name === this.REFRESH_TOKEN_COOKIE_NAME) {
          return decodeURIComponent(row.substring(eqIndex + 1));
        }
      }
      return null;
    } catch {
      return null;
    }
  }
}
