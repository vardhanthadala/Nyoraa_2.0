"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const CountUp = ({ end, duration = 1.2 }: { end: number, duration?: number }) => {
  const start = Math.floor(end / 2);
  const [count, setCount] = useState(start);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver;
    if (ref.current) {
      // Trigger when the element crosses slightly into the viewport
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          let startTimestamp: number | null = null;
          const durationMs = duration * 1000;

          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);

            // Smoother easeOut (equivalent to power2.out)
            const easeOut = 1 - Math.pow(1 - progress, 2);
            setCount(Math.floor(easeOut * (end - start) + start));

            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };
          window.requestAnimationFrame(step);
          observer.disconnect();
        }
      }, { threshold: 0.5 }); // Ensures it is highly visible before starting

      observer.observe(ref.current);
    }
    return () => observer?.disconnect();
  }, [end, duration, start]);

  return <span ref={ref} className="font-normal">{count}</span>;
};

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progFillRef = useRef<HTMLDivElement>(null);
  const hudPctRef = useRef<HTMLDivElement>(null);
  const sceneNameRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const prodRailRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRRef = useRef<HTMLDivElement>(null);
  const logoBandRef = useRef<HTMLDivElement>(null);
  const logoPathsRef = useRef<SVGGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeBrand, setActiveBrand] = useState(0);

  const brands = useMemo(() => [
    { name: "Gentle Cleanser", sub: "Hueglam Essentials", icon: "fas fa-water", bg: "/products/Faceswash.webp" },
    { name: "Hydrating Moisturizer", sub: "Hueglam Essentials", icon: "fas fa-leaf", bg: "/products/Mositruizer.webp" },
    { name: "Essential Combo", sub: "Hueglam Essentials", icon: "fas fa-box-open", bg: "/products/combo.webp" },
    { name: "Radiance Serum", sub: "Hueglam Essentials", icon: "fas fa-sparkles", bg: "/products/face_serum_bottle.webp" },
    { name: "Sun Shield", sub: "Hueglam Essentials", icon: "fas fa-sun", bg: "/products/sunscreen.webp" }
  ], []);

  const brandDescriptions = useMemo(() => [
    "Our Gentle Cleanser effectively removes impurities while maintaining the skin's natural moisture balance for a fresh, clean canvas.",
    "The Hydrating Moisturizer provides deep, long-lasting hydration with a lightweight texture that leaves skin feeling soft and resilient.",
    "The Essential Combo brings together our core skincare heroes for a complete ritual that simplifies your path to glowing skin.",
    "Our Radiance Serum is a potent blend of actives designed to brighten your complexion and even out skin tone for a luminous finish.",
    "The Sun Shield offers broad-spectrum protection against UV rays and environmental stressors with a breathable, non-greasy formula."
  ], []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // CURSOR LOGIC optimized with GSAP ticker
      const c = cursorRef.current;
      const cr = cursorRRef.current;
      if (!c || !cr) return;

      const xSet = gsap.quickSetter(c, "x", "px");
      const ySet = gsap.quickSetter(c, "y", "px");
      const xrSet = gsap.quickSetter(cr, "x", "px");
      const yrSet = gsap.quickSetter(cr, "y", "px");

      let mx = 0, my = 0, rx = 0, ry = 0;

      const handleMouseMove = (e: MouseEvent) => {
        mx = e.clientX; my = e.clientY;
        xSet(mx); ySet(my);
      };
      document.addEventListener('mousemove', handleMouseMove, { passive: true });

      const animateCursor = () => {
        rx += (mx - rx) * 0.15;
        ry += (my - ry) * 0.15;
        xrSet(rx); yrSet(ry);
      };
      gsap.ticker.add(animateCursor);

      // WEBGL LOGIC
      const canvas = canvasRef.current;
      if (!canvas) return;
      const gl = canvas.getContext("webgl", {
        alpha: false, antialias: false, depth: false, stencil: false,
        preserveDrawingBuffer: false, powerPreference: "high-performance"
      });
      if (!gl) return;

      const vs = `attribute vec2 a; void main() { gl_Position = vec4(a, 0.0, 1.0); }`;
      const fs = `
        precision mediump float;
        uniform vec2  uR;
        uniform float uT, uS, uSc, uBl;
        #define PI 3.14159265359
        float sat(float x) { return clamp(x, 0.0, 1.0); }
        float smoother(float x) { x = sat(x); return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }
        vec3 sCol(vec3 c0, vec3 c1, vec3 c2, vec3 c3, vec3 c4) {
          int si = int(uSc); vec3 a = c0; vec3 b = c1;
          if (si == 1) { a = c1; b = c2; } else if (si == 2) { a = c2; b = c3; } else if (si == 3) { a = c3; b = c4; }
          return mix(a, b, uBl);
        }
        float sF(float c0, float c1, float c2, float c3, float c4) {
          int si = int(uSc); float a = c0; float b = c1;
          if (si == 1) { a = c1; b = c2; } else if (si == 2) { a = c2; b = c3; } else if (si == 3) { a = c3; b = c4; }
          return mix(a, b, uBl);
        }
        mat2 rot(float a) { float c = cos(a); float s = sin(a); return mat2(c, -s, s, c); }
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
        float noise(vec2 p) {
          vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
          float a = hash(i); float b = hash(i + vec2(1.0, 0.0)); float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }
        float waveH(vec2 p, float t, float amp, float storm) {
          float h = 0.0; vec2 s1 = normalize(vec2(1.0, 0.28)); vec2 s2 = normalize(vec2(-0.48, 0.88)); vec2 s3 = normalize(vec2(0.82, -0.16));
          s2 = rot(storm * 0.18) * s2; s3 = rot(-storm * 0.14) * s3;
          float d1 = dot(p, s1); float d2 = dot(p, s2); float d3 = dot(p, s3);
          h += amp * 0.66 * sin(d1 * 0.42 + t * 0.38); h += amp * 0.22 * sin(d1 * 0.94 - t * 0.62); h += amp * 0.14 * sin(d2 * 1.18 - t * 0.82); h += amp * 0.09 * sin(d3 * 1.82 + t * 1.04);
          h += amp * (0.11 + storm * 0.07) * sin(p.x * 1.45 - t * 0.76 + p.y * 0.66); h += amp * (0.07 + storm * 0.05) * sin(p.x * 2.85 + t * 1.06 - p.y * 0.52); h += amp * (0.04 + storm * 0.03) * sin(p.x * 4.60 - t * 1.50 + p.y * 1.02);
          float m = noise(p * 14.0 + vec2(t * 0.18, t * 0.06)) - 0.5; h += m * amp * (0.010 + storm * 0.008); return h;
        }
        vec3 waveNorm(vec2 p, float t, float amp, float storm) {
          float e = 0.018; float hL = waveH(p - vec2(e, 0.0), t, amp, storm); float hR = waveH(p + vec2(e, 0.0), t, amp, storm); float hD = waveH(p - vec2(0.0, e), t, amp, storm); float hU = waveH(p + vec2(0.0, e), t, amp, storm);
          return normalize(vec3(-(hR - hL) / (2.0 * e), 1.0, -(hU - hD) / (2.0 * e)));
        }
        float starField(vec2 uv) { vec2 gv = floor(uv); vec2 lv = fract(uv) - 0.5; float h = hash(gv); float size = mix(0.012, 0.0025, h); float d = length(lv + vec2(hash(gv + 3.1) - 0.5, hash(gv + 7.3) - 0.5) * 0.25); float star = smoothstep(size, 0.0, d); star *= smoothstep(0.82, 1.0, h); return star; }
        void main() {
          vec2 uv = (gl_FragCoord.xy - uR * 0.5) / uR.y; float s = smoother(uS);
          float camY = mix(1.14, 1.03, s) + sin(s * PI * 1.4) * 0.028; float camZ = mix(0.08, -0.18, s); float pitch = mix(0.115, 0.088, s);
          vec3 ro = vec3(0.0, camY, camZ); vec3 rd = normalize(vec3(uv.x, uv.y - pitch, -1.4));
          float storm = smoothstep(0.80, 1.0, s); float night = smoothstep(0.56, 0.84, s);
          vec3 skyTop = sCol(vec3(0.18, 0.06, 0.24), vec3(0.05, 0.24, 0.68), vec3(0.26, 0.06, 0.04), vec3(0.01, 0.01, 0.05), vec3(0.04, 0.05, 0.09));
          vec3 skyHori = sCol(vec3(0.92, 0.48, 0.18), vec3(0.42, 0.62, 0.90), vec3(0.88, 0.32, 0.04), vec3(0.03, 0.05, 0.14), vec3(0.15, 0.17, 0.23));
          vec3 sunCol = sCol(vec3(1.0, 0.62, 0.22), vec3(1.0, 0.96, 0.80), vec3(1.0, 0.38, 0.05), vec3(0.70, 0.75, 0.94), vec3(0.26, 0.28, 0.34));
          vec3 seaDeep = sCol(vec3(0.08, 0.05, 0.12), vec3(0.03, 0.14, 0.34), vec3(0.10, 0.06, 0.04), vec3(0.00, 0.01, 0.03), vec3(0.03, 0.04, 0.07));
          vec3 seaShlo = sCol(vec3(0.28, 0.17, 0.24), vec3(0.09, 0.38, 0.60), vec3(0.24, 0.13, 0.06), vec3(0.04, 0.06, 0.16), vec3(0.07, 0.10, 0.14));
          vec3 fogCol = sCol(vec3(0.80, 0.50, 0.30), vec3(0.58, 0.72, 0.90), vec3(0.70, 0.28, 0.05), vec3(0.02, 0.03, 0.08), vec3(0.12, 0.14, 0.18));
          float sunAngle = clamp(s / 0.58, 0.0, 1.0) * PI; vec3 sunDir = normalize(vec3(cos(sunAngle) * -0.75, sin(sunAngle) * 0.38 - 0.08, -1.0)); vec3 moonDir = normalize(vec3(-0.14, 0.42, -1.0));
          float waveAmp = sF(0.082, 0.070, 0.100, 0.054, 0.30) + storm * 0.020; float fogDen = sF(0.020, 0.010, 0.022, 0.034, 0.046); float moonAmt = sF(0.0, 0.0, 0.05, 0.92, 0.06);
          float sunGlow = smoothstep(-0.10, 0.06, sunDir.y); vec3 col;
          if (rd.y < 0.0) {
            float tFlat = ro.y / (-rd.y); float ss = tFlat / 22.0; float t = ss;
            for (int i = 0; i < 22; i++) { if (ro.y + rd.y * t < waveH(ro.xz + rd.xz * t, uT, waveAmp, storm)) break; t += ss; }
            float ta = t - ss; float tb = t; for (int i = 0; i < 5; i++) { float tm = (ta + tb) * 0.5; if (ro.y + rd.y * tm < waveH(ro.xz + rd.xz * tm, uT, waveAmp, storm)) tb = tm; else ta = tm; }
            t = (ta + tb) * 0.5; vec2 wp = ro.xz + rd.xz * t; vec3 n = waveNorm(wp, uT, waveAmp, storm); vec3 v = -rd;
            float fres = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 4.0); vec3 r = reflect(rd, n);
            vec3 rSky = mix(skyHori, skyTop, pow(clamp(r.y, 0.0, 1.0), 0.42)); rSky = mix(rSky, skyHori, 0.12);
            float rs = max(dot(r, sunDir), 0.0); rSky += sunCol * (pow(rs, 120.0) * 2.0 + pow(rs, 18.0) * 0.07) * sunGlow;
            if (moonAmt > 0.04) rSky += vec3(0.72, 0.80, 0.95) * pow(max(dot(r, moonDir), 0.0), 120.0) * 0.78 * moonAmt;
            vec3 wC = mix(seaDeep, seaShlo, exp(-t * 0.40) * 0.5) * mix(vec3(1.0), vec3(0.85, 0.92, 1.0), clamp(t * 0.25, 0.0, 1.0));
            col = mix(wC, rSky, 0.15 + fres * 0.34);
            col += sunCol * (pow(max(dot(reflect(-sunDir, n), v), 0.0), 200.0) * step(0.0, sunDir.y) * 0.3 + pow(max(dot(reflect(-sunDir, n), v), 0.0), 32.0) * 0.04 * sunGlow);
            col += sunCol * pow(max(dot(reflect(rd, n), sunDir), 0.0), 8.0) * 0.15 * smoothstep(0.0, 0.35, -rd.y) * sunGlow;
            col += sunCol * smoothstep(0.94, 1.0, noise(wp * 18.0 + vec2(uT * 0.55, uT * 0.22))) * 0.02 * sunGlow * step(0.0, sunDir.y);
            if (moonAmt > 0.04) col += vec3(0.72, 0.80, 0.95) * pow(max(dot(reflect(-moonDir, n), v), 0.0), 520.0) * 0.09 * moonAmt;
            float hC = waveH(wp, uT, waveAmp, storm); float foam = clamp((waveH(wp-vec2(0.025,0),uT,waveAmp,storm)+waveH(wp+vec2(0.025,0),uT,waveAmp,storm)+waveH(wp-vec2(0,0.025),uT,waveAmp,storm)+waveH(wp+vec2(0,0.025),uT,waveAmp,storm)-4.0*hC)*(24.0+storm*10.0),0.0,1.0);
            col += foam * vec3(1.0) * (0.03 + storm * 0.10); col = mix(col, fogCol, 1.0 - exp(-t * fogDen * 1.65));
          } else {
            float h = clamp(rd.y, 0.0, 1.0); vec3 sCol = mix(skyHori, skyTop, pow(h, 0.38));
            float cl = smoothstep(0.62, 0.86, noise(rd.x*5.5+vec2(rd.y*3.0,uT*0.015))*0.65+noise(rd.x*8.0-vec2(rd.y*4.0,uT*0.010))*0.35)*smoothstep(-0.02,0.24,rd.y)*(0.08+storm*0.18);
            sCol = mix(sCol, mix(sCol*0.97, mix(vec3(1.0,0.82,0.65), vec3(0.42,0.48,0.56), storm), 0.35), cl);
            float sd = max(dot(rd, sunDir), 0.0); sCol += sunCol * (pow(sd,380.0)*1.5+pow(sd,22.0)*0.04+pow(sd,5.0)*0.02+smoothstep(0.99925,0.99995,sd)*0.8)*sunGlow;
            sCol += sunCol * (exp(-abs(rd.y)*24.0)*0.03 + pow(sd,3.0)*0.01) * sunGlow;
            if (moonAmt > 0.04) { float md = max(dot(rd, moonDir), 0.0); sCol += vec3(0.88, 0.92, 1.0) * (pow(md,820.0)*7.4 + pow(md,6.0)*0.045) * moonAmt; }
            if (night > 0.02) sCol += vec3(0.80, 0.88, 1.0) * (starField(rd.xy/max(0.12,rd.z+1.6)*140.0)+starField(rd.xy/max(0.12,rd.z+1.6)*140.0*0.55+11.7)*0.65)*smoothstep(0.02,0.26,rd.y)*(1.0-storm*0.85)*night*0.82;
            sCol += fogCol * exp(-abs(rd.y)*mix(38.0,22.0,storm)) * (0.09 + storm * 0.10); col = mix(sCol, sCol * vec3(0.91, 0.94, 0.98), storm * 0.22);
          }
          col = mix(col, col, smoothstep(-0.008, 0.008, rd.y)); col = mix(fogCol, col, smoothstep(-0.008, 0.018, rd.y)*0.25+0.75);
          gl_FragColor = vec4(clamp(col + (hash(gl_FragCoord.xy*0.5+floor(uT*12.0))-0.5)*0.006, 0.0, 1.0), 1.0);
        }
      `;

      const mkS = (t: number, s: string) => { const sh = gl.createShader(t)!; gl.shaderSource(sh, s); gl.compileShader(sh); return sh; };
      const p = gl.createProgram()!; gl.attachShader(p, mkS(gl.VERTEX_SHADER, vs)); gl.attachShader(p, mkS(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p); gl.useProgram(p);
      const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const a = gl.getAttribLocation(p, "a"); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
      const uR = gl.getUniformLocation(p, "uR"), uT = gl.getUniformLocation(p, "uT"), uS = gl.getUniformLocation(p, "uS"), uSc = gl.getUniformLocation(p, "uSc"), uBl = gl.getUniformLocation(p, "uBl");

      let tgt = 0, smooth = 0;
      let isVisible = true;

      // OPTIMIZATION: Pause WebGL rendering when canvas is not visible
      const canvasObserver = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
      }, { threshold: 0.01 });
      canvasObserver.observe(canvas);

      const update = () => {
        const cinematicRange = 4000;
        tgt = Math.min(1, window.scrollY / cinematicRange);
      };
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio, 1.5); // Performance cap
        const w = window.innerWidth * dpr, h = window.innerHeight * dpr;
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uR, w, h);
        update();
      };
      window.addEventListener("resize", resize, { passive: true });
      window.addEventListener("scroll", update, { passive: true });
      resize();

      const frame = (now: number) => {
        if (!isVisible) return;

        smooth += (tgt - smooth) * 0.1;
        const N = 4;
        const raw = smooth * (N - 1);
        const si = Math.min(Math.floor(raw), N - 2);
        const bl = raw - si;

        if (hudPctRef.current) hudPctRef.current.textContent = Math.round(smooth * 100).toString().padStart(3, '0') + '%';
        if (progFillRef.current) progFillRef.current.style.width = (smooth * 100) + '%';

        const NAMES = ["HUEGLAM", "WELLNESS", "HOME", "PARTNERS"];
        if (sceneNameRef.current) sceneNameRef.current.textContent = NAMES[si];
        if (dotsRef.current) Array.from(dotsRef.current.children).forEach((d, i) => (d as HTMLElement).classList.toggle("active", i === si));

        gl.uniform1f(uT, now / 1000); gl.uniform1f(uS, smooth); gl.uniform1f(uSc, si); gl.uniform1f(uBl, bl);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      };
      gsap.ticker.add(frame);

      // REVEAL & SCRAMBLE
      const scramble = (el: HTMLElement, duration: number = 800) => {
        const final = el.getAttribute('data-scramble') || el.innerText;
        const chars = final.replace(/\s/g, '');
        const original = el.innerHTML;
        let its = 0;

        const step = () => {
          if (!containerRef.current) return; // Stop if component unmounted

          el.innerText = final.split("").map((c, i) => {
            if (i < its) return final[i];
            if (c === ' ' || c === '\n') return c;
            return chars[Math.floor(Math.random() * chars.length)];
          }).join("");

          if (its >= final.length) {
            el.innerHTML = original;
            return;
          }

          its += final.length / (duration / 30);
          setTimeout(step, 30);
        };
        step();
      };

      const revealObserver = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in', 'visible');
          if (e.target.hasAttribute('data-scramble')) {
            scramble(e.target as HTMLElement);
          }
        }
      }), { threshold: 0.1 });
      document.querySelectorAll('.reveal, .tag, h1, h2, .body-text, .stat-row, .cta, .h-line').forEach(e => revealObserver.observe(e));

      // DRAG SCROLL
      const rail = prodRailRef.current;
      if (rail) {
        let isDown = false, sx = 0, sl = 0;
        const onDown = (e: MouseEvent) => { isDown = true; sx = e.pageX - rail.offsetLeft; sl = rail.scrollLeft; };
        const onLeave = () => isDown = false;
        const onUp = () => isDown = false;
        const onMove = (e: MouseEvent) => { if (!isDown) return; e.preventDefault(); rail.scrollLeft = sl - (e.pageX - rail.offsetLeft - sx) * 1.4; };
        rail.addEventListener('mousedown', onDown);
        rail.addEventListener('mouseleave', onLeave);
        rail.addEventListener('mouseup', onUp);
        rail.addEventListener('mousemove', onMove);
      }

      // STATS COUNT-UP
      gsap.utils.toArray<HTMLElement>('.stat-num').forEach(num => {
        const text = num.innerText;
        const target = parseInt(text.replace(/[^0-9]/g, ''));
        const suffix = text.replace(/[0-9]/g, '');
        const startVal = Math.floor(target * 0.5);

        gsap.fromTo(num,
          { innerHTML: startVal },
          {
            innerHTML: target,
            duration: 2,
            ease: "power2.out",
            snap: { innerHTML: 1 },
            scrollTrigger: {
              trigger: ".stats-strip",
              start: "top 90%",
            },
            onUpdate: function () {
              num.innerHTML = Math.floor(parseFloat(num.innerHTML)) + suffix;
            }
          }
        );
      });

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", update);
        gsap.ticker.remove(animateCursor);
        gsap.ticker.remove(frame);
      };
    }, containerRef);

    return () => ctx.revert();
  }, [brands, brandDescriptions]);

  return (
    <main ref={containerRef}>
      <div className="cur" ref={cursorRef}></div>
      <div className="cur-r" ref={cursorRRef}></div>
      <canvas id="webgl_canvas" ref={canvasRef}></canvas>

      <Navbar />

      <button id="theme_toggle" onClick={() => {
        const nt = theme === 'dark' ? 'light' : 'dark';
        setTheme(nt);
        document.documentElement.setAttribute('data-theme', nt);
      }}>
        <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      </button>

      <div id="scroll_container">
        <section id="s0" className="side-layout">
          <div className="text-card">
            <div className="tag">Brand Spotlight — HUEGLAM</div>
            <h2>EMPOWERING<br />UNIQUE<br />BEAUTY</h2>
            <p className="body-text">
              At HUEGLAM, our mission is to empower individuals to embrace their unique beauty through innovative, high-quality skincare and cosmetics. We strive to make self-expression effortless and accessible, blending cutting-edge formulations with vibrant aesthetics for every shade, style, and story.
            </p>
            <a className="cta" href="https://hueglam.com/" target="_blank" rel="noopener noreferrer">
              Explore HUEGLAM
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 6h10M6 1l5 5-5 5" />
              </svg>
            </a>
          </div>
          {/* <div className="side-text reveal">
            <div className="tag" data-scramble="House of Beauty">House of Beauty</div>
            <h2 className="sh-h" data-scramble="Four Brands, One Vision">Four Brands, <br />One Vision</h2>
          </div> */}
        </section>

        <section id="s1">
          <div className="text-card right">
            <div className="h-line"></div>
            <div className="tag">Brand Spotlight — Wellness (Soon)</div>
            <h2>HOLISTIC<br />WELLNESS</h2>
            <p className="body-text">
              Our upcoming Wellness collection focuses on the intersection of inner
              balance and outer radiance. Crafted with adaptogens and restorative
              botanicals for a total mind-body rejuvenation.
            </p>
            <div className="stat-row" style={{ justifyContent: "flex-end" }}>
              <div className="stat">
                <span className="stat-num">100%</span>
                <span className="stat-label">Organic</span>
              </div>
              <div className="stat">
                <span className="stat-num">Coming</span>
                <span className="stat-label">Soon</span>
              </div>
            </div>
          </div>
        </section>

        <section id="s2">
          <div className="text-card">
            <div className="h-line"></div>
            <div className="tag">Brand Spotlight — Home (Soon)</div>
            <h2>CURATED<br />HOME</h2>
            <p className="body-text">
              Transforming your living space into a sanctuary. Our Home line will
              feature olfactory narratives and aesthetic essentials designed to
              elevate your daily environment.
            </p>
            <a className="cta" href="#s3">
              Notify Me
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 6h10M6 1l5 5-5 5" />
              </svg>
            </a>
          </div>
        </section>

        <section id="s3">
          <div className="text-card center">
            <div className="h-line"></div>
            <div className="tag">Brand Spotlight — Partner Brands</div>
            <h2>PARTNER<br />BRANDS</h2>
            <p className="body-text">
              Collaborating with global innovators who share our commitment to
              purity and purpose. Discover a curated selection of brands that
              resonate with the Nyoraa philosophy.
            </p>
          </div>
        </section>
      </div>

      <div className="stripe">
        <div className="stripe-t">
          <span>heritage&future</span><span className="dot">✦</span>
          <span>authentic stories</span><span className="dot">✦</span>
          <span>purpose-led design</span><span className="dot">✦</span>
          <span>brand creation</span><span className="dot">✦</span>
          <span>hueglam</span><span className="dot">✦</span>
          <span>innovation</span><span className="dot">✦</span>
          <span>consumer first</span><span className="dot">✦</span>
          <span>heritage&future</span><span className="dot">✦</span>
          <span>authentic stories</span><span className="dot">✦</span>
          <span>purpose-led design</span><span className="dot">✦</span>
          <span>brand creation</span><span className="dot">✦</span>
          <span>hueglam</span><span className="dot">✦</span>
          <span>innovation</span><span className="dot">✦</span>
          <span>consumer first</span><span className="dot">✦</span>
        </div>
      </div>

      <section id="brands" className="sec">
        <div className="brands-intro reveal">
          <div>
            <div className="sh-eye">Market Spotlight</div>
            <h2 className="sh-h">Trending<br /><em>Products</em></h2>
          </div>
          <p className="brands-intro-r sh-p">
            {brandDescriptions[activeBrand]}
          </p>
        </div>

        <div className="options">
          {brands.map((brand, i) => (
            <div
              key={i}
              className={`option ${activeBrand === i ? 'active' : ''}`}
              style={{ "--optionBackground": `url(${brand.bg})` } as React.CSSProperties}
              onClick={() => setActiveBrand(i)}
              aria-label={`View details for ${brand.name}`}
            >
              <div className="shadow"></div>
              <div className="label">
                <div className="icon">
                  <i className={brand.icon}></i>
                </div>
                <div className="info">
                  <div className="main">{brand.name}</div>
                  <div className="sub">{brand.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ background: '#ffffff' }}>
        <hr className="div" />
      </div>

      <section className="
        w-full font-raleway bg-white
        px-5   py-14
        xs:px-7  xs:py-16
        sm:px-10 sm:py-20
        md:px-16 md:py-24
        lg:px-24 lg:py-28
        xl:px-32 xl:py-32
        2xl:px-44 2xl:py-40
        3xl:px-64 3xl:py-52
        4xl:px-96 4xl:py-64
      ">

        {/* ── HEADER ─────────────────────────────── */}
        <div className="
          flex flex-col gap-5
          sm:flex-row sm:items-end sm:justify-between
          mb-7 sm:mb-9 lg:mb-11 2xl:mb-14 3xl:mb-18 4xl:mb-24
        ">

          {/* Left */}
          <div className="shrink-0 reveal" style={{ transitionDelay: '0.1s' }}>
            <p className="
              flex items-center gap-2.5 uppercase tracking-[0.2em] font-medium text-linen-500
              text-[10px] sm:text-[10.5px] 2xl:text-xs 3xl:text-sm 4xl:text-base
              mb-3 sm:mb-4 2xl:mb-5 3xl:mb-6
            ">
              <span className="h-px bg-linen-400 shrink-0 w-5 2xl:w-7 3xl:w-9 4xl:w-12"></span>
              Our Promise
            </p>

            <h2 className="
              leading-[1.04] tracking-tight
              text-[30px]
              xs:text-[34px]
              sm:text-[38px]
              md:text-[44px]
              lg:text-[50px]
              xl:text-[56px]
              2xl:text-[68px]
              3xl:text-[88px]
              4xl:text-[108px]
            ">
              <span className="block font-light   text-linen-900">The Nyoraa</span>
              <span className="block font-semibold text-linen-900">Standards</span>
            </h2>
          </div>

          {/* Right: description */}
          <p className="reveal
            text-linen-600 font-normal leading-[1.75]
            sm:text-right
            text-[12px]
            xs:text-[12.5px]
            sm:text-[12.5px] sm:max-w-[210px]
            md:text-[13px]   md:max-w-[230px]
            lg:text-[13.5px] lg:max-w-[250px]
            xl:max-w-[270px]
            2xl:text-[16px]  2xl:max-w-[330px]
            3xl:text-[20px]  3xl:max-w-[420px]
            4xl:text-[24px]  4xl:max-w-[520px]
          " style={{ transitionDelay: '0.2s' }}>
            Clinical purity is not a marketing term—it is a molecular mandate. We bridge the gap between raw botanical power and surgical precision.
          </p>
        </div>

        {/* Top rule */}
        <div className="w-full h-px bg-gray-200 reveal" style={{ transitionDelay: '0.3s' }}></div>

        {/* ── CARDS GRID ──────────────────────────── */}
        <div className="
          relative
          grid grid-cols-1 sm:grid-cols-2
          gap-4 sm:gap-6 lg:gap-8
          border-y border-gray-200
          py-8 sm:py-10 lg:py-12
          mb-8 sm:mb-10 lg:mb-12 2xl:mb-16 3xl:mb-20 4xl:mb-28
        ">

          {/* Middle Vertical Line */}
          <div className="hidden sm:block absolute top-0 bottom-0 left-1/2 w-px bg-gray-200 -translate-x-1/2"></div>

          {/* Card 1 */}
          <div className="reveal shine-card group cursor-pointer relative
            flex items-start gap-4 xs:gap-5 2xl:gap-6 3xl:gap-8 4xl:gap-10
            p-6 sm:p-8 md:p-10 lg:p-12 2xl:p-14 3xl:p-18 4xl:p-24
            rounded-2xl
          " style={{ transitionDelay: '0.4s' }}>
            <div className="hidden sm:block absolute bottom-0 left-6 right-6 sm:left-8 sm:right-8 md:left-10 md:right-10 lg:left-12 lg:right-12 2xl:left-14 2xl:right-14 3xl:left-18 3xl:right-18 4xl:left-24 4xl:right-24 h-px bg-gray-200"></div>
            <span className="
              shrink-0 font-semibold tracking-wider text-linen-400 pt-px
              text-[10px] sm:text-[10.5px] 2xl:text-[13px] 3xl:text-base 4xl:text-xl
              transition-all duration-300 group-hover:text-linen-900 group-hover:-translate-y-1
            ">01</span>
            <div>
              <h3 className="
                font-semibold text-linen-900 leading-snug
                mb-2 2xl:mb-2.5 3xl:mb-3 4xl:mb-4
                text-[13px] xs:text-[13.5px] sm:text-[13.5px] md:text-[14px] lg:text-[15px]
                xl:text-[15.5px] 2xl:text-[18px] 3xl:text-[23px] 4xl:text-[28px]
                transition-colors duration-300 group-hover:text-amber-800
              ">Consumer Obsession</h3>
              <p className="
                text-linen-600 font-normal leading-[1.72]
                text-[11.5px] xs:text-[12px] sm:text-[12px] md:text-[12.5px] lg:text-[13px]
                2xl:text-[15px] 3xl:text-[19px] 4xl:text-[23px]
                transition-colors duration-300 group-hover:text-linen-800
              ">Every decision starts and ends with the person who uses our products. We study lives, not just demographics. We listen to silences as much as surveys.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="reveal shine-card group cursor-pointer relative
            flex items-start gap-4 xs:gap-5 2xl:gap-6 3xl:gap-8 4xl:gap-10
            p-6 sm:p-8 md:p-10 lg:p-12 2xl:p-14 3xl:p-18 4xl:p-24
            rounded-2xl
          " style={{ transitionDelay: '0.5s' }}>
            <div className="hidden sm:block absolute bottom-0 left-6 right-6 sm:left-8 sm:right-8 md:left-10 md:right-10 lg:left-12 lg:right-12 2xl:left-14 2xl:right-14 3xl:left-18 3xl:right-18 4xl:left-24 4xl:right-24 h-px bg-gray-200"></div>
            <span className="
              shrink-0 font-semibold tracking-wider text-linen-400 pt-px
              text-[10px] sm:text-[10.5px] 2xl:text-[13px] 3xl:text-base 4xl:text-xl
              transition-all duration-300 group-hover:text-linen-900 group-hover:-translate-y-1
            ">02</span>
            <div>
              <h3 className="
                font-semibold text-linen-900 leading-snug
                mb-2 2xl:mb-2.5 3xl:mb-3 4xl:mb-4
                text-[13px] xs:text-[13.5px] sm:text-[13.5px] md:text-[14px] lg:text-[15px]
                xl:text-[15.5px] 2xl:text-[18px] 3xl:text-[23px] 4xl:text-[28px]
                transition-colors duration-300 group-hover:text-amber-800
              ">Design as Strategy</h3>
              <p className="
                text-linen-600 font-normal leading-[1.72]
                text-[11.5px] xs:text-[12px] sm:text-[12px] md:text-[12.5px] lg:text-[13px]
                2xl:text-[15px] 3xl:text-[19px] 4xl:text-[23px]
                transition-colors duration-300 group-hover:text-linen-800
              ">Design is not decoration — it is the clearest expression of a brand's promise. Beautiful and purposeful are never mutually exclusive in our work.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="reveal shine-card group cursor-pointer relative
            flex items-start gap-4 xs:gap-5 2xl:gap-6 3xl:gap-8 4xl:gap-10
            p-6 sm:p-8 md:p-10 lg:p-12 2xl:p-14 3xl:p-18 4xl:p-24
            rounded-2xl
          " style={{ transitionDelay: '0.6s' }}>
            {/* Note: No bottom line needed on Card 3 because the grid container has border-b */}
            <span className="
              shrink-0 font-semibold tracking-wider text-linen-400 pt-px
              text-[10px] sm:text-[10.5px] 2xl:text-[13px] 3xl:text-base 4xl:text-xl
              transition-all duration-300 group-hover:text-linen-900 group-hover:-translate-y-1
            ">03</span>
            <div>
              <h3 className="
                font-semibold text-linen-900 leading-snug
                mb-2 2xl:mb-2.5 3xl:mb-3 4xl:mb-4
                text-[13px] xs:text-[13.5px] sm:text-[13.5px] md:text-[14px] lg:text-[15px]
                xl:text-[15.5px] 2xl:text-[18px] 3xl:text-[23px] 4xl:text-[28px]
                transition-colors duration-300 group-hover:text-amber-800
              ">Long-term Thinking</h3>
              <p className="
                text-linen-600 font-normal leading-[1.72]
                text-[11.5px] xs:text-[12px] sm:text-[12px] md:text-[12.5px] lg:text-[13px]
                2xl:text-[15px] 3xl:text-[19px] 4xl:text-[23px]
                transition-colors duration-300 group-hover:text-linen-800
              ">We build brands that outlast us. We resist shortcuts that compromise brand equity. Our portfolio is curated for generational relevance — we measure trust in decades.</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="reveal shine-card group cursor-pointer relative
            flex items-start gap-4 xs:gap-5 2xl:gap-6 3xl:gap-8 4xl:gap-10
            p-6 sm:p-8 md:p-10 lg:p-12 2xl:p-14 3xl:p-18 4xl:p-24
            rounded-2xl
          " style={{ transitionDelay: '0.7s' }}>
            <span className="
              shrink-0 font-semibold tracking-wider text-linen-400 pt-px
              text-[10px] sm:text-[10.5px] 2xl:text-[13px] 3xl:text-base 4xl:text-xl
              transition-all duration-300 group-hover:text-linen-900 group-hover:-translate-y-1
            ">04</span>
            <div>
              <h3 className="
                font-semibold text-linen-900 leading-snug
                mb-2 2xl:mb-2.5 3xl:mb-3 4xl:mb-4
                text-[13px] xs:text-[13.5px] sm:text-[13.5px] md:text-[14px] lg:text-[15px]
                xl:text-[15.5px] 2xl:text-[18px] 3xl:text-[23px] 4xl:text-[28px]
                transition-colors duration-300 group-hover:text-amber-800
              ">Authentic Stories</h3>
              <p className="
                text-linen-600 font-normal leading-[1.72]
                text-[11.5px] xs:text-[12px] sm:text-[12px] md:text-[12.5px] lg:text-[13px]
                2xl:text-[15px] 3xl:text-[19px] 4xl:text-[23px]
                transition-colors duration-300 group-hover:text-linen-800
              ">Every brand in our house is built on a foundation of truth. We celebrate heritage and craftsmanship, ensuring every product tells a story of integrity.</p>
            </div>
          </div>

        </div>

        {/* ── STATS STRIP ────────────────────────── */}
        <div className="group cursor-pointer flex items-center divide-x divide-gray-200 border border-gray-200 rounded-2xl sm:rounded-[2rem]
          py-8 sm:py-10 md:py-12 lg:py-14
          px-4 sm:px-6 md:px-8 lg:px-10
          transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(200,190,180,0.3)] hover:bg-[#faf9f7] hover:border-gray-300
        ">

          <div className="reveal
            flex-1 pr-5
            xs:pr-6 sm:pr-8 md:pr-10 lg:pr-12 xl:pr-14
            2xl:pr-16 3xl:pr-20 4xl:pr-28
          " style={{ transitionDelay: '0.8s' }}>
            <p className="
              font-light text-linen-700 leading-none tracking-tight
              mb-1.5 2xl:mb-2 3xl:mb-3
              text-[28px] xs:text-[30px] sm:text-[32px] md:text-[36px] lg:text-[40px]
              xl:text-[44px] 2xl:text-[56px] 3xl:text-[72px] 4xl:text-[88px]
              transition-transform duration-500 group-hover:scale-105 group-hover:text-linen-900
            "><CountUp end={4} duration={1.2} />+</p>
            <p className="
              font-medium uppercase tracking-[0.16em] text-linen-500
              text-[9px] xs:text-[9.5px] sm:text-[10px] lg:text-[10.5px]
              2xl:text-xs 3xl:text-sm 4xl:text-base
            ">Child brands</p>
          </div>

          <div className="reveal
            flex-1 px-5
            xs:px-6 sm:px-8 md:px-10 lg:px-12 xl:px-14
            2xl:px-16 3xl:px-20 4xl:px-28
          " style={{ transitionDelay: '0.9s' }}>
            <p className="
              font-light text-linen-700 leading-none tracking-tight
              mb-1.5 2xl:mb-2 3xl:mb-3
              text-[28px] xs:text-[30px] sm:text-[32px] md:text-[36px] lg:text-[40px]
              xl:text-[44px] 2xl:text-[56px] 3xl:text-[72px] 4xl:text-[88px]
              transition-transform duration-500 group-hover:scale-105 group-hover:text-linen-900
            "><CountUp end={6} duration={1.2} />+</p>
            <p className="
              font-medium uppercase tracking-[0.16em] text-linen-500
              text-[9px] xs:text-[9.5px] sm:text-[10px] lg:text-[10.5px]
              2xl:text-xs 3xl:text-sm 4xl:text-base
            ">Years of trust</p>
          </div>

          <div className="reveal
            flex-1 pl-5
            xs:pl-6 sm:pl-8 md:pl-10 lg:pl-12 xl:pl-14
            2xl:pl-16 3xl:pl-20 4xl:pl-28
          " style={{ transitionDelay: '1.0s' }}>
            <p className="
              font-light text-linen-700 leading-none tracking-tight
              mb-1.5 2xl:mb-2 3xl:mb-3
              text-[28px] xs:text-[30px] sm:text-[32px] md:text-[36px] lg:text-[40px]
              xl:text-[44px] 2xl:text-[56px] 3xl:text-[72px] 4xl:text-[88px]
              transition-transform duration-500 group-hover:scale-105 group-hover:text-linen-900
            "><CountUp end={10} duration={1.2} />+</p>
            <p className="
              font-medium uppercase tracking-[0.16em] text-linen-500
              text-[9px] xs:text-[9.5px] sm:text-[10px] lg:text-[10.5px]
              2xl:text-xs 3xl:text-sm 4xl:text-base
            ">Products offered</p>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
