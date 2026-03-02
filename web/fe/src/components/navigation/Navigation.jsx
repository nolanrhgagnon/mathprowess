export default function Navigation() {
  return (
    <nav className="pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center place-items-center h-16">
              <img 
                src="/icon_no_bg.svg" 
                alt="Company Logo" 
                className="h-14 w-auto"
              />
              <span className="text-blue-500 text-2xl ml-4">Math Prowess</span>
        </div>
      </div>
    </nav>
  );
}
