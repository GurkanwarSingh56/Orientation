export default function About() {
  return (
    <section id="about" className="section-container">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="space-y-6 animate-slideInLeft">
          <h2 className="heading-secondary">
            About <span className="gradient-text">Technovate</span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Technovate is a student-led technical club dedicated to fostering innovation, 
            collaboration, and technical excellence. We bring together passionate individuals 
            who want to push the boundaries of technology and create impactful solutions.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            Our mission is to provide a platform where students can learn, experiment, and 
            grow their technical skills through hands-on projects, workshops, hackathons, 
            and industry collaborations.
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-tech-accent flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-300">Learn cutting-edge technologies and frameworks</p>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-tech-accent flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-300">Collaborate on real-world projects with teams</p>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-tech-accent flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-300">Network with industry professionals and mentors</p>
            </div>
          </div>
        </div>

        {/* Image/Visual Section */}
        <div className="relative animate-slideInRight">
          <div className="relative rounded-2xl overflow-hidden border-2 border-tech-accent/30 hover:border-tech-accent/60 transition-all duration-300">
            <div className="aspect-square bg-gradient-to-br from-tech-accent/20 to-blue-500/20 flex items-center justify-center">
              <div className="text-center p-8">
                <svg className="w-48 h-48 mx-auto text-tech-accent opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-2xl font-bold text-white mt-6">Building the Future</p>
                <p className="text-tech-accent mt-2">One Innovation at a Time</p>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-tech-accent/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse animation-delay-2000" />
        </div>
      </div>
    </section>
  )
}
