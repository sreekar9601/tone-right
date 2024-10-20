"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold mb-8">Welcome to TuneRight</h1>
          <p className="text-lg mb-8">
            Revolutionize the way you publish and protect your music with TuneRight. 
            Our platform helps musicians and creators register their songs as Intellectual 
            Property, ensuring your rights are secured.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              className="btn btn-primary"
              onClick={() => router.push('/AddSongs')}
            >
              Publish Your Music
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => router.push('/ListSongs')}
            >
              View My Music
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
