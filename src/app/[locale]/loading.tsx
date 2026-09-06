export default function Loading() {
  return (
    <output className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-16">
      <div className="h-8 w-2/3 animate-pulse rounded-md bg-muted" />
      <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
      <span className="sr-only">Loading</span>
    </output>
  );
}
