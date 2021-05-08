```mermaid
classDiagram

class Converter
Converter : convert(IImageData, PixelImage)

class Poker
class Quantizer
class Palette
class GraphicMode
class PixelImage
class ColorMap
class Optimizer
Optimizer : optimizeColormaps(PixelImage, IImageData)

Converter *-- Optimizer
Converter o-- Poker
Optimizer o-- Poker
Poker o-- Quantizer
Quantizer o-- Palette

PixelImage *-- "*" ColorMap
PixelImage o-- GraphicMode

```