export interface AdminTokens {
  accessToken: string | null;
}

export const getAdminTokens = (): AdminTokens => {
  const raw = localStorage.getItem("admin-auth-token");
  if (!raw) return { accessToken: null };

  try {
    const parsed = JSON.parse(raw) as {
      state: { accessToken?: string };
      version: number;
    };
    return { accessToken: parsed.state.accessToken ?? null };
  } catch (e) {
    console.error("Failed to parse admin-auth from localStorage", e);
    return { accessToken: null };
  }
};
