import React, { useState } from 'react'
import { Image } from '../../models/Iforms'

interface ImageGrid {
  images: Image[]
  onSelect: (selectedImage: Image) => void
  current?: Image
}

function ImageGrid({ images, onSelect, current }: ImageGrid) {
  const [selectedImage, setSelectedImage] = useState<Image | null>(
    current ? current : null
  )

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
    <div className="grid grid-cols-8 gap-4 m-10">
      {images.map((image) => (
        <img
          key={image.id}
          src={image.url}
          alt={image.alt}
          className={
            selectedImage && selectedImage.id === image.id
              ? 'border-cyan-200 image-grid'
              : 'image-grid'
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
