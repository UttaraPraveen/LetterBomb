import type { SharedLetterPayload } from "../types/letter";

/**
 * Encodes a letter payload into a URL-safe base64 string.
 * This is the entire persistence mechanism for sharing — there is no
 * backend, so the URL itself carries the letter's content.
 */
export function encodeLetter(payload: SharedLetterPayload): string {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Decodes a URL-safe base64 string back into a letter payload.
 * Returns null if the string is malformed or doesn't match the expected
 * shape, so callers can fall back to a fresh-letter state safely.
 */
export function decodeLetter(encoded: string): SharedLetterPayload | null {
  try {
    const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "===".slice((b64.length + 3) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json);
    if (typeof parsed?.text === "string" && typeof parsed?.themeId === "string") {
      return parsed as SharedLetterPayload;
    }
    return null;
  } catch {
    return null;
  }
}

export function buildShareUrl(payload: SharedLetterPayload): string {
  const encoded = encodeLetter(payload);
  const url = new URL(window.location.href);
  url.hash = `letter/${encoded}`;
  return url.toString();
}

export function readLetterFromHash(): SharedLetterPayload | null {
  const match = window.location.hash.match(/^#letter\/(.+)$/);
  if (!match) return null;
  return decodeLetter(match[1]);
}
