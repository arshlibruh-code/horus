// Simple Perlin noise function
function noise(x, y) {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return (n - Math.floor(n));
}
// Smooth interpolation
function smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
}
// Simple Perlin noise
function perlin(x, y) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const u = smoothstep(0, 1, xf);
    const v = smoothstep(0, 1, yf);
    const n00 = noise(xi, yi);
    const n01 = noise(xi, yi + 1);
    const n10 = noise(xi + 1, yi);
    const n11 = noise(xi + 1, yi + 1);
    const x1 = n00 + u * (n10 - n00);
    const x2 = n01 + u * (n11 - n01);
    return x1 + v * (x2 - x1);
}
// Orb class
class Orb {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.time = 0;
        this.audioIntensity = 0;
        this.animationId = null;
        this.opacity = 0;
        this.targetOpacity = 1;
        this.scale = 1;
        this.targetScale = 1;
        this.init();
    }
    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'orb-canvas';
        this.canvas.width = 600;
        this.canvas.height = 800;
        // Add to body
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.animate();
    }
    setAudioIntensity(intensity) {
        this.audioIntensity = intensity;
    }
    setScale(scale) {
        this.targetScale = scale;
    }
    animate() {
        this.time += 0.01;
        // Smooth opacity fade in
        if (this.opacity < this.targetOpacity) {
            this.opacity += 0.02;
            if (this.opacity > this.targetOpacity) {
                this.opacity = this.targetOpacity;
            }
        }
        // Smooth scale animation (faster for more responsiveness)
        if (this.scale < this.targetScale) {
            this.scale += 0.15; // Faster animation
            if (this.scale > this.targetScale) {
                this.scale = this.targetScale;
            }
        } else if (this.scale > this.targetScale) {
            this.scale -= 0.15; // Faster animation
            if (this.scale < this.targetScale) {
                this.scale = this.targetScale;
            }
        }
        // Debug scale changes
        if (Math.abs(this.scale - this.targetScale) > 0.01) {
        }
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    draw() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        // Clear canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        // Apply scale transformation
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.scale(this.scale, this.scale);
        ctx.translate(-width / 2, -height / 2);
        // Create image data
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;
        // Generate noise
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const nx = x / width * 4;
                const ny = y / height * 4;
                const nt = this.time;
                // Add audio intensity
                const intensity = this.audioIntensity * 0.5;
                const n = perlin(nx, ny + nt) + (intensity * 0.5); // Audio affects noise intensity
                const value = Math.max(0, Math.min(1, n));
                const index = (y * width + x) * 4;
                const alpha = value * 255 * this.opacity * (1 + this.audioIntensity); // Audio affects brightness
                // Blue glow effect
                data[index] = 0;     // R
                data[index + 1] = 100; // G
                data[index + 2] = 255; // B
                data[index + 3] = alpha; // A
            }
        }
        ctx.putImageData(imageData, 0, 0);
        ctx.restore();
    }
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
    reset() {
        this.opacity = 0;
        this.targetOpacity = 1;
        this.scale = 1;
        this.targetScale = 1;
    }
}
// Global orb instance
let orb = null;
// Initialize orb
function initOrb() {
    if (!orb) {
        orb = new Orb();
    }
}
// Update orb with audio intensity
function updateOrbIntensity(intensity) {
    if (orb) {
        orb.setAudioIntensity(intensity);
    }
}
// Update orb scale
function updateOrbScale(scale) {
    if (orb) {
        orb.setScale(scale);
    }
}
// Destroy orb
function destroyOrb() {
    if (orb) {
        orb.destroy();
        orb = null;
    }
}
