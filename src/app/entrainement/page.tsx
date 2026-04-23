import { Suspense } from "react";
import EntrainementClient from "./EntrainementClient";

export default function EntrainementPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 p-6">
          <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-gray-600">Chargement...</p>
          </div>
        </main>
      }
    >
      <EntrainementClient />
    </Suspense>
  );
}