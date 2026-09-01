import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="hidden md:flex bg-surface shadow-sm sticky top-0 z-50 justify-between items-center px-gutter py-4 w-full max-w-[1280px] mx-auto">
      <div className="flex items-center gap-8">
        <h1 className="font-headline-md text-headline-md font-bold text-midnight-indigo">
          Midnight Horizon
        </h1>
        <nav className="flex gap-6">
          <Link
            to="/"
            className="font-label-bold text-label-bold text-midnight-indigo border-b-2 border-midnight-indigo pb-1 hover:text-midnight-indigo transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            to="/explore"
            className="font-label-bold text-label-bold text-slate-text hover:text-midnight-indigo transition-colors duration-200"
          >
            Explore
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="font-label-bold text-label-bold text-slate-text hover:text-midnight-indigo transition-colors duration-200"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-midnight-indigo text-white font-label-bold text-label-bold px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Register
        </Link>
      </div>
    </header>
  );
}