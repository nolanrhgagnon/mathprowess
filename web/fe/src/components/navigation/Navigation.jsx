import { NavLink } from 'react-router-dom';

export default function Navigation({ urls }) {
  return (
    <nav className="flex flex-row py-5 bg-slate-950 place-items-center">
      <div className="flex flex-row flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center place-items-center h-16">
              <img 
                src="/icon_no_bg.svg" 
                alt="Company Logo" 
                className="h-14 w-auto"
              />
              <NavLink to={"/"} className="text-blue-500 text-2xl ml-4">Math Prowess</NavLink>
        </div>
        <img
            src="/cooler.png"
            alt="animation"
            className="ml-20 h-16"
        />
        <div className="flex flex-row ml-auto place-items-center justify-between mr-0 w-1/2">
            {urls.map((url, index) =>
                <NavLink to={`/${url.path}`} className="cursor-pointer text-slate-500 hover:text-white">{url.title}</NavLink> 
            )}
        </div>
      </div>
    </nav>
  );
}
