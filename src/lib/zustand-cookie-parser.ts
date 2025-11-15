/**
 * Parses zustand persist middleware cookie format
 * Example: "admin-auth-token|state|accessToken:array" -> extracts the actual token
 */

interface ZustandCookieData {
  state?: {
    accessToken?: string;
    // ..
  };
}

export class ZustandCookieParser {
  private static readonly COOKIE_PREFIX = "admin-auth-token";

  /**
   * Extract token from zustand cookie in middleware (Edge Runtime)
   */
  static parseFromRequest(
    cookies: { name: string; value: string }[],
  ): string | null {
    try {
      const authCookie = cookies.find((cookie) =>
        cookie.name.startsWith(this.COOKIE_PREFIX),
      );

      if (!authCookie) return null;

      return this.extractTokenFromZustandFormat(authCookie.value);
    } catch (error) {
      console.error("Error parsing zustand cookie in middleware:", error);
      return null;
    }
  }

  /**
   * Extract token from zustand cookie in client-side (Browser)
   */
  static parseFromBrowser(): string | null {
    if (typeof window === "undefined") return null;

    try {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith(this.COOKIE_PREFIX));

      if (!cookie) return null;

      const cookieValue = cookie.split("=")[1];
      return this.extractTokenFromZustandFormat(cookieValue);
    } catch (error) {
      console.error("Error parsing zustand cookie in browser:", error);
      return null;
    }
  }

  /**
   * Extract token from the complex zustand cookie format
   */
  private static extractTokenFromZustandFormat(
    cookieValue: string,
  ): string | null {
    if (!cookieValue) return null;

    try {
      const parsed: ZustandCookieData = JSON.parse(cookieValue);
      return parsed.state?.accessToken || null;
    } catch (parseError) {
      console.warn(
        "Cookie is not in expected JSON format, trying fallback parsing",
      );
      return this.fallbackParse(cookieValue);
    }
  }

  /**
   * Fallback parsing for different zustand cookie formats
   */
  private static fallbackParse(cookieValue: string): string | null {
    if (cookieValue.startsWith('"') && cookieValue.endsWith('"')) {
      return cookieValue.slice(1, -1);
    }

    const tokenMatch = cookieValue.match(/"accessToken":"([^"]+)"/);
    if (tokenMatch) {
      return tokenMatch[1];
    }

    try {
      const decoded = decodeURIComponent(cookieValue);
      const parsed = JSON.parse(decoded);
      return parsed.state?.accessToken || null;
    } catch {
      if (cookieValue.length > 10 && cookieValue.length < 500) {
        return cookieValue;
      }
    }

    return null;
  }

  /**
   * Debug utility to see what's actually in the cookies
   */
  static debugCookies(cookies: { name: string; value: string }[]): void {
    console.log("=== ZUSTAND COOKIE DEBUG ===");
    cookies.forEach((cookie) => {
      if (cookie.name.startsWith(this.COOKIE_PREFIX)) {
        console.log("Cookie name:", cookie.name);
        console.log("Cookie value:", cookie.value);
        console.log(
          "Parsed token:",
          this.extractTokenFromZustandFormat(cookie.value),
        );
        console.log("---");
      }
    });
  }
}
