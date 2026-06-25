interface CursorProps {
  visible: boolean;
  color: string;
}

export function Cursor({ visible, color }: CursorProps) {
  return (
    <span
      className="inline-block w-[9px] h-[22px] -mb-1 ml-px rounded-sm transition-opacity duration-75"
      style={{ backgroundColor: color, opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    />
  );
}
