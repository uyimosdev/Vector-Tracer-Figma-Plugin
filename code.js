// Vector Tracer Plugin - Main Code
// Handles image processing and vector conversion

figma.showUI(__html__, {
    width: 280,
    height: 600,
    themeColors: true
});

let currentSelection = null;
let imageData = null;

// Listen for selection changes
figma.on('selectionchange', () => {
    checkSelection();
});

// Initial selection check
checkSelection();

function checkSelection() {
    const selection = figma.currentPage.selection;

    if (selection.length === 1 && selection[0].type === 'RECTANGLE' && selection[0].fills.length > 0) {
        const node = selection[0];
        const fill = node.fills[0];

        if (fill.type === 'IMAGE') {
            currentSelection = node;
            figma.ui.postMessage({
                type: 'selection-changed',
                hasImage: true
            });
            return;
        }
    }

    currentSelection = null;
    figma.ui.postMessage({
        type: 'selection-changed',
        hasImage: false
    });
}

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
    try {
        switch (msg.type) {
            case 'preview':
                await handlePreview(msg.mode, msg.settings);
                break;
            case 'trace':
                await handleTrace(msg.mode, msg.settings);
                break;
        }
    } catch (error) {
        console.error('Plugin error:', error);
        figma.ui.postMessage({
            type: 'trace-error',
            error: error.message
        });
    }
};

async function handlePreview(mode, settings) {
    if (!currentSelection) return;

    try {
        const imageBytes = await getImageBytes(currentSelection);
        if (!imageBytes) return;

        // Process image for preview (simplified)
        const processedData = await processImageData(imageBytes, mode, settings, true);

        figma.ui.postMessage({
            type: 'preview-ready',
            previewData: processedData
        });
    } catch (error) {
        console.error('Preview error:', error);
    }
}

async function handleTrace(mode, settings) {
    if (!currentSelection) {
        throw new Error('No image selected');
    }

    try {
        const imageBytes = await getImageBytes(currentSelection);
        if (!imageBytes) {
            throw new Error('Could not extract image data');
        }

        // Process image and create vector
        const vectorPaths = await processImageData(imageBytes, mode, settings, false);

        if (vectorPaths && vectorPaths.length > 0) {
            await createVectorFromPaths(vectorPaths, mode, settings);

            figma.ui.postMessage({
                type: 'trace-complete'
            });
        } else {
            throw new Error('No vector paths generated');
        }

    } catch (error) {
        throw new Error(`Tracing failed: ${error.message}`);
    }
}

async function getImageBytes(node) {
    try {
        const fill = node.fills[0];
        if (fill.type !== 'IMAGE') return null;

        const image = figma.getImageByHash(fill.imageHash);
        if (!image) return null;

        return await image.getBytesAsync();
    } catch (error) {
        console.error('Error getting image bytes:', error);
        return null;
    }
}

async function processImageData(imageBytes, mode, settings, isPreview = false) {
    // Convert image bytes to ImageData
    const imageData = await bytesToImageData(imageBytes);
    if (!imageData) return null;

    // Apply processing based on mode and settings
    let processedData;

    switch (mode) {
        case 'color':
            processedData = processColorImage(imageData, settings);
            break;
        case 'bw':
            processedData = processBlackWhiteImage(imageData, settings);
            break;
        case 'mask':
            processedData = processMaskImage(imageData, settings);
            break;
        default:
            processedData = processColorImage(imageData, settings);
    }

    if (isPreview) {
        // Return base64 data URL for preview
        return imageDataToDataURL(processedData);
    } else {
        // Return vector paths
        return imageDataToVectorPaths(processedData, settings);
    }
}

async function bytesToImageData(bytes) {
    try {
        // Create a blob from bytes
        const blob = new Blob([bytes]);
        const url = URL.createObjectURL(blob);

        // Create image element
        const img = new Image();

        return new Promise((resolve, reject) => {
            img.onload = () => {
                // Create canvas and get image data
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                URL.revokeObjectURL(url);
                resolve(imageData);
            };

            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Failed to load image'));
            };

            img.src = url;
        });
    } catch (error) {
        console.error('Error converting bytes to ImageData:', error);
        return null;
    }
}

function processColorImage(imageData, settings) {
    const { data, width, height } = imageData;
    const processedData = new Uint8ClampedArray(data);

    // Apply threshold and color processing
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Calculate luminance
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

        if (settings.invert) {
            processedData[i] = 255 - r;
            processedData[i + 1] = 255 - g;
            processedData[i + 2] = 255 - b;
        }

        // Apply threshold
        if (luminance < settings.threshold) {
            if (!settings.invert) {
                processedData[i] = 0;
                processedData[i + 1] = 0;
                processedData[i + 2] = 0;
            }
        }

        processedData[i + 3] = a;
    }

    return new ImageData(processedData, width, height);
}

function processBlackWhiteImage(imageData, settings) {
    const { data, width, height } = imageData;
    const processedData = new Uint8ClampedArray(data);

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Convert to grayscale
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;

        // Apply threshold
        const bw = gray > settings.threshold ? 255 : 0;

        if (settings.invert) {
            const invertedBw = 255 - bw;
            processedData[i] = invertedBw;
            processedData[i + 1] = invertedBw;
            processedData[i + 2] = invertedBw;
        } else {
            processedData[i] = bw;
            processedData[i + 1] = bw;
            processedData[i + 2] = bw;
        }

        processedData[i + 3] = a;
    }

    return new ImageData(processedData, width, height);
}

function processMaskImage(imageData, settings) {
    const { data, width, height } = imageData;
    const processedData = new Uint8ClampedArray(data);

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Calculate luminance
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

        // Create mask based on threshold
        if (luminance > settings.threshold) {
            processedData[i] = 255;
            processedData[i + 1] = 255;
            processedData[i + 2] = 255;
            processedData[i + 3] = settings.invert ? 0 : 255;
        } else {
            processedData[i] = 0;
            processedData[i + 1] = 0;
            processedData[i + 2] = 0;
            processedData[i + 3] = settings.invert ? 255 : 0;
        }
    }

    return new ImageData(processedData, width, height);
}

function imageDataToDataURL(imageData) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = imageData.width;
    canvas.height = imageData.height;

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
}

function imageDataToVectorPaths(imageData, settings) {
    // Simplified edge detection and path tracing
    const { data, width, height } = imageData;
    const paths = [];

    // Create binary mask
    const mask = new Array(width * height).fill(false);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            mask[y * width + x] = luminance > settings.threshold;
        }
    }

    // Find contours using marching squares algorithm (simplified)
    const contours = findContours(mask, width, height, settings);

    // Convert contours to SVG paths
    contours.forEach(contour => {
        if (contour.length > 2) {
            const path = contourToPath(contour, settings.smoothness);
            if (path) {
                paths.push(path);
            }
        }
    });

    return paths;
}

function findContours(mask, width, height, settings) {
    const contours = [];
    const visited = new Array(width * height).fill(false);

    for (let y = 0; y < height - 1; y++) {
        for (let x = 0; x < width - 1; x++) {
            const idx = y * width + x;

            if (!visited[idx] && mask[idx]) {
                const contour = traceContour(mask, width, height, x, y, visited);
                if (contour.length > settings.detail * 2) {
                    contours.push(contour);
                }
            }
        }
    }

    return contours;
}

function traceContour(mask, width, height, startX, startY, visited) {
    const contour = [];
    const directions = [
        [1, 0], [1, 1], [0, 1], [-1, 1],
        [-1, 0], [-1, -1], [0, -1], [1, -1]
    ];

    let x = startX;
    let y = startY;
    let dir = 0;

    do {
        const idx = y * width + x;
        if (!visited[idx]) {
            visited[idx] = true;
            contour.push({ x, y });
        }

        // Find next point
        let found = false;
        for (let i = 0; i < 8; i++) {
            const newDir = (dir + i) % 8;
            const newX = x + directions[newDir][0];
            const newY = y + directions[newDir][1];

            if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
                const newIdx = newY * width + newX;
                if (mask[newIdx]) {
                    x = newX;
                    y = newY;
                    dir = newDir;
                    found = true;
                    break;
                }
            }
        }

        if (!found) break;

    } while (!(x === startX && y === startY) && contour.length < 10000);

    return contour;
}

function contourToPath(contour, smoothness) {
    if (contour.length < 3) return null;

    // Simplify path based on smoothness
    const simplified = simplifyPath(contour, smoothness / 100);

    if (simplified.length < 3) return null;

    // Convert to SVG path string
    let pathString = `M ${simplified[0].x} ${simplified[0].y}`;

    for (let i = 1; i < simplified.length; i++) {
        pathString += ` L ${simplified[i].x} ${simplified[i].y}`;
    }

    pathString += ' Z';

    return pathString;
}

function simplifyPath(points, tolerance) {
    if (points.length <= 2) return points;

    // Douglas-Peucker algorithm (simplified)
    const simplified = [points[0]];

    for (let i = 1; i < points.length - 1; i++) {
        const prev = simplified[simplified.length - 1];
        const curr = points[i];
        const next = points[i + 1];

        const distance = pointToLineDistance(curr, prev, next);

        if (distance > tolerance) {
            simplified.push(curr);
        }
    }

    simplified.push(points[points.length - 1]);
    return simplified;
}

function pointToLineDistance(point, lineStart, lineEnd) {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;

    if (lenSq === 0) return Math.sqrt(A * A + B * B);

    const param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
        xx = lineStart.x;
        yy = lineStart.y;
    } else if (param > 1) {
        xx = lineEnd.x;
        yy = lineEnd.y;
    } else {
        xx = lineStart.x + param * C;
        yy = lineStart.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;

    return Math.sqrt(dx * dx + dy * dy);
}

async function createVectorFromPaths(paths, mode, settings) {
    if (!currentSelection || paths.length === 0) return;

    // Get the original image bounds
    const bounds = currentSelection.absoluteBoundingBox;

    // Create vector node
    const vectorNode = figma.createVector();
    vectorNode.name = `Traced Vector (${mode})`;

    // Set position and size
    vectorNode.x = bounds.x + bounds.width + 20; // Place next to original
    vectorNode.y = bounds.y;
    vectorNode.resize(bounds.width, bounds.height);

    // Combine all paths into one SVG string
    const combinedPath = paths.join(' ');

    // Set the vector path
    vectorNode.vectorPaths = [{
        windingRule: 'NONZERO',
        data: combinedPath
    }];

    // Set fill and stroke based on settings
    const fills = [];
    const strokes = [];

    if (settings.fill) {
        let fillColor;

        switch (mode) {
            case 'color':
                fillColor = { r: 0, g: 0, b: 0 }; // Black for color mode
                break;
            case 'bw':
                fillColor = settings.invert ? { r: 1, g: 1, b: 1 } : { r: 0, g: 0, b: 0 };
                break;
            case 'mask':
                fillColor = { r: 0, g: 0, b: 0 };
                break;
            default:
                fillColor = { r: 0, g: 0, b: 0 };
        }

        fills.push({
            type: 'SOLID',
            color: fillColor,
            opacity: mode === 'mask' ? 0.8 : 1
        });
    }

    if (settings.stroke) {
        strokes.push({
            type: 'SOLID',
            color: { r: 0.2, g: 0.2, b: 0.2 },
            opacity: 1
        });
        vectorNode.strokeWeight = 1;
    }

    vectorNode.fills = fills;
    vectorNode.strokes = strokes;

    // Add to current page
    figma.currentPage.appendChild(vectorNode);

    // Select the new vector
    figma.currentPage.selection = [vectorNode];
    figma.viewport.scrollAndZoomIntoView([vectorNode]);
} 