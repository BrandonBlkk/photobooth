import { useState, useRef } from 'react'
import html2canvas from 'html2canvas-pro'

const STRIP_COLORS = {
  white: { gradient: 'from-gray-50 to-white', bg: '#ffffff', text: '#334155', sub: '#94a3b8' },
  pink: { gradient: 'from-pink-100 to-pink-200', bg: '#fce7f3', text: '#db2777', sub: '#f9a8d4' },
  lavender: { gradient: 'from-lavender-100 to-lavender-200', bg: '#ede9fe', text: '#7c3aed', sub: '#c4b5fd' },
  mint: { gradient: 'from-mint-100 to-mint-200', bg: '#ccfbf1', text: '#0d9488', sub: '#5eead4' },
  dark: { gradient: 'from-slate-800 to-slate-900', bg: '#1e293b', text: '#f1f5f9', sub: '#64748b' },
}

const STRIP_DECORATIONS = {
  clean: { name: 'Clean' },
  dots: { name: 'Dots' },
  confetti: { name: 'Confetti' },
  ribbons: { name: 'Ribbons' },
  sparkles: { name: 'Sparkles' },
}

const getStripDecorationStyle = (decoration) => {
  switch (decoration) {
    case 'dots':
      return {
        backgroundImage: 'radial-gradient(circle, rgba(244,114,182,0.35) 0 2px, transparent 2.5px), radial-gradient(circle, rgba(14,165,233,0.22) 0 1.5px, transparent 2px)',
        backgroundPosition: '0 0, 9px 9px',
        backgroundSize: '18px 18px',
      }
    case 'confetti':
      return {
        backgroundImage: 'linear-gradient(135deg, rgba(244,114,182,0.28) 0 8px, transparent 8px), linear-gradient(45deg, rgba(45,212,191,0.24) 0 6px, transparent 6px), radial-gradient(circle, rgba(251,191,36,0.35) 0 2px, transparent 2.5px)',
        backgroundPosition: '0 0, 12px 10px, 5px 8px',
        backgroundSize: '34px 34px, 28px 28px, 22px 22px',
      }
    case 'ribbons':
      return {
        backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 16px, rgba(244,114,182,0.16) 16px 20px, transparent 20px 34px), repeating-linear-gradient(45deg, transparent 0 22px, rgba(124,58,237,0.12) 22px 25px, transparent 25px 42px)',
        backgroundSize: '100% 100%',
      }
    case 'sparkles':
      return {
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(251,191,36,0.45) 0 1.5px, transparent 2px), radial-gradient(circle at 75% 20%, rgba(196,181,253,0.5) 0 1.5px, transparent 2.5px), radial-gradient(circle at 50% 80%, rgba(94,234,212,0.45) 0 1px, transparent 2px)',
        backgroundSize: '64px 64px',
      }
    default:
      return {}
  }
}

const drawStripDecoration = (ctx, decoration, width, height, scale) => {
  if (decoration === 'dots') {
    ctx.fillStyle = 'rgba(244,114,182,0.35)'
    for (let y = 0; y < height; y += 18 * scale) {
      for (let x = 0; x < width; x += 18 * scale) {
        ctx.beginPath()
        ctx.arc(x, y, 2 * scale, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    ctx.fillStyle = 'rgba(14,165,233,0.22)'
    for (let y = 9 * scale; y < height; y += 18 * scale) {
      for (let x = 9 * scale; x < width; x += 18 * scale) {
        ctx.beginPath()
        ctx.arc(x, y, 1.5 * scale, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  if (decoration === 'confetti') {
    const pieces = [
      [0, 0, 'rgba(244,114,182,0.28)', 135, 8, 24],
      [12, 10, 'rgba(45,212,191,0.24)', 45, 6, 20],
      [5, 8, 'rgba(251,191,36,0.35)', 0, 4, 4],
    ]

    pieces.forEach(([offsetX, offsetY, color, angle, pieceW, pieceH]) => {
      ctx.fillStyle = color
      for (let y = offsetY * scale; y < height; y += 28 * scale) {
        for (let x = offsetX * scale; x < width; x += 34 * scale) {
          ctx.save()
          ctx.translate(x, y)
          ctx.rotate((angle * Math.PI) / 180)
          ctx.fillRect(0, 0, pieceW * scale, pieceH * scale)
          ctx.restore()
        }
      }
    })
  }

  if (decoration === 'ribbons') {
    const drawRibbon = (color, angle, spacing, thickness, offset) => {
      ctx.save()
      ctx.rotate((angle * Math.PI) / 180)
      ctx.fillStyle = color
      for (let x = -width; x < width * 2; x += spacing * scale) {
        ctx.fillRect(x + offset * scale, -height, thickness * scale, height * 3)
      }
      ctx.restore()
    }

    drawRibbon('rgba(244,114,182,0.16)', -45, 34, 4, 16)
    drawRibbon('rgba(124,58,237,0.12)', 45, 42, 3, 22)
  }

  if (decoration === 'sparkles') {
    const sparkles = [
      [0.2, 0.3, 'rgba(251,191,36,0.45)'],
      [0.75, 0.2, 'rgba(196,181,253,0.5)'],
      [0.5, 0.8, 'rgba(94,234,212,0.45)'],
      [0.18, 0.74, 'rgba(244,114,182,0.35)'],
      [0.88, 0.63, 'rgba(251,191,36,0.4)'],
    ]

    sparkles.forEach(([x, y, color]) => {
      const cx = x * width
      const cy = y * height
      const size = 7 * scale

      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(cx, cy - size)
      ctx.lineTo(cx + size * 0.35, cy - size * 0.35)
      ctx.lineTo(cx + size, cy)
      ctx.lineTo(cx + size * 0.35, cy + size * 0.35)
      ctx.lineTo(cx, cy + size)
      ctx.lineTo(cx - size * 0.35, cy + size * 0.35)
      ctx.lineTo(cx - size, cy)
      ctx.lineTo(cx - size * 0.35, cy - size * 0.35)
      ctx.closePath()
      ctx.fill()
    })
  }
}

const STRIP_DATE = new Date().toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

const sanitizeFilePart = (value) => {
  const safeValue = value.trim().replace(/[^a-z0-9-_]+/gi, '-').replace(/^-+|-+$/g, '')
  return safeValue || 'birthday'
}

const formatPhotoTimestamp = (timestamp) => (
  timestamp ? timestamp.replace(/[:.]/g, '-') : 'capture'
)

function StripContent({
  forExport = false,
  stripRef,
  currentColorTheme,
  stripColor,
  stripDecoration,
  selectedForStrip,
  photos,
  birthdayName,
}) {
  const containerStyle = {
    ...(forExport ? { width: '500px' } : {}),
    backgroundColor: currentColorTheme.bg,
    ...getStripDecorationStyle(stripDecoration),
  }
  const containerClass = forExport ? 'p-5' : 'p-3 sm:p-4'
  const headerClass = forExport ? 'text-center mb-4' : 'text-center mb-2'
  const gridClass = forExport ? 'space-y-2 mb-4' : 'space-y-1.5 mb-2'
  const rowClass = forExport ? 'grid grid-cols-2 gap-2' : 'grid grid-cols-2 gap-1.5'
  const imageRadius = forExport ? '8px' : '6px'

  return (
    <div
      ref={forExport ? stripRef : undefined}
      data-strip-export={forExport ? 'true' : undefined}
      className={containerClass}
      style={containerStyle}
    >
      {/* Header */}
      <div className={headerClass}>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: forExport ? '20px' : '14px',
          fontWeight: '600',
          color: currentColorTheme.text,
          marginBottom: '2px',
          letterSpacing: '-0.02em',
        }}>
          {birthdayName}'s Birthday
        </p>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: forExport ? '11px' : '8px',
          color: currentColorTheme.sub,
          fontWeight: '400',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          {STRIP_DATE}
        </p>
      </div>

      {/* Photos Grid: 2 Columns (Host on Left, Guest on Right) x 4 Rows */}
      <div className={gridClass}>
        {[0, 1, 2, 3].map((rowIdx) => {
          const hostPhotoUrl = `/photos/me-${rowIdx + 1}.jfif`
          const guestPhotoIndex = selectedForStrip[rowIdx]
          const guestPhoto = guestPhotoIndex !== undefined ? photos[guestPhotoIndex] : null

          return (
            <div key={rowIdx} className={rowClass}>
              {/* Left Column: Host Photo */}
              <div>
                <img
                  src={hostPhotoUrl}
                  alt={`Host ${rowIdx + 1}`}
                  style={{
                    width: '100%',
                    aspectRatio: '4/3',
                    objectFit: 'cover',
                    borderRadius: imageRadius,
                    border: `2px solid ${stripColor === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                  }}
                />
              </div>
              {/* Right Column: Guest Photo */}
              <div>
                {guestPhoto ? (
                  <img
                    src={guestPhoto.dataUrl}
                    alt={`Guest ${rowIdx + 1}`}
                    style={{
                      width: '100%',
                      aspectRatio: '4/3',
                      objectFit: 'cover',
                      borderRadius: imageRadius,
                      border: `2px solid ${stripColor === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '4/3',
                      borderRadius: imageRadius,
                      border: `2px dashed ${stripColor === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
                      backgroundColor: stripColor === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: currentColorTheme.sub,
                    }}
                  >
                    <span style={{ fontSize: forExport ? '10px' : '8px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Slot {rowIdx + 1}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className={forExport ? 'text-center mt-3' : 'text-center mt-2'}>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: forExport ? '9px' : '7px',
          color: currentColorTheme.sub,
          letterSpacing: forExport ? '3px' : '2px',
          textTransform: 'uppercase',
          fontWeight: '500',
        }}>
          Birthday Photobooth
        </p>
      </div>
    </div>
  )
}

export default function Gallery({ photos, birthdayName, onBack, onRemovePhoto }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [stripMode, setStripMode] = useState(false)
  const [selectedForStrip, setSelectedForStrip] = useState([])
  const [stripColor, setStripColor] = useState('white')
  const [stripDecoration, setStripDecoration] = useState('clean')
  const [showStripPreview, setShowStripPreview] = useState(false)
  const stripRef = useRef(null)

  const downloadPhoto = (photo) => {
    const link = document.createElement('a')
    link.download = `${sanitizeFilePart(birthdayName)}-photo-${formatPhotoTimestamp(photo.timestamp)}.png`
    link.href = photo.dataUrl
    link.click()
  }

  const toggleStripSelection = (index) => {
    setSelectedForStrip(prev => {
      if (prev.includes(index)) return prev.filter(i => i !== index)
      if (prev.length >= 4) return prev
      return [...prev, index]
    })
  }

  const downloadStrip = async () => {
    if (!stripRef.current) return
    try {
      const scale = 2
      const contentCanvas = await html2canvas(stripRef.current, {
        backgroundColor: null,
        scale,
        useCORS: true,
        onclone: (doc) => {
          const clonedStrip = doc.querySelector('[data-strip-export="true"]')
          if (!clonedStrip) return
          clonedStrip.style.backgroundColor = 'transparent'
          clonedStrip.style.backgroundImage = 'none'
        },
      })
      const canvas = document.createElement('canvas')
      canvas.width = contentCanvas.width
      canvas.height = contentCanvas.height

      const ctx = canvas.getContext('2d')
      ctx.fillStyle = STRIP_COLORS[stripColor].bg
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      drawStripDecoration(ctx, stripDecoration, canvas.width, canvas.height, scale)
      ctx.drawImage(contentCanvas, 0, 0)

      const link = document.createElement('a')
      link.download = `${sanitizeFilePart(birthdayName)}-strip-${selectedForStrip.join('-') || 'photos'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Failed to generate strip:', err)
    }
  }

  const currentColorTheme = STRIP_COLORS[stripColor]

  return (
    <div className="min-h-screen py-6 px-4">
      {/* Header */}
      <header className="max-w-5xl mx-auto flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-500 text-sm
            hover:bg-white/60 transition-all duration-200 cursor-pointer"
        >
          ← Back
        </button>
        
        <h1 className="text-lg md:text-xl font-semibold text-slate-700 tracking-tight">
          {photos.length} Photos of {birthdayName} 
        </h1>

        <button
          onClick={() => { setStripMode(!stripMode); setSelectedForStrip([]); setShowStripPreview(false) }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium 
            transition-all duration-200 cursor-pointer
            ${stripMode 
              ? 'bg-slate-800 text-white' 
              : 'bg-white/70 text-slate-600 hover:bg-white'
            }`}
        >
          {stripMode ? 'Cancel' : 'Make Strip'}
        </button>
      </header>

      {photos.length === 0 ? (
        <div className="max-w-sm mx-auto text-center py-24 animate-slide-up">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-600 mb-1">No photos yet</h2>
          <p className="text-sm text-slate-400 mb-6">
            Head back to the booth and start capturing
          </p>
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-medium
              hover:bg-slate-700 active:scale-[0.98] transition-all duration-200 cursor-pointer select-none"
          >
            Start Capturing
          </button>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          {/* Strip mode bar */}
          {stripMode && (
            <div className="glass rounded-xl px-4 py-3 mb-4 animate-slide-up">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <p className="text-sm text-slate-500">
                  Select up to 4 photos <span className="text-slate-400">({selectedForStrip.length}/4)</span>
                </p>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Color picker */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Color</span>
                    {Object.entries(STRIP_COLORS).map(([key, val]) => (
                      <button
                        key={key}
                        onClick={() => setStripColor(key)}
                        className={`w-5 h-5 rounded-full bg-linear-to-br ${val.gradient} border transition-all duration-200 cursor-pointer
                          ${stripColor === key ? 'border-slate-800 scale-125 shadow-sm' : 'border-slate-200'}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Decor</span>
                    {Object.entries(STRIP_DECORATIONS).map(([key, val]) => (
                      <button
                        key={key}
                        onClick={() => setStripDecoration(key)}
                        title={val.name}
                        aria-label={val.name}
                        className={`w-7 h-5 rounded-md border transition-all duration-200 cursor-pointer
                          ${stripDecoration === key ? 'border-slate-800 scale-110 shadow-sm' : 'border-slate-200'}`}
                        style={{
                          backgroundColor: currentColorTheme.bg,
                          ...getStripDecorationStyle(key),
                        }}
                      />
                    ))}
                  </div>

                  {selectedForStrip.length > 0 && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowStripPreview(true)}
                        className="px-3.5 py-1.5 rounded-lg bg-white text-slate-600 text-xs font-medium 
                          border border-slate-200 hover:border-slate-300 transition-all duration-200 cursor-pointer"
                      >
                        Preview
                      </button>
                      <button
                        onClick={downloadStrip}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-medium 
                          hover:bg-slate-700 transition-all duration-200 cursor-pointer"
                      >
                        Download
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Photo grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((photo, index) => (
              <div
                key={index}
                className={`group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md 
                  transition-all duration-200 cursor-pointer animate-pop-in
                  ${stripMode && selectedForStrip.includes(index) 
                    ? 'ring-2 ring-pink-400 ring-offset-1 scale-[1.02]' 
                    : ''
                  }`}
                style={{ animationDelay: `${index * 0.04}s`, opacity: 0 }}
                onClick={() => stripMode ? toggleStripSelection(index) : setSelectedPhoto(photo)}
              >
                <img src={photo.dataUrl} alt={`Photo ${index + 1}`} className="w-full aspect-4/3 object-cover" />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="text-white/70 text-[10px]">{photo.filter}</span>
                    {!stripMode && (
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); downloadPhoto(photo) }}
                          className="p-1 rounded bg-white/20 backdrop-blur-sm text-white 
                            hover:bg-white/40 transition-all duration-200 cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onRemovePhoto(index) }}
                          className="p-1 rounded bg-white/20 backdrop-blur-sm text-white 
                            hover:bg-red-400/60 transition-all duration-200 cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Selection badge */}
                {stripMode && selectedForStrip.includes(index) && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-pink-400 text-white 
                    flex items-center justify-center text-[10px] font-semibold shadow-sm animate-pop-in">
                    {selectedForStrip.indexOf(index) + 1}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Hidden strip render target */}
          {selectedForStrip.length > 0 && (
            <div className="fixed left-[-9999px] top-0">
              <StripContent
                forExport={true}
                stripRef={stripRef}
                currentColorTheme={currentColorTheme}
                stripColor={stripColor}
                stripDecoration={stripDecoration}
                selectedForStrip={selectedForStrip}
                photos={photos}
                birthdayName={birthdayName}
              />
            </div>
          )}
        </div>
      )}

      {/* Photo Lightbox */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-3xl w-full animate-bounce-in" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-2xl p-2 shadow-2xl">
              <img src={selectedPhoto.dataUrl} alt="Full size" className="w-full rounded-xl" />
              <div className="flex items-center justify-between mt-2.5 px-2 pb-1">
                <p className="text-xs text-slate-400">
                  {selectedPhoto.filter}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadPhoto(selectedPhoto)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-medium 
                      hover:bg-slate-700 transition-all duration-200 cursor-pointer"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="px-3 py-1.5 rounded-lg text-slate-500 text-xs font-medium 
                      hover:bg-slate-100 transition-all duration-200 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Strip Preview Modal */}
      {showStripPreview && selectedForStrip.length > 0 && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4"
          onClick={() => setShowStripPreview(false)}
        >
          <div 
            className="relative w-full max-w-sm max-h-[calc(100dvh-1rem)] animate-bounce-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Preview card */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[calc(100dvh-1rem)] flex flex-col">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h3 className="text-sm font-semibold text-slate-700">Strip Preview</h3>
                <button
                  onClick={() => setShowStripPreview(false)}
                  className="p-1 rounded-md hover:bg-slate-100 text-slate-400 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Strip preview content */}
              <div className="min-h-0 flex-1 flex items-center justify-center px-3 py-2 overflow-hidden">
                <div 
                  className="rounded-xl overflow-hidden shadow-inner"
                  style={{
                    backgroundColor: currentColorTheme.bg,
                    width: 'min(100%, 22rem, calc((100dvh - 12.5rem) * 0.56))',
                  }}
                >
                  <StripContent
                    currentColorTheme={currentColorTheme}
                    stripColor={stripColor}
                    stripDecoration={stripDecoration}
                    selectedForStrip={selectedForStrip}
                    photos={photos}
                    birthdayName={birthdayName}
                  />
                </div>
              </div>

              {/* Color switcher in preview */}
              <div className="px-4 pb-2 flex items-center justify-center gap-2 shrink-0">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider mr-1">Theme</span>
                {Object.entries(STRIP_COLORS).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setStripColor(key)}
                    className={`w-6 h-6 rounded-full bg-gradient-to-br ${val.gradient} border transition-all duration-200 cursor-pointer
                      ${stripColor === key ? 'border-slate-800 scale-110 shadow-sm' : 'border-slate-200'}`}
                  />
                ))}
              </div>

              <div className="px-4 pb-2 flex items-center justify-center gap-2 shrink-0">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider mr-1">Decor</span>
                {Object.entries(STRIP_DECORATIONS).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setStripDecoration(key)}
                    title={val.name}
                    aria-label={val.name}
                    className={`w-8 h-6 rounded-md border transition-all duration-200 cursor-pointer
                      ${stripDecoration === key ? 'border-slate-800 scale-110 shadow-sm' : 'border-slate-200'}`}
                    style={{
                      backgroundColor: currentColorTheme.bg,
                      ...getStripDecorationStyle(key),
                    }}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 pt-2 flex gap-2 shrink-0">
                <button
                  onClick={() => setShowStripPreview(false)}
                  className="flex-1 py-2.5 rounded-xl text-slate-500 text-sm font-medium 
                    hover:bg-slate-50 transition-all duration-200 cursor-pointer"
                >
                  Back to edit
                </button>
                <button
                  onClick={() => { downloadStrip(); setShowStripPreview(false) }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-medium 
                    hover:bg-slate-700 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  Download Strip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
