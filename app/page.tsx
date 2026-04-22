"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

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

  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeBrand, setActiveBrand] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    // CURSOR LOGIC
    const c = cursorRef.current;
    const cr = cursorRRef.current;
    let mx = 0, my = 0, rx = 0, ry = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (c) {
        c.style.left = mx + 'px';
        c.style.top = my + 'px';
      }
    };
    document.addEventListener('mousemove', handleMouseMove);

    const animateCursor = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      if (cr) {
        cr.style.left = rx + 'px';
        cr.style.top = ry + 'px';
      }
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const hoverElements = document.querySelectorAll('a, button, .bc, .pc');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (c && cr) {
          c.style.width = '17px'; c.style.height = '17px';
          cr.style.width = '48px'; cr.style.height = '48px';
        }
      });
      el.addEventListener('mouseleave', () => {
        if (c && cr) {
          c.style.width = '10px'; c.style.height = '10px';
          cr.style.width = '34px'; cr.style.height = '34px';
        }
      });
    });

    // LOGO BAND ANIMATION
    if (logoPathsRef.current) {
      const paths = logoPathsRef.current.querySelectorAll('polygon, path');
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1, yoyo: true });

      paths.forEach(path => {
        gsap.set(path, {
          x: gsap.utils.random(-300, 300),
          y: gsap.utils.random(-300, 300),
          rotation: gsap.utils.random(-720, 720),
          scale: 0,
          opacity: 0
        });
      });

      tl.to(paths, {
        duration: 1.2,
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        ease: "power4.inOut",
        stagger: 0.008
      });

      const lb = logoBandRef.current;
      if (lb) {
        lb.addEventListener('mouseenter', () => tl.timeScale(0.2));
        lb.addEventListener('mouseleave', () => tl.timeScale(1));
      }
    }

    // WEBGL LOGIC
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl", {
      alpha: false, antialias: false, depth: false, stencil: false,
      preserveDrawingBuffer: false, powerPreference: "high-performance"
    });

    if (!gl) return;

    const vs = `attribute vec2 a; void main() { gl_Position = vec4(a, 0.0, 1.0); }`;
    const fs = `
      precision highp float;
      uniform vec2  uR;
      uniform float uT, uS, uSc, uBl;
      uniform vec3  uBg;
      #define PI 3.14159265359
      #define MARCH_STEPS 22
      #define REFINE_STEPS 5
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
          col += sunCol * (pow(max(dot(reflect(-sunDir, n), v), 0.0), 200.0) * step(0.0, sunDir.y) * 1.1 + pow(max(dot(reflect(-sunDir, n), v), 0.0), 32.0) * 0.12 * sunGlow);
          col += sunCol * pow(max(dot(reflect(rd, n), sunDir), 0.0), 8.0) * 0.48 * smoothstep(0.0, 0.35, -rd.y) * sunGlow;
          col += sunCol * smoothstep(0.94, 1.0, noise(wp * 18.0 + vec2(uT * 0.55, uT * 0.22))) * 0.08 * sunGlow * step(0.0, sunDir.y);
          if (moonAmt > 0.04) col += vec3(0.72, 0.80, 0.95) * pow(max(dot(reflect(-moonDir, n), v), 0.0), 520.0) * 0.09 * moonAmt;
          float hC = waveH(wp, uT, waveAmp, storm); float foam = clamp((waveH(wp-vec2(0.025,0),uT,waveAmp,storm)+waveH(wp+vec2(0.025,0),uT,waveAmp,storm)+waveH(wp-vec2(0,0.025),uT,waveAmp,storm)+waveH(wp+vec2(0,0.025),uT,waveAmp,storm)-4.0*hC)*(24.0+storm*10.0),0.0,1.0);
          col += foam * vec3(1.0) * (0.03 + storm * 0.10); col = mix(col, fogCol, 1.0 - exp(-t * fogDen * 1.65));
        } else {
          float h = clamp(rd.y, 0.0, 1.0); vec3 sCol = mix(skyHori, skyTop, pow(h, 0.38));
          float cl = smoothstep(0.62, 0.86, noise(rd.x*5.5+vec2(rd.y*3.0,uT*0.015))*0.65+noise(rd.x*8.0-vec2(rd.y*4.0,uT*0.010))*0.35)*smoothstep(-0.02,0.24,rd.y)*(0.08+storm*0.18);
          sCol = mix(sCol, mix(sCol*0.97, mix(vec3(1.0,0.82,0.65), vec3(0.42,0.48,0.56), storm), 0.35), cl);
          float sd = max(dot(rd, sunDir), 0.0); sCol += sunCol * (pow(sd,380.0)*6.8+pow(sd,22.0)*0.2+pow(sd,5.0)*0.09+smoothstep(0.99925,0.99995,sd)*2.6)*sunGlow;
          sCol += sunCol * (exp(-abs(rd.y)*24.0)*0.11 + pow(sd,3.0)*0.035) * sunGlow;
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
    const update = () => {
      const cinematicRange = 4000;
      tgt = Math.min(1, window.scrollY / cinematicRange);
    };
    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); gl.uniform2f(uR, w, h); update();
    };
    window.addEventListener("resize", resize); window.addEventListener("scroll", update); resize();

    const frame = (now: number) => {
      smooth += (tgt - smooth) * 0.1;
      const N = 4; // 4 sections
      const raw = smooth * (N - 1);
      const si = Math.min(Math.floor(raw), N - 2);
      const bl = raw - si;

      if (hudPctRef.current) hudPctRef.current.textContent = Math.round(smooth * 100).toString().padStart(3, '0') + '%';
      if (progFillRef.current) progFillRef.current.style.width = (smooth * 100) + '%';

      const NAMES = ["AURÉ", "NŪRA", "LUMINA", "VERA"];
      if (sceneNameRef.current) sceneNameRef.current.textContent = NAMES[Math.min(Math.floor(smooth * N), N - 1)];
      if (dotsRef.current) Array.from(dotsRef.current.children).forEach((d, i) => d.classList.toggle("active", i === Math.min(Math.floor(smooth * N), N - 1)));

      gl.uniform1f(uT, now / 1000); gl.uniform1f(uS, smooth); gl.uniform1f(uSc, si); gl.uniform1f(uBl, bl);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);

    // REVEAL & SCRAMBLE
    const scramble = (el: HTMLElement, duration: number = 800) => {
      const final = el.getAttribute('data-scramble') || el.innerText;
      const chars = final.replace(/\s/g, '');
      const original = el.innerHTML;
      let its = 0;
      const interval = setInterval(() => {
        el.innerText = final.split("").map((c, i) => {
          if (i < its) return final[i];
          if (c === ' ' || c === '\n') return c;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("");
        if (its >= final.length) {
          clearInterval(interval);
          el.innerHTML = original;
        }
        its += final.length / (duration / 30);
      }, 30);
    };

    const obs = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        e.target.classList.add('visible');
        if (e.target.hasAttribute('data-scramble')) {
          scramble(e.target as HTMLElement);
        }
      }
    }), { threshold: 0.1 });
    document.querySelectorAll('.reveal, .tag, h1, h2, .body-text, .stat-row, .cta, .h-line').forEach(e => obs.observe(e));

    // DRAG SCROLL
    const rail = prodRailRef.current;
    let isDown = false, sx = 0, sl = 0;
    if (rail) {
      rail.addEventListener('mousedown', e => { isDown = true; sx = e.pageX - rail.offsetLeft; sl = rail.scrollLeft; });
      rail.addEventListener('mouseleave', () => isDown = false);
      rail.addEventListener('mouseup', () => isDown = false);
      rail.addEventListener('mousemove', e => { if (!isDown) return; e.preventDefault(); rail.scrollLeft = sl - (e.pageX - rail.offsetLeft - sx) * 1.4; });
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener("resize", resize); window.removeEventListener("scroll", update);
      obs.disconnect();
    };
  }, []);

  return (
    <main>
      <div className="cur" ref={cursorRef}></div>
      <div className="cur-r" ref={cursorRRef}></div>
      <canvas id="webgl_canvas" ref={canvasRef}></canvas>

      <nav>
        <div className="nav-logo">N<span>y</span>oraa</div>
        <ul className="nav-links">
          <li><a href="#">Brands</a></li>
          <li><a href="#spotlight">Products</a></li>
          <li><a href="#philosophy">Philosophy</a></li>
          <li><a href="#values">Values</a></li>
          <li><a href="#testimonials">Reviews</a></li>
        </ul>
        <button className="nav-btn">Explore</button>
      </nav>

      <div id="hud">
        <div id="hud_pct" ref={hudPctRef}>000%</div>
        <div className="progress-bar">
          <div className="progress-fill" ref={progFillRef}></div>
        </div>
        <div className="scene-label" ref={sceneNameRef}>DAWN</div>
      </div>
      <div id="scene_strip" ref={dotsRef}>
        <div className="scene-dot active"></div><div className="scene-dot"></div><div className="scene-dot"></div><div className="scene-dot"></div>
      </div>
      <button id="theme_toggle" onClick={() => {
        const nt = theme === 'dark' ? 'light' : 'dark'; setTheme(nt); document.documentElement.setAttribute('data-theme', nt);
      }}>
        <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
      </button>
      {/*hero*/}
      <div id="scroll_container">
        <section id="s0" className="side-layout">
          <div className="text-card">
            <div className="tag">Brand Spotlight — Auré</div>
            <h1>THE<br />FOUNDATION<br />OF GLOW</h1>
            <p className="body-text">
              Auré redefines the first step of your ritual. Our lipid-replenishing
              cleansers and creams prepare the canvas, ensuring purity without
              compromising the skin's natural barrier.
            </p>
            <a className="cta" href="#s1">
              Explore Auré
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 6h10M6 1l5 5-5 5" />
              </svg>
            </a>
          </div>
          <div className="side-text reveal">
            <div className="tag" data-scramble="House of Beauty">House of Beauty</div>
            <h2 className="sh-h" data-scramble="Four Brands, One Vision">Four Brands, <br /><em>One Vision</em></h2>
          </div>
        </section>
        <section id="s1">
          <div className="text-card right">
            <div className="h-line"></div>
            <div className="tag">Brand Spotlight — Nūra</div>
            <h2>PRECISION<br />ACTIVES</h2>
            <p className="body-text">
              Where science meets serenity. Nūra's concentrated serums and night
              treatments deliver high-potency actives—Retinol, Vitamin C, and
              Peptides—directly where they're needed most.
            </p>
            <div className="stat-row" style={{ justifyContent: "flex-end" }}>
              <div className="stat">
                <span className="stat-num">98%</span>
                <span className="stat-label">Purity</span>
              </div>
              <div className="stat">
                <span className="stat-num">12h</span>
                <span className="stat-label">Release</span>
              </div>
            </div>
          </div>
        </section>
        <section id="s2">
          <div className="text-card">
            <div className="h-line"></div>
            <div className="tag">Brand Spotlight — Lumina</div>
            <h2>MAXIMUM<br />HYDRATION</h2>
            <p className="body-text">
              Lumina's signature face creams are engineered for 24-hour moisture.
              A cloud-like texture that melts into the skin, leaving a finish
              that is both dewy and resilient.
            </p>
            <a className="cta" href="#s3">
              View Collection
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 6h10M6 1l5 5-5 5" />
              </svg>
            </a>
          </div>
        </section>
        <section id="s3">
          <div className="text-card center">
            <div className="h-line"></div>
            <div className="tag">Brand Spotlight — Vera</div>
            <h2>BOTANICAL<br />SHIELD</h2>
            <p className="body-text">
              Vera harnesses the defensive power of rare botanicals. Our barrier-repair
              creams and mineral sunscreens protect your radiance from environmental
              stressors and UV damage.
            </p>
          </div>
        </section>
      </div>
      {/*hero ends here*/}
      <div className="stripe">
        <div className="stripe-t">
          <span>Face Care</span><span className="dot">✦</span><span>Shampoo &amp; Hair</span><span className="dot">✦</span><span>Body Wellness</span><span className="dot">✦</span><span>Serums &amp; Actives</span><span className="dot">✦</span><span>Clean Beauty</span><span className="dot">✦</span><span>Sustainable Formulas</span><span className="dot">✦</span><span>Men's Grooming</span><span className="dot">✦</span><span>Sun Protection</span><span className="dot">✦</span>
          <span>Face Care</span><span className="dot">✦</span><span>Shampoo &amp; Hair</span><span className="dot">✦</span><span>Body Wellness</span><span className="dot">✦</span><span>Serums &amp; Actives</span><span className="dot">✦</span><span>Clean Beauty</span><span className="dot">✦</span><span>Sustainable Formulas</span><span className="dot">✦</span><span>Men's Grooming</span><span className="dot">✦</span><span>Sun Protection</span><span className="dot">✦</span>
        </div>
      </div>
      {/*our philosophy*/}
      <section id="brands" className="sec">
        <div className="brands-intro reveal">
          <div><div className="sh-eye">Market Spotlight</div><h2 className="sh-h">Trending<br /><em>Products</em></h2></div>
          <p className="brands-intro-r sh-p">
            {[
              "Auré redefines the first step of your ritual. Our lipid-replenishing cleansers and creams prepare the canvas, ensuring purity without compromise.",
              "Nūra is precision in a bottle. We target hyperpigmentation and aging with dropper-based serums rooted in clinical transparency and rapid results.",
              "Velva brings silk to your strands. Our protein-complex shampoos and masks transform texture into a frizz-free, high-gloss masterpiece.",
              "Lumina delivers deep arctic hydration. We utilize molecular moisture technology to repair the skin's barrier and lock in a dewy, translucent glow.",
              "Vera is your botanical shield. Our sun protection and anti-pollution formulas create a breathable barrier against modern urban stressors.",
              "Lyra is the art of sensory identity. Each fragrance is an olfactory narrative crafted from rare essential oils and emotive resonance.",
              "Kora focuses on holistic body wellness. Our rituals combine skin-firming actives with aromatherapeutic notes for total mind-body rejuvenation.",
              "Iris provides specialized care for the eyes. We target fine lines and fatigue with cooling, scientific formulas for a brightened, awakened look."
            ][activeBrand]}
          </p>
        </div>
        
        <div className="options">
          {[
            { name: "Auré", sub: "Botanical Face Care", icon: "fas fa-leaf", bg: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800" },
            { name: "Nūra", sub: "Precision Actives", icon: "fas fa-flask", bg: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800" },
            { name: "Velva", sub: "Silk Hair Systems", icon: "fas fa-wind", bg: "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&q=80&w=800" },
            { name: "Lumina", sub: "Arctic Hydration", icon: "fas fa-tint", bg: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=800" },
            { name: "Vera", sub: "Botanical Defense", icon: "fas fa-shield-alt", bg: "https://images.unsplash.com/photo-1611080626919-7cf5a9dcab5b?auto=format&fit=crop&q=80&w=800" },
            { name: "Lyra", sub: "Signature Scent", icon: "fas fa-magic", bg: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800" },
            { name: "Kora", sub: "Body Wellness", icon: "fas fa-spa", bg: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800" },
            { name: "Iris", sub: "Precision Eye Care", icon: "fas fa-eye", bg: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800" }
          ].map((brand, i) => (
            <div 
              key={i}
              className={`option ${activeBrand === i ? 'active' : ''}`} 
              style={{ "--optionBackground": `url(${brand.bg})` } as any}
              onClick={() => setActiveBrand(i)}
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


      {/*about products and its purity */}
      <section className="why-section reveal">
        <div className="section-header">
          <div className="header-left">
            <p className="eyebrow">Our promise</p>
            <h2 className="section-title">The Nyoraa<br/><span>Standards</span></h2>
          </div>
          <p className="header-right">
            Clinical purity is not a marketing term—it is a molecular mandate. We bridge the gap between raw botanical power and surgical precision.
          </p>
        </div>

        <div className="logo-band" ref={logoBandRef}>
          <figure>
            <svg viewBox="0 0 883 105.2" overflow="visible">
              <g ref={logoPathsRef}>
                <polygon points="359.9,49.6 359.8,49.7 359.9,49.8 "/>
                <polygon points="28,0 10.8,0 28,9 "/><polygon points="28,12.6 0,46 0,51.9 28,48.9 "/><polygon points="0.8,105 28,105 28,74.7 20.3,69.7 "/><polygon points="28,9 10.8,0 0,0 0,46 28,12.6 "/><polygon points="0,51.9 0,57.3 20,69.8 20,69.8 20,69.8 28,74.7 28,48.9 "/><polygon points="0,57.3 0,105 0.8,105 20.1,69.7 "/>
                <polygon points="89.7,40.6 61,25.9 38,46 38,47.8 91,41.9 "/><polygon points="89.7,40.6 68.4,19.4 61,25.9 "/><polygon points="99,41 126,37.9 126,30.3 99,0 99,0 "/><polygon points="38,47.8 38,48.9 103.1,63.5 98.9,49.8 91,41.9 "/><polygon points="68.4,19.3 49.2,0 38,0 38,14.1 61,25.8 "/><polygon points="38,48.9 38,80.9 66,98.3 66,55.5 115.2,105 115.8,105 103.1,63.4 "/><polygon points="61,25.9 38,14.1 38,46 "/><polygon points="38,105 66,105 66,98.3 38,80.9 "/><polygon points="126,0 99,0 126,30.3 "/><polygon points="99,49.8 102.9,63.5 126,68.7 126,59.4 99,45.3 "/><polygon points="99,41 99,45.3 126,59.4 126,37.9 "/><polygon points="115.8,105 126,105 126,68.7 102.8,63.4 "/>
                <path d="M225.8,74.2l-12.6,24.5c7.5,4.1,16.1,6.5,25.3,6.5c2.2,0,4.3-0.1,6.4-0.4L237,77.7C233,77.5,229.1,76.2,225.8,74.2z"/><path d="M213.8,55.7l-20.8,23c4.8,8.4,11.8,15.4,20.3,20.1l12.6-24.5C219.3,70.3,214.7,63.5,213.8,55.7z"/><path d="M238.5,77.8c-0.5,0-1,0-1.4,0l7.8,27.1c8.7-1,16.7-4.2,23.6-8.9l-14.6-23.3C249.5,75.8,244.3,77.8,238.5,77.8z"/><path d="M251.5,31.3c6.7,4.1,11.3,11.2,11.9,19.4l27.5,1.5c-0.1-12.4-4.6-23.9-12-32.8L251.5,31.3z"/><path d="M263.6,52.7c0,8-3.8,15.2-9.8,19.8l14.6,23.3c13.6-9.4,22.6-25.2,22.6-43c0-0.2,0-0.4,0-0.6l-27.5-1.5C263.5,51.4,263.6,52,263.6,52.7z"/><path d="M227.3,30.3L212.7,7.1c-8.5,4.9-15.6,12.1-20.3,20.8L218.3,38C220.6,34.8,223.7,32.1,227.3,30.3z"/><path d="M213.6,52.7c0-5.5,1.8-10.6,4.7-14.7l-25.9-10.2c-4,7.5-6.3,16-6.3,25c0,9.4,2.5,18.2,6.8,25.8l20.8-23C213.6,54.7,213.6,53.7,213.6,52.7z"/><path d="M238.5,27.7c3.6,0,7,0.8,10.1,2.1l12.5-24.4c-6.8-3.3-14.5-5.1-22.6-5.1c-9.4,0-18.2,2.5-25.8,6.8l14.6,23.3C230.7,28.6,234.5,27.7,238.5,27.7z"/><path d="M251.5,31.3L279,19.4c-4.9-5.9-11-10.7-17.9-14.1l-12.5,24.4C249.6,30.2,250.6,30.7,251.5,31.3z"/>
                <polygon points="387,105 360,50 360,89.1 376.1,105 "/><polygon points="387,29.5 360.8,0 360,0 360,49.6 387,30.8 "/><polygon points="387,0 360.8,0 387,29.5 "/><polygon points="359.9,49.8 359.8,49.7 336.6,65.6 360,89.1 360,50 "/><polygon points="336.1,26 335.6,26.1 330.8,59.8 335.6,26.1 308.8,27.1 335.6,26.1 335.6,25.5 310.2,0 299,0 299,8.2 327,61.4 327,55.5 336.8,65.6 359.9,49.7 "/><polygon points="360,50 360,50 360,50 387,105 387,105 387,30.8 360,49.6 360,49.8 "/><polygon points="299,105 326.1,105 310.9,78.9 326.1,105 327,105 327,69.5 299,86.5 "/><polygon points="299,52.7 299,86.5 327,69.5 327,65.1 299,36.4 "/><polygon points="336.1,26 335.6,25.6 335.6,26.1 "/><polygon points="299,8.2 299,36.4 327,65.1 327,61.4 "/>
                <polygon points="425,36 425,27.8 399.8,0 397,0 397,49.5 397,49.5 "/><polygon points="425,76 397,76 397,105.2 425,80.3 "/><polygon points="432.5,63 438.1,40 425,40 425,36 397.4,49.5 425,66.1 425,63 "/><polygon points="425,66.1 397,49.5 397,49.5 397,76 425,76 "/><polygon points="425,23 444.3,23 437.3,0 399.8,0 425,27.8 "/><polygon points="397.4,49.5 397.4,49.5 397.4,49.5 "/><polygon points="432.5,63 456.7,63 449.5,40 438.1,40 "/><polygon points="463,23 463,0 437.3,0 444.3,23 "/><polygon points="458,63 458,40 449.5,40 456.7,63 "/><polygon points="463,83 425,83 425,80.3 397.4,105 462,105 420.9,83.8 462,105 463,105 "/>
                <path d="M591.6,68.8c8.7-7.1,14.3-17.9,14.3-29.9c0-4.8-0.9-9.3-2.5-13.5l-20.6,13.3L591.6,68.8z"/><path d="M582.8,38.6L582.8,38.6C582.7,38.6,582.7,38.6,582.8,38.6L582.8,38.6z"/><path d="M567.8,77c0.5,0,1.1,0.4,1.6,0.4L564.8,54h-8.7l-13.9,21l8.8,11.1V77H567.8z"/><path d="M556.1,54H551V23h16.6c2.6,0,5.1,0.9,7.3,2.1l12.8-19.2C581.7,2.2,574.7,0,567.2,0h-33.8l27.2,16.7l27-10.7l-27,10.8l0,0l0,0l-37.7,15v17.9L542,75L556.1,54z"/><path d="M582.7,38.9c0,8.4-6.7,15.1-15.1,15.1h-2.9l4.6,23.5c8.4-0.4,16.1-3.6,22.2-8.6L582.7,38.9L582.7,38.9z"/><polygon points="523,103.4 523,105 551,105 551,86.1 542.2,74.8 "/><polygon points="523,49.7 523,103.4 542,74.8 "/><polygon points="533.4,0 523,0 523,31.8 560.7,16.7 "/><path d="M582.7,38.6L582.7,38.6l20.6-13.2c-3-8-8.6-14.8-15.8-19.2l-12.8,19.2C579.6,27.8,582.7,32.8,582.7,38.6z"/>
                <polygon points="609,65.6 609,105 615.3,105 628.8,75.8 615.3,105 637,105 637,96.9 619.9,53.5 "/><polygon points="620.1,53.5 637,96.9 637,59.8 637,34.4 "/><polygon points="637,0 617.8,0 637,21.8 "/><polygon points="637,34.4 637,21.8 617.8,0 609,0 609,25.8 619.9,53.5 "/><polygon points="609,25.8 609,65.6 619.7,53.5 "/>
                <polygon points="686.5,83 674,83 674,63 695.6,63 690.1,40 683.5,40 664.3,83.1 677,105 681.6,105 "/><polygon points="647,53.2 647,105 654.5,105 664.4,83.2 "/><polygon points="683.5,40 674,40 674,34.9 646.6,53 646.8,53 664.3,83.1 "/><polygon points="712,23 712,0 701.3,0 691.2,23 "/><polygon points="654.5,105 677,105 664.3,83.1 "/><polygon points="674,23 675.1,23 652.4,0 647,0 647,53.2 674,34.9 "/><polygon points="686.1,23 680.7,0 652.4,0 675.1,23 "/><polygon points="712,105 712,83 700.1,83 705.4,105 "/><polygon points="708,63 708,40 690.1,40 695.6,63 "/><polygon points="681.6,105 705.4,105 700.1,83 686.5,83 "/><polygon points="691.2,23 701.3,0 680.7,0 686.1,23 "/>
                <path d="M770.6,77.4c-8,0-14.8-3.3-19.2-8.6l-2.6,31.8c6.4,2.9,13.4,4.6,20.8,4.7l17.5-33.8C783,75.2,777.2,77.4,770.6,77.4z"/><path d="M746,53.7l-26.2,12.4c4,15.3,14.8,27.9,29,34.4l2.6-31.8C748.2,64.7,746.2,59.6,746,53.7z"/><path d="M787.2,71.4l-17.5,33.8c0.3,0,0.6,0,0.9,0c14.6,0,27.7-6,37.2-15.5l-19.6-19.3C787.9,70.7,787.6,71,787.2,71.4z"/><path d="M770.6,28.1c7.1,0,13.3,2.5,17.6,6.9l0,0L777.7,0.7c-2.3-0.3-4.7-0.5-7.1-0.5c-4.8,0-9.4,0.6-13.7,1.8l-2.6,31.8C758.5,30.2,764.2,28.1,770.6,28.1z"/><path d="M807.6,15.5c-7.9-7.9-18.3-13.2-29.9-14.8l10.6,34.2L807.6,15.5z"/><path d="M746,52.7c0-7.4,2.8-13.8,7.5-18.2l-30.3-4.2c-3.2,6.8-5,14.4-5,22.4c0,4.6,0.6,9.1,1.7,13.4L746,53.7C746,53.3,746,53,746,52.7z"/><path d="M754.3,33.8l2.6-31.8c-14.9,4-27.2,14.5-33.7,28.3l30.3,4.2C753.7,34.3,754,34,754.3,33.8z"/>
                <polygon points="845,40 845,39 818,39 818,66.2 848.9,40 "/><polygon points="845,63 859.1,63 850.7,40 848.9,40 818,66.2 818,74.6 845,78.3 "/><polygon points="845,83 845,78.3 818,74.6 818,105 839.2,105 847.7,83 "/><polygon points="879,63 879,40 850.7,40 859.1,63 "/><polygon points="839.2,105 865.9,105 880.8,83 847.7,83 "/><polygon points="873.2,23 883,23 883,0 860.4,0 860.4,0 "/><polygon points="883,105 883,83 880.8,83 865.9,105 "/><polygon points="860.4,0.2 860.4,0.2 860.4,0.2 "/><polygon points="845,23 873.2,23 860.6,0.2 818,32.2 818,39 845,39 "/><polygon points="860.4,0 818,0 818,32.2 860.4,0 "/>
              </g>
            </svg>
          </figure>
          <span className="hover-hint">Hover to slow motion</span>
        </div>

        <div className="cards-grid">
          <div className="usp-card">
            <div className="card-num">01</div>
            <svg className="card-icon" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="12" stroke="var(--gold)" strokeWidth="1.5"/>
              <path d="M12 18l4 4 8-8" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="card-title">Molecular Purity</div>
            <div className="card-desc">Every drop is verified for clinical purity and botanical honesty. We accept nothing less than 100% molecular integrity.</div>
          </div>
          <div className="usp-card">
            <div className="card-num">02</div>
            <svg className="card-icon" viewBox="0 0 36 36" fill="none">
              <rect x="6" y="10" width="10" height="16" rx="2" stroke="var(--gold)" strokeWidth="1.5"/>
              <rect x="20" y="6" width="10" height="20" rx="2" stroke="var(--gold)" strokeWidth="1.5"/>
            </svg>
            <div className="card-title">Clinical Rigor</div>
            <div className="card-desc">Our formulas undergo 12 months of intense dermatological testing before they earn the Nyoraa seal of approval.</div>
          </div>
          <div className="usp-card">
            <div className="card-num">03</div>
            <svg className="card-icon" viewBox="0 0 36 36" fill="none">
              <path d="M18 6l3.09 6.26L28 13.27l-5 4.87 1.18 6.88L18 21.77l-6.18 3.25L13 18.14 8 13.27l6.91-1.01L18 6z" stroke="var(--gold)" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            <div className="card-title">Traceable Sourcing</div>
            <div className="card-desc">From seed to skin, we track every component of our supply chain to ensure ethical harvesting and sustainable growth.</div>
          </div>
          <div className="usp-card">
            <div className="card-num">04</div>
            <svg className="card-icon" viewBox="0 0 36 36" fill="none">
              <path d="M8 28V16M14 28V10M20 28V20M26 28V14" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div className="card-title">Ethical Extraction</div>
            <div className="card-desc">We utilize low-temperature extraction technology to preserve the cellular vitality of our botanical actives.</div>
          </div>
        </div>

        <div className="stats-strip">
          <div className="stat-item">
            <div className="stat-num">8+</div>
            <div className="stat-lbl">Child brands</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">12+</div>
            <div className="stat-lbl">Years of trust</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">200+</div>
            <div className="stat-lbl">Products offered</div>
          </div>
        </div>
      </section>
      {/*end about products and its purity*/}


      <footer>
        <div className="footer-wrap">
          <div className="bubbles">
            {Array.from({ length: 128 }).map((_, i) => (
              <div 
                key={i} 
                className="bubble" 
                style={{
                  "--size": `${2 + Math.random() * 4}rem`,
                  "--distance": `${6 + Math.random() * 4}rem`,
                  "--position": `${-5 + Math.random() * 110}%`,
                  "--time": `${2 + Math.random() * 2}s`,
                  "--delay": `${-1 * (2 + Math.random() * 2)}s`
                } as any}
              ></div>
            ))}
          </div>
          <div className="footer-content">
            <div className="footer-links">
              <div className="footer-col">
                <b>Eldew Rituals</b>
                <a href="#">Face Care</a>
                <a href="#">Serums</a>
                <a href="#">Cleansers</a>
                <a href="#">Moisturizers</a>
              </div>
              <div className="footer-col">
                <b>Brand Spotlight</b>
                <a href="#">Auré</a>
                <a href="#">Velva</a>
                <a href="#">Nūra</a>
                <a href="#">Lumina</a>
              </div>
              <div className="footer-col">
                <b>Science & Research</b>
                <a href="#">Molecular Lab</a>
                <a href="#">Purity Standards</a>
                <a href="#">Clinical Trials</a>
                <a href="#">Sustainability</a>
                <a href="#">Ethics</a>
              </div>
              <div className="footer-col">
                <b>Corporate</b>
                <a href="#">About Nyoraa</a>
                <a href="#">Careers</a>
                <a href="#">Investors</a>
                <a href="#">Contact</a>
              </div>
            </div>
            <div className="footer-bottom">
              <div className="ft-brand-wrap">
                <div className="ft-brand">N<span>y</span>oraa</div>
                <p>©2026 Nyoraa House of Beauty. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <svg style={{ position: "fixed", top: "100vh" }}>
        <defs>
          <filter id="blob">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="blob" />
          </filter>
        </defs>
      </svg>
    </main>
  );
}
