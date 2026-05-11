export function renderWithBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/gs);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}
