import PixelImage from '../model/PixelImage'
import GraphicMode from '../model/GraphicMode'

type PixelImageFactory = (props?: Record<string, unknown>) => PixelImage

// C64 modes {{{

const bitmap: PixelImageFactory = (props: Record<string, unknown>): PixelImage => {
  const { hires, nomaps } = props
  const isHires = hires as boolean
  const isNoMaps = nomaps as boolean

  const width: number = isHires ? 320 : 160

  const gm: GraphicMode = new GraphicMode('bitmap', width, 200)
  gm.pixelWidth = isHires ? 1 : 2

  const result = new PixelImage(gm)
  if (!isHires) {
    // background
    result.addColorMap()
  }
  if (isNoMaps) {
    result.addColorMap()
    result.addColorMap()
    if (!isHires) {
      result.addColorMap()
    }
  } else {
    result.addColorMap(gm.pixelsPerByte(), gm.rowsPerCell)
    result.addColorMap(gm.pixelsPerByte(), gm.rowsPerCell)
    if (!isHires) {
      result.addColorMap(gm.pixelsPerByte(), gm.rowsPerCell)
    }
  }
  return result
}

export const fli: PixelImageFactory = (props: Record<string, unknown>): PixelImage => {
  if (props.hires as boolean) {
    return createHiresFLI()
  }

  return createMulticolorFLI()
}

function createMulticolorFLI (): PixelImage {
  const gm: GraphicMode = new GraphicMode('fli', 160, 200)
  gm.pixelWidth = 2
  gm.fliBugSize = 3 * 4
  gm.indexMap = {
    0: 0,
    1: 3,
    2: 2,
    3: 1
  }
  const result = new PixelImage(gm)
  result.addColorMap()
  result.addColorMap(4, 8)
  result.addColorMap(4, 1)
  result.addColorMap(4, 1)
  return result
}

function createHiresFLI (): PixelImage {
  const gm: GraphicMode = new GraphicMode('fli', 320, 200)
  gm.fliBugSize = 3 * 8
  const result = new PixelImage(gm)
  result.addColorMap(8, 1)
  result.addColorMap(8, 1)
  return result
}

const sprites: PixelImageFactory = (props: Record<string, unknown>): PixelImage => {
  const { rows, columns, hires, nomaps } = props
  const nrRows = Number(rows)
  const nrColumns = Number(columns)
  const isHires = hires as boolean
  const isNoMaps = nomaps as boolean

  const pixelsPerColumn = isHires ? 24 : 12

  const height: number = nrRows * 21
  const width: number = nrColumns * pixelsPerColumn

  const gm: GraphicMode = new GraphicMode('sprites', width, height)
  gm.pixelWidth = isHires ? 1 : 2
  gm.bytesPerCellRow = 3
  gm.rowsPerCell = 21
  gm.indexMap = {
    0: 0,
    1: 1,
    2: 3,
    3: 2
  }

  const result = new PixelImage(gm)
  // background
  result.addColorMap()
  if (!isHires) {
    // d025
    result.addColorMap()
    // d026
    result.addColorMap()
  }
  // d027..d02e
  if (isNoMaps) {
    result.addColorMap()
  } else {
    result.addColorMap(pixelsPerColumn, 21)
  }
  return result
}

export const GraphicModes = {
  bitmap,
  fli,
  sprites
}
