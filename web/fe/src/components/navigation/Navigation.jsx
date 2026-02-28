export default function Navigation() {
  return (
    <nav className="pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center place-items-center h-16 border border-red-500">
              <img 
                src="/icon_no_bg.svg" 
                alt="Company Logo" 
                className="h-12 w-auto border border-white"
              />
              <span className="text-gray-500 text-2xl mb-4 border border-white">Math Prowess</span>
        </div>
      </div>
    </nav>
  );
}
