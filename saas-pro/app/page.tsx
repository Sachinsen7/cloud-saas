'use client';
export default function Home() {
    const goToLogin = () => (window.location.href = '/sign-in');
    const goToSignup = () => (window.location.href = '/sign-up');

    return (
        <div
            className={`font-sans flex flex-col items-center justify-center min-h-screen p-8 bg-[#0a0a0a] relative overflow-hidden`}
        >
            <main
                className={` rounded-3xl shadow-3xl p-8 sm:p-16 max-w-2xl w-full text-center transition-all duration-500  backdrop-blur-lg bg-opacity-80 relative z-10 hover:shadow-4xl`}
            >
                <div className="flex justify-center">
                    <i className="fa-regular fa-image text-5xl text-[#312ed9] transition mb-10"></i>
                </div>

                <h1
                    className={`text-[#312ed9] text-4xl sm:text-6xl font-extrabold mb-3  tracking-tight leading-none`}
                >
                    Cloud SaaS
                </h1>
                <h2 className="text-4xl text-gray-200 font-semibold mb-8">
                    The Unified AI Platform For All Your Media.
                </h2>
                <p className="text-lg text-gray-500 mb-14 max-w-sm mx-auto leading-relaxed">
                    Unleash the full potential of your media with{' '}
                    <span className="font-semibold text-gray-0">
                        AI-powered intelligent tools
                    </span>
                    . Transform, enhance, and analyze with precision.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-5 sm:space-y-0 sm:space-x-6">
                    <button
                        onClick={goToLogin}
                        className={`
              py-1 px-8 text-xl font-bold uppercase rounded-md 
              bg-[#312ed9]  text-white 
              outline-none
              hover:bg-[#4b49d4]
            `}
                    >
                        Log In
                    </button>

                    {/* Sign Up */}
                    <button
                        onClick={goToSignup}
                        className={`
              py-3 px-7 text-xl font-bold uppercase rounded-md 
              bg-red-500
             outline-none text-white
              border border-none hover:bg-red-400
            `}
                    >
                        Sign Up
                    </button>
                </div>
            </main>
            <p className="text-gray-500">@2025 CloudSaaS</p>
        </div>
    );
}
