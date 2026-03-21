export default function AccountLoading() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-20">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="h-8 w-56 rounded-md bg-muted" />
        <div className="h-4 w-72 rounded-md bg-muted" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-32 rounded-lg bg-muted" />
          <div className="h-32 rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}
