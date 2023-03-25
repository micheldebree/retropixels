import PixelImage from '../model/PixelImage'

export function concat (arrayBuffers: Uint8Array[]): Uint8Array {
  if (arrayBuffers.length === 1) {
    return arrayBuffers[0]
  }

  return arrayBuffers.reduce((total, current) => {
    const result: Uint8Array = new Uint8Array(total.length + current.length)
    result.set(total, 0)
    result.set(current, total.length)
    return result
  })
}

export function pad (buffer: Uint8Array, numberOfBytes: number): Uint8Array {
  return concat([buffer, new Uint8Array(numberOfBytes)])
}

export function convertBitmap (pixelImage: PixelImage): Uint8Array {
  const bitmapSize: number = (pixelImage.mode.width * pixelImage.mode.height) / pixelImage.mode.pixelsPerByte()
  const bitmap: Uint8Array = new Uint8Array(bitmapSize)
  let bitmapIndex: number = 0

  pixelImage.mode.forEachCell(0, (x, y) => {
    pixelImage.mode.forEachCellRow(y, rowY => {
      // pack one character's row worth of pixels into one byte
      pixelImage.mode.forEachByte(x, byteX => {
        let packedByte: number = 0
        if (byteX >= pixelImage.mode.fliBugSize) {
          pixelImage.mode.forEachPixel(byteX, (pixelX, shiftTimes) => {
            packedByte |= pixelImage.mapPixelIndex(pixelX, rowY) << shiftTimes
          })
        }
        bitmap[bitmapIndex] = packedByte
        bitmapIndex += 1
      })
    })
  })

  return bitmap
}

export function convertScreenram (
  pixelImage: PixelImage,
  lowerColorIndex: number,
  upperColorIndex: number,
  yOffset: number = 0
): Uint8Array {
  return pixelImage.extractAttributeData(yOffset, (x, y) => {
    const upperColor: number = pixelImage.colorMaps[upperColorIndex].getIndexOrDefault(x, y)
    const lowerColor: number = pixelImage.colorMaps[lowerColorIndex].getIndexOrDefault(x, y)
    // pack two colors in one byte
    return (
      ((upperColor << 4) & 0xf0) | (lowerColor & 0x0f)
    )
  })
}

export function convertColorram (pixelImage: PixelImage, colorMapIndex: number): Uint8Array {
  return pixelImage.extractAttributeData(0, (x, y) => {
    return pixelImage.colorMaps[colorMapIndex].getIndexOrDefault(x, y) & 0x0f
  })
}
