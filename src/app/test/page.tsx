export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top 35% background image */}
      <div className="h-[40vh] w-full relative">
        <img
          src="/login-banner.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* <div className="absolute inset-0 bg-black/40" />{" "} */}
        {/* optional overlay */}
      </div>

      {/* Form wrapper */}
      <div className="flex-1 flex justify-center px-4 sm:px-6 lg:px-8">
        <div
          className="
            w-full max-w-md
            -mt-[20vh]   /* pulls it up to overlap */
            sm:-mt-[18vh]
            md:-mt-[16vh]
          "
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

            <form className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
              />

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-black/90 transition"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
