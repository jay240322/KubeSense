interface RefreshButtonProps {
  onRefresh: () => void;
}

export default function RefreshButton({
  onRefresh,
}: RefreshButtonProps) {
  return (
    <button onClick={onRefresh}>
      🔄 Refresh
    </button>
  );
}