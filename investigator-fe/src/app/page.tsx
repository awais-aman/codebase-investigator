export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-20">
      <div className="max-w-2xl w-full space-y-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          Codebase Investigator
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Paste a public GitHub repo and ask questions. Every answer is grounded
          in real files and lines, and independently audited.
        </p>
        <p className="text-sm text-zinc-500 italic">
          Scaffold ready — paste form coming next.
        </p>
      </div>
    </main>
  );
}
