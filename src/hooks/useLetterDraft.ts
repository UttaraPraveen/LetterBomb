import { useEffect } from "react";
import type { LetterDraft } from "../types/letter";

const STORAGE_KEY = "letter-bombed:draft";

export function loadDraft(): LetterDraft | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (typeof parsed?.text === "string" && typeof parsed?.themeId === "string") {
      return parsed as LetterDraft;
    }
    return null;
  } catch {
    return null;
  }
}

export function useLetterDraftPersistence(draft: LetterDraft, skip: boolean) {
  const { text, themeId } = draft;

  useEffect(() => {
    if (skip) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ text, themeId }));
    } catch {
      // localStorage can fail in private browsing / storage-full edge cases;
      // drafts are a convenience, not critical, so we fail silently.
    }
    // Depend on the primitive fields, not the `draft` object reference —
    // a new object literal is created on every render in the caller, which
    // would otherwise re-fire this effect on every render regardless of
    // whether the content actually changed.
  }, [text, themeId, skip]);
}
