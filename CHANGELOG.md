# Changelog

All notable changes to the Vector Tracer Figma Plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added
- 🎨 **Initial Release** - Complete image to vector conversion functionality
- 🌈 **Color Mode** - Preserve original colors in vector conversion
- ⚫ **Black & White Mode** - Convert images to monochrome vectors
- 🎭 **Mask Mode** - Create transparency masks from images
- ⚙️ **Advanced Controls**:
  - Threshold adjustment (0-255)
  - Smoothness control (0-100%)
  - Detail level settings (1-10)
  - Fill/stroke options
  - Color inversion
- 🖼️ **Real-time Preview** - See changes instantly as you adjust settings
- 📐 **Smart Positioning** - Traced vectors appear next to original images
- 🎯 **Auto-selection** - New vectors are automatically selected for editing
- 🔧 **Edge Detection** - Advanced algorithms for precise edge detection
- 📏 **Path Simplification** - Douglas-Peucker algorithm for optimized vectors
- 🎨 **Modern UI** - Clean, intuitive interface matching Figma's design language

### Technical Features
- Custom contour tracing algorithm
- Efficient image processing pipeline
- Memory-optimized for large images
- Cross-platform compatibility
- TypeScript definitions included

### Supported Formats
- PNG, JPG/JPEG, GIF, WebP
- Any image format supported by Figma

## [Unreleased]

### Planned Features
- 🎨 **Multi-color Support** - Separate layers for different colors
- 🔄 **Batch Processing** - Process multiple images at once
- 💾 **Preset Management** - Save and load custom settings
- 🎯 **Advanced Algorithms** - Additional tracing algorithms
- 📊 **Performance Improvements** - Faster processing for large images
- 🌐 **Export Options** - Direct SVG export capabilities

---

## Version History

- **v1.0.0** - Initial release with core functionality
- **v0.9.0** - Beta testing and refinements
- **v0.8.0** - Alpha version with basic tracing
- **v0.1.0** - Initial development prototype 