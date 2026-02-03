import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";

function ErrorBoundary() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Error 404</title>
      </Helmet>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 xl:gap-16">
              {/* Left side - 404 */}
              <div className="text-center lg:text-left">
                <div className="relative inline-block">
                  <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-r from-red-100 to-pink-100 rounded-full blur-lg sm:blur-xl opacity-60"></div>
                  <div className="relative">
                    <h1 className="text-7xl sm:text-8xl md:text-9xl font-black text-red-600 leading-none">
                      404
                    </h1>
                    <div className="mt-3 sm:mt-4 px-4 sm:px-6 py-1.5 sm:py-2 bg-red-50 rounded-full inline-block border border-red-200">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-700 tracking-tight">
                        ERROR
                      </h2>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider (visible on larger screens) */}
              <div className="hidden lg:block h-32 w-px bg-gray-200"></div>

              {/* Right side - Message */}
              <div className="flex flex-col gap-4 sm:gap-5 max-w-md lg:max-w-lg">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl sm:text-2xl">⚠️</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                      Oops!
                    </h3>
                  </div>
                  <h4 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
                    We were unable to find what you were looking for.
                  </h4>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="space-y-2">
                    <p className="text-gray-600 text-sm sm:text-base">
                      The page you have requested cannot be found.
                    </p>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      Error code: Page Not Found
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
                  <Link
                    to="/"
                    className="px-6 py-3 sm:px-7 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-center text-sm sm:text-base shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Go to the homepage
                  </Link>
                  <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 sm:px-7 sm:py-3 bg-white text-indigo-600 font-medium rounded-lg border border-indigo-300 hover:bg-indigo-50 transition-all duration-300 text-center text-sm sm:text-base shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Go back
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-100 mt-2">
                  <p className="text-xs text-gray-400 text-center">
                    Need help? Contact support if this keeps happening
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ErrorBoundary;
