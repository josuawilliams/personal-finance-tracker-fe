import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@auth_token";

export interface AuthData {
  token: string;
  username: string;
  email: string;
}

export async function saveAuth(data: AuthData): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(data));
}

export async function getAuth(): Promise<AuthData | null> {
  const raw = await AsyncStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthData;
  } catch {
    return null;
  }
}

export async function removeAuth(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = 4 - (base64.length % 4);
  const padded = padLength === 4 ? base64 : base64 + "=".repeat(padLength);

  try {
    return decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return "{}";
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(base64UrlDecode(token.split(".")[1]));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}
