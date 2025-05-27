# Vector Tracer - Figma Plugin

A powerful Figma plugin that converts raster images into infinitely scalable vector graphics. Transform your images into clean, editable vector paths with advanced tracing capabilities.

![Vector Tracer Plugin](https://img.shields.io/badge/Figma-Plugin-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

### 🎨 **Make Infinitely Scalable Images**
- Convert raster images to vector format
- Perfect quality at any scale
- No pixelation or quality loss

### 🌈 **Convert to Colored Vector Layers**
- Preserve original colors
- Smart color detection and grouping
- Customizable color threshold settings

### ⚡ **Quickly Trace as a Mask**
- Create precise masks from images
- Perfect for complex cutouts
- Adjustable transparency settings

### 🎭 **Restyle Your Images**
- Apply different visual styles
- Black & white conversion
- Color inversion options

### ⚙️ **Advanced Controls**
- **Threshold Control**: Fine-tune edge detection (0-255)
- **Smoothness**: Adjust path smoothing (0-100%)
- **Detail Level**: Control trace complexity (1-10)
- **Fill Options**: Enable/disable shape fills
- **Stroke Options**: Add outlines to vectors
- **Invert Colors**: Reverse color mapping

## 🚀 Installation

### Method 1: Import to Figma (Recommended)

1. **Download the plugin files**:
   - `manifest.json`
   - `code.js`
   - `ui.html`

2. **Open Figma Desktop App**

3. **Go to Plugins Menu**:
   - Click on `Plugins` in the top menu
   - Select `Development` → `Import plugin from manifest...`

4. **Select the manifest.json file** from your downloaded files

5. **The plugin will be installed** and available in your plugins list

### Method 2: Development Setup

```bash
# Clone the repository
git clone https://github.com/uyimosdev/image-to-vector-figma.git

# Navigate to the project directory
cd image-to-vector-figma

# Install dependencies (optional)
npm install

# The plugin is ready to import into Figma
```

## 📖 How to Use

### Step 1: Prepare Your Image
1. **Import an image** into your Figma file
2. **Select the image** you want to trace
3. The image should be placed in a rectangle frame

### Step 2: Open Vector Tracer
1. **Open the plugin**: `Plugins` → `Vector Tracer`
2. The plugin will **automatically detect** your selected image
3. You'll see the **preview panel** and **control settings**

### Step 3: Choose Your Mode
- **Color Mode**: Preserves original colors and creates colored vector paths
- **B&W Mode**: Converts to black and white with threshold control
- **Mask Mode**: Creates transparency masks perfect for cutouts

### Step 4: Adjust Settings
- **Threshold** (0-255): Controls which pixels become part of the vector
  - Lower values = more detail captured
  - Higher values = simpler, cleaner shapes
- **Smoothness** (0-100%): Controls path smoothing
  - 0% = Sharp, detailed edges
  - 100% = Very smooth, simplified curves
- **Detail Level** (1-10): Controls trace complexity
  - 1 = Simple shapes only
  - 10 = Maximum detail capture

### Step 5: Preview and Trace
1. **Adjust settings** and watch the preview update in real-time
2. **Click "Trace Image"** when you're satisfied with the preview
3. The **vector will be created** next to your original image
4. The new vector is **automatically selected** for immediate editing

## 🎯 Use Cases

### 🖼️ **Logo Vectorization**
- Convert raster logos to scalable vectors
- Perfect for brand assets that need to scale

### 🎨 **Illustration Tracing**
- Trace hand-drawn sketches
- Convert artwork to editable vectors

### ✂️ **Image Masking**
- Create precise cutout masks
- Remove backgrounds with vector precision

### 🎭 **Stylized Graphics**
- Create stylized versions of photos
- Generate simplified vector representations

## ⚙️ Technical Details

### Supported Image Formats
- PNG
- JPG/JPEG
- GIF
- WebP
- Any format supported by Figma

### Processing Algorithms
- **Edge Detection**: Custom algorithm for precise edge detection
- **Contour Tracing**: Advanced contour following for smooth paths
- **Path Simplification**: Douglas-Peucker algorithm for optimized vectors
- **Color Analysis**: Smart color grouping and threshold detection

### Performance
- **Real-time Preview**: Instant feedback as you adjust settings
- **Optimized Processing**: Efficient algorithms for fast conversion
- **Memory Management**: Handles large images without performance issues

## 🔧 Advanced Tips

### Getting Better Results

1. **High Contrast Images**: Work best with clear edges and defined shapes
2. **Adjust Threshold**: Start with default (128) and fine-tune based on your image
3. **Use Smoothness**: Higher smoothness for logos, lower for detailed artwork
4. **Detail Level**: Increase for complex images, decrease for simple shapes

### Workflow Integration

1. **Batch Processing**: Select multiple images and process them one by one
2. **Layer Organization**: Traced vectors are automatically named and positioned
3. **Further Editing**: Use Figma's vector tools to refine the traced paths

## 🐛 Troubleshooting

### Common Issues

**Plugin doesn't detect my image:**
- Ensure the image is selected
- Make sure it's in a rectangle frame with an image fill

**Vector looks too simple:**
- Increase the Detail Level setting
- Lower the Smoothness value
- Adjust the Threshold for better edge detection

**Vector is too complex:**
- Increase Smoothness to simplify paths
- Decrease Detail Level
- Use a higher Threshold value

**Preview not updating:**
- Try adjusting any setting to refresh
- Reselect your image
- Close and reopen the plugin

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Open an issue on GitHub
3. Contact us through the Figma Community

## 🙏 Acknowledgments

- Inspired by professional image tracing tools
- Built with the Figma Plugin API
- Thanks to the Figma community for feedback and testing

---

**Made with ❤️ by Uyi Moses for the Figma community**

Transform your images into scalable vectors today! 🚀 