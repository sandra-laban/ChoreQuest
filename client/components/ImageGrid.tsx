import React, { useState } from 'react'
import { Image } from '../../models/Iforms'

interface ImageGrid {
  images: Image[]
  onSelect: (selectedImage: Image) => void
}

function ImageGrid({ images, onSelect }: ImageGrid) {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null)

  function handleImageClick(image: Image) {
    setSelectedImage(image)
    onSelect(image)
  }

  function handleImageKeyDown(event: React.KeyboardEvent, image: Image) {
    // Check if the key pressed is the Enter key (key code 13) or the Space key (key code 32)
    if (event.key === 'Enter') {
      handleImageClick(image)
    }
  }

  return (
    <div className="image-grid">
      {images.map((image) => (
        <img
          key={image.id}
          src={image.url}
          alt={image.alt}
          className={
            selectedImage && selectedImage.id === image.id ? 'selected' : ''
          }
          onClick={() => handleImageClick(image)}
          onKeyDown={(e) => handleImageKeyDown(e, image)}
          tabIndex={0}
        />
      ))}
    </div>
  )
}

export default ImageGrid
