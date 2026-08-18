export default function LandingPage({ onStart }) {
  const handleStart = () => {
    onStart()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center max-w-lg mx-auto animate-slide-up">
        {/* Camera illustration */}
        <div className="mb-8">
          <img 
            src="/hero-camera.png" 
            alt="Birthday camera"
            className="w-36 h-36 mx-auto object-contain rounded-2xl"
          />
        </div>

        {/* Title */}
        <h1
          className="text-4xl md:text-5xl font-semibold tracking-normal text-slate-800 mb-2"
          style={{ fontFamily: "'Segoe Script', 'Brush Script MT', cursive" }}
        >
          Happy 27<sup>th</sup> Birthday
        </h1>
        <p className="text-sm md:text-base text-slate-500 font-light leading-relaxed mb-10 px-4 py-3 rounded-2xl bg-white/55">
          I was thinking... we only have two photos together.
          <br />
          Let&apos;s change that and make a few new memories today.
        </p>

        {/* Start card */}
        <button
          onClick={handleStart}
          className="w-full px-6 py-3 rounded-xl font-medium text-sm text-white
            bg-linear-to-r from-pink-400 to-lavender-400 
            hover:from-pink-500 hover:to-lavender-500
            active:scale-[0.98] transition-all duration-200
            shadow-sm hover:shadow-md cursor-pointer select-none"
        >
          Start Photobooth →
        </button>
      </div>
    </div>
  )
}
