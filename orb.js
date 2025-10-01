// Simple Perlin noise function
// Higher values = more random, lower values = smoother
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
        // Spring physics
        this.opacityVelocity = 0;
        this.scaleVelocity = 0;
        this.springTension = 0.4;
        this.springDamping = 0.4;
        this.init();
    }
    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'orb-canvas';
        this.canvas.width = 500;
        this.canvas.height = 700;
        // Add to body
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.animate();
        
        // Add visible class after a small delay to allow transition
        setTimeout(() => {
            this.canvas.classList.add('visible');
        }, 10);
    }
    setAudioIntensity(intensity) {
        this.audioIntensity = intensity;
    }
    setScale(scale) {
        if (scale > 1.3) {
            this.canvas.classList.add('audio-reactive');
        } else {
            this.canvas.classList.remove('audio-reactive');
        }
    }
    animate() {
        this.time += 0.005; // Slowed down 2x
        
        // Spring physics for opacity
        const opacityForce = (this.targetOpacity - this.opacity) * this.springTension;
        this.opacityVelocity += opacityForce;
        this.opacityVelocity *= this.springDamping;
        this.opacity += this.opacityVelocity;
        
        // Spring physics for scale
        const scaleForce = (this.targetScale - this.scale) * this.springTension;
        this.scaleVelocity += scaleForce;
        this.scaleVelocity *= this.springDamping;
        this.scale += this.scaleVelocity;
        
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
        // Perlin noise parameters - tweak these to see effects
        const spatialScale = 4;          // Higher = more detail, Lower = smoother
        const timeScale = 1;             // Animation speed multiplier
        const noiseAmplitude = 0.7 + (this.audioIntensity * 2);       // 0.6 to 1.6 based on audio
        const noiseOffset = 0;           // Noise base offset
        const gridDensity = 1;           // Pixel skip (1 = every pixel, 2 = every other pixel)
        const octaves = 1;              // Number of noise layers
        const lacunarity = 1.5 + (this.audioIntensity * 10);         // 1.5 to 2.5 based on audio
        const persistence = 0.5 + (this.audioIntensity * 5);         // Amplitude multiplier between octaves
        
        // Generate noise
        for (let x = 0; x < width; x += gridDensity) {
            for (let y = 0; y < height; y += gridDensity) {
                const nx = x / width * spatialScale;        // Spatial frequency
                const ny = y / height * spatialScale;      // Spatial frequency
                const nt = this.time * timeScale;          // Time frequency
                
                // Single octave noise
                let n = perlin(nx, ny + nt) * noiseAmplitude + noiseOffset;
                
                // Multi-octave fractal noise (if octaves > 1)
                if (octaves > 1) {
                    let total = 0;
                    let frequency = 1;
                    let amplitude = 1;
                    let maxValue = 0;
                    
                    for (let i = 0; i < octaves; i++) {
                        let noiseValue = perlin(nx * frequency, (ny + nt) * frequency);
                        total += noiseValue * amplitude;
                        maxValue += amplitude;
                        amplitude *= persistence;
                        frequency *= lacunarity;
                    }
                    n = (total / maxValue) * noiseAmplitude + noiseOffset;
                }
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
            this.canvas.classList.remove('visible');
            setTimeout(() => {
                if (this.canvas && this.canvas.parentNode) {
                    this.canvas.parentNode.removeChild(this.canvas);
                }
            }, 600); // Wait for CSS transition
        }
    }
    reset() {
        this.opacity = 0;
        this.targetOpacity = 1;
        this.scale = 1;
        this.targetScale = 1;
        this.opacityVelocity = 0;
        this.scaleVelocity = 0;
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

// Perlin loading animation
function startPerlinLoading(container) {
  const canvas = document.createElement('canvas');
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.filter = 'blur(32px)';
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  let time = 0;
  let animationId;
  
  function animate() {
    time += 0.01; // 2x speed up for loading indicator
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Generate Perlin wave
    for (let x = 0; x < canvas.width; x++) {
      const nx = x / canvas.width * 6;  // Higher = more waves, Lower = smoother
      const ny = time;                   // Animation speed
      const n = perlin(nx, ny);
      const y = (n * 0.5 + 0.5) * canvas.height;  // Higher multiplier = bigger waves
      
      ctx.fillStyle = `rgba(0, 123, 255, ${0.3 + n * 0.4})`;  // Base opacity + wave intensity
      ctx.fillRect(x, y, 1, canvas.height - y);
    }
    
    animationId = requestAnimationFrame(animate);
  }
  
  animate();
  
  // Store animation ID for cleanup
  container._perlinAnimation = animationId;
}
