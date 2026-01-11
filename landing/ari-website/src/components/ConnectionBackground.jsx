import React, { useRef, useEffect } from 'react';

const ConnectionBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const nodes = [];
        const nodeCount = 50;
        const connectionDistance = 150;
        const mouseDistance = 200;

        // Mouse position
        let mouse = { x: null, y: null };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Icon paths (simplified for canvas drawing)
        // We use Path2D for performance.
        const manPath = new Path2D("M0 -10 C-3 -10 -5 -8 -5 -5 C-5 -2 -3 0 0 0 C3 0 5 -2 5 -5 C5 -8 3 -10 0 -10 M-8 8 C-8 2 -5 1 0 1 C5 1 8 2 8 8 L8 10 H-8 L-8 8");
        const womanPath = new Path2D("M0 -10 C-3 -10 -5 -8 -5 -5 C-5 -2 -3 0 0 0 C3 0 5 -2 5 -5 C5 -8 3 -10 0 -10 M-7 10 L-5 2 C-5 1 0 1 5 2 L7 10 H-7");
        const childPath = new Path2D("M0 -8 C-2.5 -8 -4 -6.5 -4 -4 C-4 -1.5 -2.5 0 0 0 C2.5 0 4 -1.5 4 -4 C4 -6.5 2.5 -8 0 -8 M-5 6 C-5 2 -3 1 0 1 C3 1 5 2 5 6 L5 7 H-5 L-5 6");

        const shapes = [manPath, womanPath, childPath];

        class Node {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                // Slightly slower movement for better visibility of shapes
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;

                // Scale factor for the path 
                this.size = Math.random() * 0.5 + 0.8;

                // Randomly assign a "type"
                this.shape = shapes[Math.floor(Math.random() * shapes.length)];

                // Colors using the requested palette but very transparent/faded
                const colors = [
                    'rgba(14, 165, 233, 0.15)', // Sky
                    'rgba(139, 92, 246, 0.15)', // Violet
                    'rgba(236, 72, 153, 0.15)', // Pink
                    'rgba(99, 102, 241, 0.15)'  // Indigo
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // Mouse interaction
                if (mouse.x != null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouseDistance) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouseDistance - distance) / mouseDistance;

                        // Gentle attraction/repulsion
                        const directionX = forceDirectionX * force * 0.5;
                        const directionY = forceDirectionY * force * 0.5;

                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.scale(this.size, this.size);

                ctx.fillStyle = this.color;
                ctx.fill(this.shape);

                ctx.restore();
            }
        }

        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new Node());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connections first (behind nodes)
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(200, 200, 200, ${1 - distance / connectionDistance})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }

                // Connect to mouse
                if (mouse.x != null) {
                    const dx = nodes[i].x - mouse.x;
                    const dy = nodes[i].y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(100, 100, 255, ${1 - distance / connectionDistance})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }

            // Draw nodes on top
            for (let i = 0; i < nodes.length; i++) {
                nodes[i].update();
                nodes[i].draw();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 bg-slate-50 opacity-60" />;
};

export default ConnectionBackground;
