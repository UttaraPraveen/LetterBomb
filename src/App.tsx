import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";

import { Background } from "./components/Background";
import { Paper } from "./components/Paper";
import { TypewriterMachine } from "./components/TypewriterMachine";
import { TopBar } from "./components/TopBar";
import { ThemePanel } from "./components/ThemePanel";
import { ActionPanel } from "./components/ActionPanel";
import { EnvelopeReveal } from "./components/EnvelopeReveal";
import { Toast } from "./components/Toast";

import { useSoundEngine } from "./hooks/useSoundEngine";
import { useTypewriter } from "./hooks/useTypewriter";
import { useGhostInput } from "./hooks/useGhostInput";
import { useCursorBlink } from "./hooks/useCursorBlink";
import { loadDraft, useLetterDraftPersistence } from "./hooks/useLetterDraft";

import { getTheme, DEFAULT_THEME_ID } from "./themes/themes";
import { buildShareUrl, readLetterFromHash } from "./utils/letterEncoding";
import { downloadAsImage, downloadAsPdf } from "./utils/exportLetter";
import type { LetterHeader } from "./types/letter";

type RevealStage = null | "envelope" | "revealed";

export default function App() {
  const [themeId, setThemeId] = useState(DEFAULT_THEME_ID);
  const theme = useMemo(() => getTheme(themeId), [themeId]);

  const [soundOn, setSoundOn] = useState(true);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [vibrate, setVibrate] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [readOnly, setReadOnly] = useState(false);
  const [revealStage, setRevealStage] = useState<RevealStage>(null);
  const [sharedHeader, setSharedHeader] = useState<LetterHeader | undefined>(undefined);

  const { playKey, playSpace, playReturn, playDing } = useSoundEngine(
    soundOn,
    theme.soundProfile
  );

  const triggerVibrate = useCallback(() => {
    setVibrate(true);
    window.setTimeout(() => setVibrate(false), 200);
  }, []);

  const handleKey = useCallback(() => {
    playKey();
    triggerVibrate();
  }, [playKey, triggerVibrate]);

  const handleSpace = useCallback(() => playSpace(), [playSpace]);

  const handleReturn = useCallback(() => {
    playReturn();
    triggerVibrate();
  }, [playReturn, triggerVibrate]);

  const handleDing = useCallback(() => playDing(), [playDing]);

  const { text, setText, insertChar, backspace, paperOffset } = useTypewriter({
    onKey: handleKey,
    onSpace: handleSpace,
    onReturn: handleReturn,
    onDing: handleDing,
    readOnly,
  });

  // Resolve on mount whether this is a fresh letter or a shared one.
  // The writing stage (and Paper, which captures its insertion-animation
  // flag once at mount) intentionally does not render until this settles.
  useEffect(() => {
    const shared = readLetterFromHash();
    if (shared) {
      setText(shared.text);
      if (shared.themeId) setThemeId(shared.themeId);
      setSharedHeader(shared.header);
      setReadOnly(true);
      setRevealStage("envelope");
    } else {
      setRevealStage("revealed");
      const draft = loadDraft();
      if (draft) {
        setText(draft.text);
        setThemeId(draft.themeId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLetterDraftPersistence({ text, themeId }, readOnly);

  const cursorVisible = useCursorBlink(!readOnly);

  const { inputRef, refocus } = useGhostInput({
    disabled: readOnly || showThemePanel || showActionPanel || revealStage !== "revealed",
    onChar: insertChar,
    onBackspace: backspace,
    onReturn: () => insertChar("\n"),
  });

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const handleShare = useCallback(async () => {
    const url = buildShareUrl({
      text,
      themeId,
      header: { left: theme.headerLeft, right: theme.headerRight },
    });
    try {
      await navigator.clipboard.writeText(url);
      showToast("Share link copied");
    } catch {
      showToast(url);
    }
    setShowActionPanel(false);
  }, [text, themeId, theme, showToast]);

  const handleDownloadImage = useCallback(async () => {
    setShowActionPanel(false);
    showToast("Rendering image…");
    try {
      await downloadAsImage(theme.paperColor);
    } catch {
      showToast("Could not export image");
    }
  }, [theme.paperColor, showToast]);

  const handleDownloadPdf = useCallback(async () => {
    setShowActionPanel(false);
    showToast("Rendering PDF…");
    try {
      await downloadAsPdf(theme.paperColor);
    } catch {
      showToast("Could not export PDF");
    }
  }, [theme.paperColor, showToast]);

  const startNewLetter = useCallback(() => {
    window.location.hash = "";
    setReadOnly(false);
    setText("");
    setSharedHeader(undefined);
    setRevealStage("revealed");
  }, [setText]);

  const stageStyle = { background: theme.bgGradient };

  // Don't render the writing stage until revealStage settles — Paper's
  // insert animation is captured once at mount, so mounting it before we
  // know which path we're on would lock in the wrong animation state.
  if (revealStage === null) {
    return <div className="relative w-full h-full overflow-hidden" style={stageStyle} />;
  }

  if (revealStage === "envelope") {
    return <EnvelopeReveal theme={theme} onRevealed={() => setRevealStage("revealed")} />;
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden transition-[background] duration-700"
      style={stageStyle}
      onClick={refocus}
    >
      <Background />

      <Paper
        theme={theme}
        text={text}
        cursorVisible={cursorVisible}
        paperOffset={paperOffset}
        playInsertAnimation={true}
        readOnly={readOnly}
        headerOverride={sharedHeader}
      />

      <TypewriterMachine theme={theme} vibrate={vibrate} />

      {!readOnly && (
        <input
          ref={inputRef}
          className="absolute opacity-0 pointer-events-none w-px h-px"
          aria-hidden="true"
          tabIndex={-1}
        />
      )}

      <div className="absolute inset-0 z-40 pointer-events-none [&>*]:pointer-events-auto">
        <TopBar
          readOnly={readOnly}
          soundOn={soundOn}
          onToggleSound={() => setSoundOn((s) => !s)}
          onToggleThemePanel={() => {
            setShowThemePanel((v) => !v);
            setShowActionPanel(false);
          }}
          onToggleActionPanel={() => {
            setShowActionPanel((v) => !v);
            setShowThemePanel(false);
          }}
          onStartNewLetter={startNewLetter}
        />

        {readOnly && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[1.5px] uppercase text-[rgba(237,231,212,0.5)] border border-[rgba(237,231,212,0.25)] px-2.5 py-1.5 rounded-full">
              ✍ read only · someone&apos;s letter
            </span>
          </div>
        )}

        <AnimatePresence>
          {showThemePanel && !readOnly && (
            <ThemePanel
              key="theme-panel"
              currentId={themeId}
              onSelect={(id) => {
                setThemeId(id);
                setShowThemePanel(false);
              }}
            />
          )}

          {showActionPanel && !readOnly && (
            <ActionPanel
              key="action-panel"
              onShare={handleShare}
              onDownloadImage={handleDownloadImage}
              onDownloadPdf={handleDownloadPdf}
            />
          )}

          {toast && <Toast key={`toast-${toast}`} message={toast} />}
        </AnimatePresence>

        {!readOnly && (
          <div className="absolute bottom-[1vh] left-1/2 -translate-x-1/2 text-[11px] tracking-[1.5px] uppercase text-[rgba(237,231,212,0.32)] whitespace-nowrap">
            click anywhere · just start typing
          </div>
        )}
      </div>
    </div>
  );
}
