interface TopBarProps {
  readOnly: boolean;
  soundOn: boolean;
  onToggleSound: () => void;
  onToggleThemePanel: () => void;
  onToggleActionPanel: () => void;
  onStartNewLetter: () => void;
}

function IconButton({
  onClick,
  title,
  children,
}: {
  onClick: (e: React.MouseEvent) => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-[38px] h-[38px] rounded-full border flex items-center justify-center text-[16px] transition-all active:scale-90"
      style={{
        borderColor: "rgba(237,231,212,0.28)",
        background: "rgba(0,0,0,0.18)",
        color: "rgba(237,231,212,0.85)",
      }}
    >
      {children}
    </button>
  );
}

export function TopBar({
  readOnly,
  soundOn,
  onToggleSound,
  onToggleThemePanel,
  onToggleActionPanel,
  onStartNewLetter,
}: TopBarProps) {
  return (
    <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-7 py-[22px]">
      <div className="text-sm tracking-[3px] uppercase font-medium text-[rgba(237,231,212,0.88)] select-none">
        Letter{" "}
        <span className="text-[rgba(237,231,212,0.45)] font-normal tracking-[2px]">
          Bombed
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        {readOnly ? (
          <button
            onClick={onStartNewLetter}
            className="h-[38px] px-4 rounded-full border text-[13px] transition-colors"
            style={{
              borderColor: "rgba(237,231,212,0.28)",
              background: "rgba(0,0,0,0.18)",
              color: "rgba(237,231,212,0.85)",
            }}
          >
            Write your own
          </button>
        ) : (
          <>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onToggleSound();
              }}
              title={soundOn ? "Mute sound" : "Unmute sound"}
            >
              {soundOn ? "🔊" : "🔇"}
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onToggleThemePanel();
              }}
              title="Switch machine"
            >
              ⚒
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onToggleActionPanel();
              }}
              title="Share or export"
            >
              ↗
            </IconButton>
          </>
        )}
      </div>
    </div>
  );
}
