import GoogleAuthRedirectHandler from '@/components/GoogleAuthRedirectHandler'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-tech-dark flex items-center justify-center px-4">
      <GoogleAuthRedirectHandler />
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-tech-accent rounded-lg flex items-center justify-center">
              <span className="text-tech-dark font-bold text-2xl">T</span>
            </div>
            <span className="text-3xl font-bold text-white">
              Tech<span className="text-tech-accent">novate</span>
            </span>
          </div>
          <p className="text-gray-400">Where Technology Meets Innovation</p>
        </div>

        {/* Auth Form */}
        <div className="bg-tech-light rounded-2xl border border-tech-accent/20 p-8 shadow-xl">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          © {new Date().getFullYear()} Technovate. All rights reserved.
        </p>
      </div>
    </div>
  )
}
