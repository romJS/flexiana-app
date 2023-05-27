import { Inter } from "next/font/google";
import { signIn, signOut, useSession } from "next-auth/react";
import { Repositories } from "@/components/Repositories";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
      <main
        className={`flex min-h-screen flex-col items-center justify-between p-2 lg:p-24 ${inter.className}`}
      >
        <div className="flex flex-col z-10 w-full max-w-5xl items-center justify-center lg:justify-start font-mono text-sm gap-4">
          <div className="flex flex-col justify-center">FLEXIANA APP</div>

          <p>
            Signed in as <strong>{session.user?.email}</strong>
          </p>

          <button
            onClick={() => signOut()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign out
          </button>

          <Repositories />
        </div>
      </main>
    );
  }
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-start p-24 gap-4 ${inter.className}`}
    >
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex">
        FLEXIANA APP
      </div>
      <button
        onClick={() => signIn()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Sign in
      </button>
    </main>
  );
}
