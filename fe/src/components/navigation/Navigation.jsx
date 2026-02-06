export default function Navigation() {
  return (
    <nav className="pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex space-x-8">
            <a
              href="/consultation"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
             Consultation 
            </a>
            <a
              href="/testimonials"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
             Testimonials 
            </a>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <a href="/" className="flex flex-col items-center">
              <span className="text-gray-500 text-2xl mb-4">Math Prowess</span>
              <img 
                src="/icon_no_bg.svg" 
                alt="Company Logo" 
                className="h-12 w-auto"
              />
            </a>
          </div>
          <div className="flex space-x-8">
            <a
              href="/tutorials"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
             Tutorials
            </a>
            <a
              href="/about"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
             About 
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
