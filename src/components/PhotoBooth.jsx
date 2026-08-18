import { useState, useRef, useEffect, useCallback } from 'react'

const FILTERS = [
  { name: 'None', value: 'none' },
  { name: 'Warm', value: 'sepia(0.3) saturate(1.4) brightness(1.05)' },
  { name: 'Cool', value: 'hue-rotate(30deg) saturate(1.2) brightness(1.05)' },
  { name: 'Vintage', value: 'sepia(0.5) contrast(1.1) brightness(0.95)' },
  { name: 'Dreamy', value: 'brightness(1.1) contrast(0.9) saturate(1.3) blur(0.5px)' },
  { name: 'B&W', value: 'grayscale(1) contrast(1.2)' },
  { name: 'Pink', value: 'hue-rotate(-20deg) saturate(1.5) brightness(1.05)' },
  { name: 'Fairy', value: 'brightness(1.15) saturate(1.4) hue-rotate(10deg)' },
]


export default function PhotoBooth({ birthdayName, onCapture, onViewGallery, onBack, photoCount }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [currentFilter, setCurrentFilter] = useState(FILTERS[0])
  const [isCapturing, setIsCapturing] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const [showFlash, setShowFlash] = useState(false)
  const [lastPhoto, setLastPhoto] = useState(null)
  const [cameraError, setCameraError] = useState(false)
  const filterButtonBackground = {
    None: 'rgba(248, 250, 252, 0.8)',
    Warm: 'rgba(255, 237, 213, 0.8)',
    Cool: 'rgba(224, 242, 254, 0.8)',
  }

  // Start camera
  useEffect(() => {
    let mediaStream = null

    async function startCamera() {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: false
        })
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (err) {
        console.error('Camera access denied:', err)
        setCameraError(true)
      }
    }
    startCamera()
    return () => {
      if (mediaStream) mediaStream.getTracks().forEach(track => track.stop())
    }
  }, [])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)

    if (currentFilter.value !== 'none') {
      ctx.filter = currentFilter.value
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.filter = 'none'

    const photo = {
      dataUrl: canvas.toDataURL('image/png'),
      filter: currentFilter.name,
      timestamp: new Date().toISOString(),
    }

    setLastPhoto(photo)
    onCapture(photo)
    setShowFlash(true)
    setTimeout(() => setShowFlash(false), 500)
  }, [currentFilter, onCapture])

  const startCountdown = useCallback(() => {
    if (isCapturing) return
    setIsCapturing(true)
    setCountdown(3)
    let count = 3
    const timer = setInterval(() => {
      count -= 1
      if (count === 0) {
        clearInterval(timer)
        setCountdown(null)
        setIsCapturing(false)
        capturePhoto()
      } else {
        setCountdown(count)
      }
    }, 1000)
  }, [isCapturing, capturePhoto])

  const instantCapture = useCallback(() => {
    if (isCapturing) return
    capturePhoto()
  }, [isCapturing, capturePhoto])

  const renderMiniPreviewCard = (filterValue, filterName) => {
    const filterIconPath = {
      None: 'M6 18L18 6M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4c0 1.06.41 2.03 1.08 2.74M6 20v-2c0-1.28 1.24-2.29 2.76-2.96M15.16 14.65C17.65 15.09 20 16.27 20 18v2',
      Warm: 'M12 4V2m0 20v-2m5.66-14.66l1.41-1.41M4.93 19.07l1.41-1.41M20 12h2M2 12h2m14.07 7.07l-1.41-1.41M6.34 6.34L4.93 4.93M12 8a4 4 0 100 8 4 4 0 000-8z',
      Cool: 'M12 2v20m6-16L6 18m12 0L6 6m-2 6h16m-6-8l-2 2-2-2m4 16l-2-2-2 2M4 10l2 2-2 2m16-4l-2 2 2 2',
    }
    const filterPreviewBackground = {
      None: 'linear-gradient(to top right, #38bdf8, #f9a8d4, #fef08a)',
      Warm: 'linear-gradient(to top right, #fb923c, #fda4af, #fde68a)',
      Cool: 'linear-gradient(to top right, #60a5fa, #a5f3fc, #bfdbfe)',
    }

    return (
      <div className="w-16 h-10 rounded-md overflow-hidden border border-slate-200/60 shadow-inner relative bg-slate-100 shrink-0">
        {/* Background sample image (scenic landscape with gradients) */}
        <div 
          className="absolute inset-0 bg-linear-to-tr from-sky-400 via-pink-300 to-yellow-200 flex items-center justify-center"
          style={{
            backgroundImage: filterPreviewBackground[filterName],
            filter: filterValue !== 'none' ? filterValue : undefined,
          }}
        >
          {/* A vector avatar silhouette indicating person/portrait instead of smiley/star emojis */}
          <svg className="w-4 h-4 text-white/90 filter drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d={filterIconPath[filterName] || 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'} />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-6 px-4">
      {/* Header */}
      <header className="max-w-5xl mx-auto flex items-center justify-between mb-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-500 text-sm
            hover:bg-white/60 transition-all duration-200 cursor-pointer"
        >
          ← Back
        </button>
        
        <h1 className="text-lg md:text-xl font-semibold text-slate-700 tracking-tight">
          {birthdayName}'s Birthday
        </h1>

        <button
          onClick={onViewGallery}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium
            bg-slate-800 text-white hover:bg-slate-700 transition-all duration-200 cursor-pointer select-none"
        >
          Gallery
          {photoCount > 0 && (
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">
              {photoCount}
            </span>
          )}
        </button>
      </header>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-5">
        {/* Camera View */}
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden shadow-lg bg-slate-100 z-10">
            {cameraError ? (
              <div className="aspect-video flex flex-col items-center justify-center bg-slate-50 rounded-2xl">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                  </svg>
                </div>
                <p className="text-slate-500 text-sm font-medium mb-1">Camera unavailable</p>
                <p className="text-slate-400 text-xs">Allow camera access to continue</p>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full aspect-video object-cover"
                  style={{ 
                    filter: currentFilter.value !== 'none' ? currentFilter.value : undefined,
                    transform: 'scaleX(-1)',
                  }}
                />
                <div className="absolute inset-0 viewfinder-grid pointer-events-none" />

                {countdown && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="text-white text-8xl font-light animate-countdown" key={countdown}>
                      {countdown}
                    </span>
                  </div>
                )}

                {showFlash && (
                  <div className="absolute inset-0 bg-white animate-flash" />
                )}

                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-md">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                  <span className="text-white/70 text-[10px] font-medium tracking-wider uppercase">Live</span>
                </div>
              </>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={startCountdown}
              disabled={isCapturing || cameraError}
              className="p-2.5 rounded-xl bg-white/70 text-slate-500 hover:bg-white
                transition-all duration-200 disabled:opacity-40 cursor-pointer"
              title="3s timer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            {/* Main capture */}
            <button
              onClick={instantCapture}
              disabled={isCapturing || cameraError}
              className="group relative w-16 h-16 rounded-full 
                bg-linear-to-br from-pink-400 to-pink-500
                shadow-md shadow-pink-200/60 hover:shadow-lg hover:shadow-pink-300/60
                hover:scale-105 active:scale-95 transition-all duration-200
                disabled:opacity-40 cursor-pointer"
            >
              <div className="absolute inset-1 rounded-full border-2 border-white/40" />
              <div className="absolute inset-2.5 rounded-full bg-white group-hover:bg-pink-50 transition-colors duration-200" />
            </button>

            {/* Burst mode */}
            <button
              onClick={async () => {
                if (isCapturing || cameraError) return
                setIsCapturing(true)
                for (let i = 0; i < 4; i++) {
                  await new Promise(r => setTimeout(r, i === 0 ? 0 : 800))
                  capturePhoto()
                }
                setIsCapturing(false)
              }}
              disabled={isCapturing || cameraError}
              className="p-2.5 rounded-xl bg-white/70 text-slate-500 hover:bg-white
                transition-all duration-200 disabled:opacity-40 cursor-pointer"
              title="4-shot burst"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </button>
          </div>

          {/* Quick Tips Footer */}
          <div className="text-[11px] text-slate-400 text-center select-none font-medium mt-3 bg-slate-50/50 py-1.5 px-3 rounded-xl border border-slate-100 max-w-md mx-auto">
            ⏱ starts 3s countdown · Tap circle to capture · ⚃ takes 4 burst shots
          </div>

          {/* Last captured preview */}
          {lastPhoto && (
            <div className="flex justify-center animate-pop-in">
              <div className="glass rounded-xl px-3 py-2 inline-flex items-center gap-3 shadow-sm">
                <img src={lastPhoto.dataUrl} alt="Last capture" className="w-14 h-10 object-cover rounded-lg" />
                <div>
                  <p className="text-xs font-medium text-slate-600">Photo captured</p>
                  <p className="text-[10px] text-slate-400">
                    {currentFilter.name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          <div className="glass rounded-2xl p-4 shadow-sm">
            <div className="mb-3 border-b border-slate-200/60 pb-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Filters
              </p>
            </div>

            <div className="grid grid-cols-4 lg:grid-cols-2 gap-1.5 animate-pop-in">
              {FILTERS.map((filter) => (
                <button
                  key={filter.name}
                  onClick={() => setCurrentFilter(filter)}
                  style={{ backgroundColor: filterButtonBackground[filter.name] }}
                  className={`p-1.5 rounded-xl text-center transition-all duration-200 cursor-pointer flex flex-col items-center gap-1 w-full
                    ${currentFilter.name === filter.name
                      ? ' text-slate-900 shadow-sm ring-2 ring-pink-400/50'
                      : 'bg-white/50 hover:bg-white text-slate-500 hover:text-slate-700'
                    }`}
                >
                  {renderMiniPreviewCard(filter.value, filter.name)}
                  <span className="text-[10px] font-semibold leading-tight truncate w-full text-center mt-1">{filter.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
