export type SoundProfile = "classic" | "soft" | "sharp" | "deep";

export interface Theme {
  id: string;
  label: string;
  bgGradient: string;
  paperColor: string;
  paperHeaderColor: string;
  ink: string;
  inkFaded: string;
  machineBody: string;
  machineBodyDark: string;
  machineAccent: string;
  soundProfile: SoundProfile;
  headerLeft: string;
  headerRight: string;
}

export interface LetterHeader {
  left: string;
  right: string;
}

export interface SharedLetterPayload {
  text: string;
  themeId: string;
  header?: LetterHeader;
}

export interface LetterDraft {
  text: string;
  themeId: string;
}
