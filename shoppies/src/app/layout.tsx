"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <html lang="en">
      <body>
        <header className="bg-gray-800 text-white p-4">
          <nav className="flex justify-around">
            <button
              className="text-white hover:text-gray-300"
              onClick={() => router.push("/")}
            >
              Home
            </button>
            <button
              className="text-white hover:text-gray-300"
              onClick={() => router.push("/rewards")}
            >
              Rewards
            </button>
            <button
              className="text-white hover:text-gray-300"
              onClick={() => router.push("/streak")}
            >
              Streak
            </button>
          </nav>
        </header>

        {/* Main Content */}
        <main>{children}</main>
      </body>
    </html>
  );
}
