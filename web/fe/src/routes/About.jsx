export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-lg leading-relaxed">
      
      <h1 className="text-4xl font-bold mb-8 text-indigo-500">About Me</h1>

      <img
        src="/portrait.jpg"
        alt="Portrait"
        className="float-left w-48 md:w-64 mr-6 mb-4 rounded-lg shadow-md"
      />

      <p className="mb-4 text-indigo-400 font-thin">
        I'm a developer focused on building practical software that solves real
        problems. My interests sit at the intersection of infrastructure,
        automation, and intelligent systems. I enjoy designing systems that are
        simple, reliable, and scalable.
      </p>

      <p className="mb-4 text-indigo-400 font-thin">
        Over time I've worked with modern web technologies, cloud
        infrastructure, and distributed systems. I care a lot about clean
        architecture and writing code that remains understandable months or
        years later.
      </p>

      <p className="mb-4 text-indigo-400 font-thin">
        Recently I've been especially interested in AI-powered tools,
        developer infrastructure, and building products that can scale from
        small experiments into real businesses.
      </p>

      <p className="text-indigo-400 font-thin">
        Outside of programming, I spend time studying mathematics, reading
        about science and history, and thinking about how technology shapes the
        future.
      </p>

      <div className="clear-both"></div>
    </div>
  );
}
