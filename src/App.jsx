import { useState } from 'react'
import './index.css'
import LandingPage from './components/LandingPage'
import PhotoBooth from './components/PhotoBooth'
import Gallery from './components/Gallery'
import Confetti from './components/Confetti'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [photos, setPhotos] = useState([])
  const [birthdayName] = useState('Hannah Yoon')
 
  const addPhoto = (photo) => {
    setPhotos((prev) => [photo, ...prev])
  }
 
  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50/60 via-white to-lavender-50/40 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div 
        className="fixed inset-0 opacity-[0.025] pointer-events-none z-0"
        style={{ backgroundImage: 'url(/birthday-pattern.png)', backgroundSize: '500px' }}
      />
      
      <Confetti />

      {/* Main content */}
      <div className="relative z-10">
        {currentPage === 'landing' && (
          <LandingPage 
            onStart={() => setCurrentPage('booth')}
          />
        )}
        
        {currentPage === 'booth' && (
          <PhotoBooth 
            birthdayName={birthdayName}
            onCapture={addPhoto}
            onViewGallery={() => setCurrentPage('gallery')}
            onBack={() => setCurrentPage('landing')}
            photoCount={photos.length}
          />
        )}
        
        {currentPage === 'gallery' && (
          <Gallery 
            photos={photos}
            birthdayName={birthdayName}
            onBack={() => setCurrentPage('booth')}
            onRemovePhoto={removePhoto}
          />
        )}
      </div>
    </div>
  )
}

export default App
