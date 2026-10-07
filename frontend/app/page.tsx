import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Excess Auto Fleet ID</h1>
      <p className="mt-4">Next.js frontend + Corgi VIN microservice</p>
      <div className="mt-6 space-y-2">
        <Link href="/decode" className="underline">VIN Decode UI</Link>
      </div>
    </main>
  );
}
