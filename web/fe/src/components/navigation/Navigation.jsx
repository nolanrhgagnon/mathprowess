import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navigation({ urls }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top bar */}
        <div className="flex items-center justify-between h-16">

          {/* Logo + title */}
          <div className="flex items-center">
            <img
              src="/icon_no_bg.svg"
              alt="Company Logo"
              className="h-10 w-auto"
            />

            <NavLink
              to="/"
              className="text-blue-500 text-xl ml-3 font-thin"
            >
              Math Prowess
            </NavLink>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            {urls.map((url) => (
              <NavLink
                key={url.path}
                to={`/${url.path}`}
                className="text-slate-400 hover:text-white"
              >
                {url.title}
              </NavLink>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-slate-300 hover:text-white"
          >
            ☰
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden flex flex-col space-y-4 pb-6">
            {urls.map((url) => (
              <NavLink
                key={url.path}
                to={`/${url.path}`}
                className="text-slate-400 hover:text-white"
                onClick={() => setOpen(false)}
              >
                {url.title}
              </NavLink>
            ))}
          </div>
        )}

      </div>
    </nav>
  );
}
