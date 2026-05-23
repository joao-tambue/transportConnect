'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // handle login logic here
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* ─── LEFT PANEL ─────────────────────────────────────────────── */}
      <aside className="flex w-[500px] min-w-[500px] flex-col items-center justify-between bg-white px-10 py-10">
        {/* Top section */}
        <div className="flex w-full flex-col items-center gap-7">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {/* SeedProd leaf SVG icon */}
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 30C6 30 10 14 24 10C24 10 16 22 18 30"
                fill="#F7941D"
              />
              <path
                d="M18 30C18 30 28 18 30 6C30 6 14 10 6 30"
                fill="#8DC63F"
              />
            </svg>
            <span className="text-2xl font-bold text-gray-800 tracking-tight">
              SeedProd
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-normal text-gray-800">Login</h1>

          {/* Subtitle */}
          <p className="text-sm text-gray-500 -mt-4 text-center">
            Don&apos;t have an account?{' '}
            <Link
              href="#"
              className="text-[#2bc3b0] hover:underline font-medium"
            >
              Get SeedProd Now
            </Link>
          </p>

          {/* Form */}
          <div className="flex w-full flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-green-600"
              />
              <label
                htmlFor="remember"
                className="text-sm text-gray-600 cursor-pointer select-none"
              >
                Remember Me
              </label>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full rounded bg-[#E84C1E] px-7 py-2.5 text-sm font-semibold text-white hover:bg-[#d44319] transition-colors"
            >
              Log In
            </button>
          </div>

          {/* Forgot Password */}
          <Link
            href="#"
            className="text-sm text-[#2bc3b0] underline hover:text-[#24a898] transition-colors"
          >
            Forgot Your Password?
          </Link>
        </div>

        {/* Footer */}
        <footer className="w-full text-center text-[11px] text-gray-400 leading-5">
          <p>
            Copyright © 2019 SeedProd, LLC.{' '}
            <Link
              href="#"
              className="underline text-gray-500 hover:text-gray-700"
            >
              SeedProd
            </Link>
            ™ is a trademark of SeedProd, LLC.
          </p>
          <p className="mt-1">
            <Link
              href="#"
              className="underline text-gray-500 hover:text-gray-700"
            >
              Terms of Service
            </Link>{' '}
            |{' '}
            <Link
              href="#"
              className="underline text-gray-500 hover:text-gray-700"
            >
              Privacy Policy
            </Link>
          </p>
        </footer>
      </aside>

      {/* ─── RIGHT PANEL ─────────────────────────────────────────────── */}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden">
        {/* Background image — replace src with your local image */}
        <Image
          src="/img/image.png"
          alt="SeedProd background"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Promo card */}
        <div
          className="relative z-10 flex flex-col items-center gap-4 rounded bg-white px-12 py-8 text-center shadow-xl"
          style={{ width: 420 }}
        >
          {/* Corner stars */}
          <Star className="absolute left-3 top-3 text-orange-500" />
          <Star className="absolute right-3 top-3 text-orange-500" />
          <Star className="absolute left-3 bottom-3 text-orange-500" />
          <Star className="absolute right-3 bottom-3 text-orange-500" />

          {/* RafflePress icon */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full">
            {/* Hexagon with bunny */}
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Hexagon background */}
              <polygon
                points="28,4 50,16 50,40 28,52 6,40 6,16"
                fill="#E84C1E"
              />
              {/* Simple bunny silhouette */}
              <ellipse cx="28" cy="32" rx="8" ry="9" fill="white" />
              <ellipse cx="23" cy="21" rx="3" ry="6" fill="white" />
              <ellipse cx="33" cy="21" rx="3" ry="6" fill="white" />
              <ellipse cx="25" cy="31" rx="1.5" ry="1.5" fill="#E84C1E" />
              <ellipse cx="31" cy="31" rx="1.5" ry="1.5" fill="#E84C1E" />
              <path
                d="M25 35 Q28 37.5 31 35"
                stroke="#E84C1E"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Headline */}
          <h2 className="text-base font-bold text-gray-800 leading-snug">
            Get the Best Giveaway &amp; Contest plugin for WordPress
          </h2>

          {/* Subtext */}
          <div className="flex flex-col gap-1 text-sm text-gray-600">
            <p>Built by the folks behind SeedProd.</p>
            <p>Grow Your Email List and Social Followings.</p>
          </div>

          {/* CTA */}
          <a
            href="#"
            className="mt-1 rounded bg-[#E84C1E] px-7 py-2.5 text-sm font-semibold text-white hover:bg-[#d44319] transition-colors"
          >
            Get RafflePress Now
          </a>
        </div>
      </main>
    </div>
  );
}

/* ── tiny star icon ───────────────────────────── */
function Star({ className = '' }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2l2.9 6.6L22 9.3l-5 4.9 1.2 6.8L12 17.7l-6.2 3.3 1.2-6.8-5-4.9 7.1-.7z" />
    </svg>
  );
}
