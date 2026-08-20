import { useRef, useEffect } from 'react';

interface ParticleFieldProps {
  density?: number;
  opacity?: number;
}

export default function ParticleField({ density = 40, opacity = 0.15 }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      resize();
      particles.length = 0;
      for (let i = 0; i < density; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update positions
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }

      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha * opacity})`;
        ctx.fill();
      }

      // Connection lines — only check nearby pairs using grid
      const cellSize = 130;
      const cols = Math.ceil(canvas.width / cellSize);
      const grid: number[][] = Array.from({ length: cols * Math.ceil(canvas.height / cellSize) }, () => []);

      for (let i = 0; i < particles.length; i++) {
        const cell = Math.floor(particles[i].x / cellSize) + Math.floor(particles[i].y / cellSize) * cols;
        if (grid[cell]) grid[cell].push(i);
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const cx = Math.floor(p.x / cellSize);
        const cy = Math.floor(p.y / cellSize);

        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const ncx = cx + dx;
            const ncy = cy + dy;
            if (ncx < 0 || ncy < 0) continue;
            const nc = ncx + ncy * cols;
            if (nc < 0 || nc >= grid.length || !grid[nc]) continue;
            for (const j of grid[nc]) {
              if (j <= i) continue;
              const q = particles[j];
              const ddx = p.x - q.x;
              const ddy = p.y - q.y;
              const dist = ddx * ddx + ddy * ddy;
              if (dist < 14400) { // 120²
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(q.x, q.y);
                ctx.strokeStyle = `rgba(255,255,255,${(1 - Math.sqrt(dist) / 120) * 0.04 * opacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            }
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [density, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ opacity }}
    />
  );
}
