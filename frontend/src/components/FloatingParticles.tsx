"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    baseSize: number;
    pulse: number;
    pulseSpeed: number;
}

interface FloatingParticlesProps {
    isActive?: boolean;
    particleCount?: number;
    keystrokeCount?: number;
}

export default function FloatingParticles({
    isActive = false,
    particleCount = 60,
    keystrokeCount = 0
}: FloatingParticlesProps) {
    const { resolvedTheme } = useTheme();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number | undefined>(undefined);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const isActiveRef = useRef(isActive);
    const prevKeystrokeCountRef = useRef(keystrokeCount);
    const themeRef = useRef(resolvedTheme);

    // Update isActive ref
    useEffect(() => {
        isActiveRef.current = isActive;
    }, [isActive]);

    // Trigger particle movement on each keystroke
    useEffect(() => {
        if (keystrokeCount > prevKeystrokeCountRef.current) {
            // Push particles in random directions on each keystroke
            particlesRef.current.forEach(particle => {
                particle.vx += (Math.random() - 0.5) * 3;
                particle.vy += (Math.random() - 0.5) * 3;
            });
        }
        prevKeystrokeCountRef.current = keystrokeCount;
    }, [keystrokeCount]);

    // Update theme ref
    useEffect(() => {
        themeRef.current = resolvedTheme;
    }, [resolvedTheme]);

    // Initialize particles
    useEffect(() => {
        const particles: Particle[] = [];
        for (let i = 0; i < particleCount; i++) {
            const baseSize = Math.random() * 1.5 + 1.5; // Smaller: 1.5-3px
            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: baseSize,
                baseSize,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.02,
            });
        }
        particlesRef.current = particles;
    }, [particleCount]);

    // Animation loop
    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const particles = particlesRef.current;
        const mouse = mouseRef.current;
        const isTyping = isActiveRef.current;
        const isDark = themeRef.current === 'dark';

        // Update and draw particles
        particles.forEach((particle, i) => {
            // Mouse repulsion
            const dx = particle.x - mouse.x;
            const dy = particle.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                const force = (120 - distance) / 120;
                particle.vx += (dx / distance) * force * 0.5;
                particle.vy += (dy / distance) * force * 0.5;
            }

            // Apply friction
            particle.vx *= 0.99;
            particle.vy *= 0.99;

            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges with padding
            if (particle.x < 20) {
                particle.vx = Math.abs(particle.vx) * 0.8;
                particle.x = 20;
            }
            if (particle.x > canvas.width - 20) {
                particle.vx = -Math.abs(particle.vx) * 0.8;
                particle.x = canvas.width - 20;
            }
            if (particle.y < 20) {
                particle.vy = Math.abs(particle.vy) * 0.8;
                particle.y = 20;
            }
            if (particle.y > canvas.height - 20) {
                particle.vy = -Math.abs(particle.vy) * 0.8;
                particle.y = canvas.height - 20;
            }

            // Pulsing size
            particle.pulse += particle.pulseSpeed;
            particle.size = particle.baseSize + Math.sin(particle.pulse) * 0.3;

            // Draw particle with subtle glow
            const glowSize = isTyping ? 8 : 5;
            const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size + glowSize
            );

            if (isDark) {
                // Dark mode: Subtle white/gray glow
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
                gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            } else {
                // Light mode: Subtle black/gray glow
                gradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
                gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.05)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            }

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size + glowSize, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Draw solid center
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = isDark ? 'rgba(180, 180, 180, 0.5)' : 'rgba(100, 100, 100, 0.5)';
            ctx.fill();

            // Draw connections to nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const other = particles[j];
                const connDx = particle.x - other.x;
                const connDy = particle.y - other.y;
                const connDist = Math.sqrt(connDx * connDx + connDy * connDy);
                const maxDist = isTyping ? 180 : 140;

                if (connDist < maxDist) {
                    const baseOpacity = isDark ? 0.4 : 0.35;
                    const opacity = (1 - connDist / maxDist) * baseOpacity;

                    // Create simple line with theme-aware color
                    ctx.strokeStyle = isDark
                        ? `rgba(255, 255, 255, ${opacity * 0.8})`
                        : `rgba(0, 0, 0, ${opacity * 0.6})`;

                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.lineWidth = isDark ? 0.6 : 0.5;
                    ctx.stroke();
                }
            }
        });

        // Draw mouse glow effect
        if (mouse.x > 0 && mouse.y > 0) {
            const mouseGradient = ctx.createRadialGradient(
                mouse.x, mouse.y, 0,
                mouse.x, mouse.y, 100
            );
            mouseGradient.addColorStop(0, 'rgba(100, 100, 100, 0.05)');
            mouseGradient.addColorStop(1, 'rgba(100, 100, 100, 0)');

            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2);
            ctx.fillStyle = mouseGradient;
            ctx.fill();
        }

        animationRef.current = requestAnimationFrame(animate);
    }, []);

    // Handle resize
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [animate]);

    // Track mouse
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            aria-hidden="true"
        />
    );
}
