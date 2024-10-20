"use client";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation"; // Import useRouter
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';

export default function Navbar() {
  const { address, isConnected } = useAccount(); // Using wagmi for account status
  const router = useRouter(); // Initialize router

  // Navigation handlers
  const handleNavigate = (path: string) => {
    router.push(path); // Navigate to the desired route
  };

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <img
                src='./TuneRights.png' // Update this with the correct path to your PNG image
                alt="Icon description"
                className="h-5 w-5" // Apply the same styling you had on the SVG (height and width)
                style={{ objectFit: 'contain' }} // Ensures the image maintains its aspect ratio
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a role="button" onClick={() => handleNavigate('/AddSongs')}>
                Publish a song
              </a>
            </li>
            <li>
              <a role="button" onClick={() => handleNavigate('/ListSongs')}>
                My Music
              </a>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl" href="#">
          TuneRight
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a href="#">Explore</a>
          </li>
          <li>
            <a role="button" onClick={() => handleNavigate('/AddSongs')}>
              Publish a song
            </a>
          </li>
          <li>
            <a role="button" onClick={() => handleNavigate('/ListSongs')}>
              My Music
            </a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {isConnected ? (
          <span className="btn btn-ghost">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        ) : (
          // Use DynamicWidget for wallet connection
          <DynamicWidget />
        )}
      </div>
    </div>
  );
}
