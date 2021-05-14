# Development

## TODO

- [ ] Separate CLI from core and get rid of filesystem dependencies in core
- [ ] Where do black pixels come from in xyz colorspace?
- [x] Avoid quantizing the same pixel twice
- [ ] Performance
  - [ ] Initialize arrays to fixed size?
- [ ] Separate variable components
  - [ ] Colorspace conversions
  - [ ] Distance measuring
  - [ ] Color reducer within a cell

## Classes

[Mermaid class diagram](https://mermaid-js.github.io/mermaid/#/classDiagram)

```mermaid
classDiagram

%% model
class GraphicMode
class PixelImage
class ColorMap

%% conversion
class Converter
Converter : convert(IImageData, PixelImage)
class Quantizer
class Palette
class ColorSpace

%% factories / configuration

class GraphicModes
GraphicModes --> PixelImage: a collection of factories for

class Palettes
Palettes --> Palette: is collection of instances of

class ColorSpaces
ColorSpaces --> ColorSpace: is collection of instances of

Converter o-- Quantizer
Quantizer o-- Palette
Quantizer o-- ColorSpace

PixelImage *-- "*" ColorMap
PixelImage o-- GraphicMode

Converter --> PixelImage: paints on
```

## References

<https://en.wikipedia.org/wiki/Perceptual_hashing>
<https://github.com/pahen/madge>
