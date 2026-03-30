/**
 * Parses zustand-cookie-storage format.
 *
 * zustand-cookie-storage splits state into pipe-delimited cookies:
 *   admin-auth-token|state|accessToken = <raw JWT>
 *   admin-auth-token|version = 0
 *
 * This parser looks for the specific accessToken cookie by name.
 */

export class ZustandCookieParser {
  private static readonly COOKIE_PREFIX = "admin-auth-token";
  private static readonly TOKEN_COOKIE_NAME =
    "admin-auth-token|state|accessToken";

  /**
   * Extract token from zustand cookie in proxy/middleware (Edge Runtime)
   */
  static parseFromRequest(
    cookies: { name: string; value: string }[],
  ): string | null {
    try {
      const tokenCookie = cookies.find(
        (cookie) => cookie.name === this.TOKEN_COOKIE_NAME,
      );
      if (tokenCookie?.value) return tokenCookie.value;

      // Fallback: try to find any cookie with the prefix that looks like a JWT
      const authCookie = cookies.find(
        (cookie) =>
          cookie.name.startsWith(this.COOKIE_PREFIX) &&
          cookie.value.length > 10,
      );
      return authCookie?.value || null;
    } catch (error) {
      console.error("Error parsing zustand cookie in proxy:", error);
      return null;
    }
  }

  /**
   * Extract token from zustand cookie in client-side (Browser)
   */
  static parseFromBrowser(): string | null {
    if (typeof window === "undefined") return null;

    try {
      const cookies = document.cookie.split("; ");

      // Look for the exact token cookie
      const tokenCookie = cookies.find((row) =>
        row.startsWith(`${this.TOKEN_COOKIE_NAME}=`),
      );
      if (tokenCookie) {
        return tokenCookie.substring(this.TOKEN_COOKIE_NAME.length + 1);
      }

      // Fallback: find any cookie with the prefix
      const authCookie = cookies.find((row) =>
        row.startsWith(this.COOKIE_PREFIX),
      );
      if (!authCookie) return null;

      const eqIndex = authCookie.indexOf("=");
      return eqIndex !== -1 ? authCookie.substring(eqIndex + 1) : null;
    } catch (error) {
      console.error("Error parsing zustand cookie in browser:", error);
      return null;
    }
  }
}
