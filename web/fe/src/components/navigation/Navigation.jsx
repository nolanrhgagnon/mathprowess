import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navigation({ urls }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="p-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">

          <div className="flex items-center">
            <img
              src="/icon_no_bg.svg"
              alt="Company Logo"
              className="h-10 w-auto"
            />

            <NavLink
              to="/"
              className="text-white text-lg ml-6 font-thin"
            >
              Math Prowess
            </NavLink>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {urls.map((url) => (
              <NavLink
                key={url.path}
                to={`/${url.path}`}
                className="font-thin text-white hover:text-purple-400"
              >
                {url.title}
              </NavLink>
            ))}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-indigo-300 hover:text-white"
          >
            ☰
          </button>
        </div>

        {open && (
          <div className="md:hidden flex flex-col space-y-4 pb-6">
            {urls.map((url) => (
              <NavLink
                key={url.path}
                to={`/${url.path}`}
                className="text-indigo-200 hover:text-white"
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
