"use client";
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

export default function AboutUs() {
    const containerRef = useRef<HTMLDivElement>(null);
    const italicRef = useRef<HTMLDivElement>(null);
    const serifRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // -- AQUATIC SWIPER INITIALIZATION --
        let swiperInstance: any;
        const initSwiper = async () => {
            const { default: Swiper } = await import('swiper');
            const { EffectCoverflow, Pagination, Keyboard, Mousewheel } = await import('swiper/modules');

            swiperInstance = new Swiper('.aquatic-swiper', {
                modules: [EffectCoverflow, Pagination, Keyboard, Mousewheel],
                effect: 'coverflow',
                grabCursor: true,
                centeredSlides: true,
                coverflowEffect: {
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 3,
                    slideShadows: true
                },
                keyboard: {
                    enabled: true
                },
                mousewheel: {
                    thresholdDelta: 70
                },
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                breakpoints: {
                    640: {
                        slidesPerView: 2
                    },
                    768: {
                        slidesPerView: 1
                    },
                    1024: {
                        slidesPerView: 2
                    },
                    1560: {
                        slidesPerView: 3
                    }
                }
            });
        };

        initSwiper();

        let ctaFrameId: any;
        let ctaObs: IntersectionObserver | null = null;
        let draw: () => void;
        const ctx = gsap.context(() => {
            // Reveal Animations
            const revEls = document.querySelectorAll('.r, .r-left, .r-right, .r-scale');
            const revObs = new IntersectionObserver(entries => entries.forEach(e => {
                if (e.isIntersecting) e.target.classList.add('in');
            }), { threshold: .1 });
            revEls.forEach(e => revObs.observe(e));

            // Word Reveal
            const wordObs = new IntersectionObserver(entries => entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.querySelectorAll('.vwr-word').forEach((w, i) => {
                        setTimeout(() => w.classList.add('in'), i * 120);
                    });
                }
            }), { threshold: .3 });
            document.querySelectorAll('.vision-word-reveal').forEach(el => wordObs.observe(el));

            // GSAP Scroll Animations
            gsap.from('.team-card', {
                scrollTrigger: { trigger: '#leadership .team-grid', start: 'top 82%' },
                y: 44, opacity: 0, duration: .75, stagger: .12, ease: 'power3.out', scale: .97
            });
            gsap.from('.card', {
                scrollTrigger: { trigger: '#vision .page-content', start: 'top 82%' },
                y: 36, opacity: 0, duration: .7, stagger: .12, ease: 'power2.out'
            });
            gsap.from('#about-cta .cta-tagline', {
                scrollTrigger: { trigger: '#about-cta', start: 'top 70%' },
                y: 40, opacity: 0, duration: 1, ease: 'power3.out'
            });

            // -- CTA 3 FLOWING LINES --
            const canvas = canvasRef.current;
            if (canvas && canvas.parentElement) {
                const el = canvas.parentElement;
                const W = el.offsetWidth, H = el.offsetHeight;
                canvas.width = W; canvas.height = H;
                const canvasCtx = canvas.getContext('2d');
                if (canvasCtx) {
                    const lines = Array.from({ length: 18 }, (_, i) => ({
                        y: (i / 17) * H,
                        amp: 8 + Math.random() * 20,
                        freq: 0.005 + Math.random() * 0.01,
                        phase: Math.random() * Math.PI * 2,
                        speed: 0.008 + Math.random() * 0.01
                    }));
                    let t = 0;
                    let isCanvasVisible = true;
                    ctaObs = new IntersectionObserver(([entry]) => {
                        isCanvasVisible = entry.isIntersecting;
                    }, { threshold: 0.01 });
                    ctaObs.observe(canvas);

                    draw = () => {
                        if (!isCanvasVisible) return;
                        t += 1;
                        canvasCtx.clearRect(0, 0, W, H);
                        lines.forEach((l, i) => {
                            canvasCtx.beginPath();
                            canvasCtx.moveTo(0, l.y);
                            for (let x = 0; x <= W; x += 2) {
                                const y = l.y + Math.sin(x * l.freq + t * l.speed + l.phase) * l.amp;
                                canvasCtx.lineTo(x, y);
                            }
                            canvasCtx.strokeStyle = `rgba(184, 146, 74, ${0.05 + i * 0.008})`;
                            canvasCtx.lineWidth = 1;
                            canvasCtx.stroke();
                        });
                    };
                    gsap.ticker.add(draw);
                }

                gsap.to('#h3', {
                    scrollTrigger: { trigger: '#cta3', start: 'top 75%' },
                    opacity: 1, y: 0, duration: 1.2, ease: 'power3.out'
                });
                gsap.to('#p3', {
                    scrollTrigger: { trigger: '#cta3', start: 'top 75%' },
                    opacity: 1, duration: 1, delay: 0.6
                });
                gsap.to('#b3', {
                    scrollTrigger: { trigger: '#cta3', start: 'top 75%' },
                    opacity: 1, duration: 1, delay: 1.0
                });
            }

            // HEADER WRAPPING LOGIC
            if (serifRef.current) {
                const el = serifRef.current;
                const text = el.textContent || "";
                el.textContent = "";
                text.split(" ").forEach((word, i) => {
                    const mask = document.createElement("span");
                    mask.className = "word-mask";
                    const inner = document.createElement("span");
                    inner.className = "word-inner";
                    inner.textContent = word;
                    mask.appendChild(inner);
                    el.appendChild(mask);
                    if (i < text.split(" ").length - 1) el.appendChild(document.createTextNode(" "));
                });
            }

            if (italicRef.current) {
                const el = italicRef.current;
                const text = el.textContent || "";
                el.textContent = "";
                [...text].forEach((ch, i) => {
                    if (ch === " ") {
                        el.appendChild(document.createTextNode(" "));
                        return;
                    }
                    const span = document.createElement("span");
                    span.className = "char";
                    span.style.animationDelay = `${0.62 + i * 0.055}s`;
                    span.textContent = ch;
                    el.appendChild(span);
                });
            }

            const headerObs = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) entry.target.classList.add('in');
            }, { threshold: 0.2 });
            if (headerRef.current) headerObs.observe(headerRef.current);

            // PARTICLE GENERATION & CARD REVEAL
            const cards = document.querySelectorAll('.founder-card');
            cards.forEach(card => {
                const particlesContainer = card.querySelector('.particles');
                if (particlesContainer) {
                    for (let i = 0; i < 8; i++) {
                        const dot = document.createElement('div');
                        dot.className = 'p-dot';
                        const size = 2 + Math.random() * 3;
                        dot.style.cssText = `
                            left: ${10 + Math.random() * 80}%;
                            bottom: ${Math.random() * 20}%;
                            --dur: ${3 + Math.random() * 3}s;
                            --delay: ${Math.random() * 3}s;
                            width: ${size}px;
                            height: ${size}px;
                        `;
                        particlesContainer.appendChild(dot);
                    }
                }
            });

            const cardObs = new IntersectionObserver(entries => {
                entries.forEach(e => {
                    if (e.isIntersecting) e.target.classList.add('in');
                });
            }, { threshold: 0.1 });
            cards.forEach(c => cardObs.observe(c));

            // Refresh ScrollTrigger after a slight delay to ensure all DOM is ready
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);

            // Cleanup for all observers within ctx
            return () => {
                revObs.disconnect();
                wordObs.disconnect();
                headerObs.disconnect();
                cardObs.disconnect();
                if (ctaObs) ctaObs.disconnect();
                if (draw) gsap.ticker.remove(draw);
            };
        });

        return () => {
            if (swiperInstance) swiperInstance.destroy();
            ctx.revert();
        };
    }, []);

    return (
        <div className="about-us-page-wrapper" ref={containerRef}>
            <Navbar />

            {/* ══ SECTION 1 · HERO ══ */}
            <section id="about-hero" className="aquatic-section">
                <main>
                    <div className="aquatic-content">
                        <span className="r">HOUSE OF BEAUTY & WELLNESS</span>
                        <h1 className="r d1">The Future of Beauty </h1>
                        <hr className="r d2" />
                        <p className="r d3">Nyoraa is a parent company shaping the future of beauty through a curated portfolio of distinctive brands. From clinical skincare to luxury formulations and modern grooming, each brand is engineered with purpose, precision, and identity.</p>
                        {/* <a href="#">download app</a> */}
                    </div>
                    <div className="swiper aquatic-swiper">
                        <div className="swiper-wrapper">
                            <div className="swiper-slide swiper-slide--one" style={{ backgroundImage: 'url(/brands/hueglam.png)', backgroundSize: 'cover' }}>
                                <div>
                                    <h3>HUEGLAM</h3>
                                    <p>Empowering individuals to embrace their unique beauty through innovative skincare and vibrant aesthetics.</p>
                                    <a href="https://hueglam.com/" target="_blank">explore</a>
                                </div>
                            </div>
                            <div className="swiper-slide swiper-slide--two" style={{ backgroundImage: 'url(/brands/wellness.png)', backgroundSize: 'cover' }}>
                                <div>
                                    <h3>WELLNESS</h3>
                                    <p>Holistic rituals designed to restore balance and rejuvenate the mind, body, and spirit.</p>
                                    <a href="#">explore</a>
                                </div>
                            </div>
                            <div className="swiper-slide swiper-slide--three" style={{ backgroundImage: 'url(/brands/home.png)', backgroundSize: 'cover' }}>
                                <div>
                                    <h3>HOME</h3>
                                    <p>Elevating your sanctuary with curated essentials that transform daily spaces into restorative retreats.</p>
                                    <a href="#">explore</a>
                                </div>
                            </div>
                            <div className="swiper-slide swiper-slide--four" style={{ backgroundImage: 'url(/brands/partners.png)', backgroundSize: 'cover' }}>
                                <div>
                                    <h3>PARTNERS</h3>
                                    <p>Strategic collaborations with global innovators to redefine the standards of conscious luxury.</p>
                                    <a href="#">explore</a>
                                </div>
                            </div>
                        </div>
                        <div className="swiper-pagination"></div>
                    </div>

                </main>
            </section>


            <hr className="div" />

            {/* ══ SECTION 2 · VISION & MISSION ══ */}
            <section className="sec-lg sec-alt" id="vision">
                <div className="vision-bg-circle"></div>
                <div className="vision-bg-circle"></div>
                <div className="vision-bg-circle"></div>
                <div className="vision-bg-circle"></div>
                <div className="vision-inner">
                    <div className="sh-eye r" style={{ justifyContent: 'center' }}>Vision &amp; Mission</div>
                    <div className="vision-word-reveal r d1">
                        <span className="vwr-line"><span className="vwr-word">Making</span> <span className="vwr-word d1">Honest</span></span>
                        <span className="vwr-line"><span className="vwr-word d2">Beauty</span> <span className="vwr-word d3">Universal</span></span>
                    </div>
                    <p className="sh-p r d3" style={{ maxWidth: '600px', margin: '0 auto 4rem', textAlign: 'center' }}>Nyoraa aims to become one of India’s most trusted consumer brand houses by building meaningful, long-term relationships with customers. Their mission is to create high-quality brands that earn genuine loyalty through trust, storytelling, community, and consistent value — not just marketing.</p>
                    <div className="page-content r d2">
                        <div className="card">
                            <div className="content">
                                <h3 className="title">Scientific Rigour</h3>
                                <p className="copy">We replace marketing conjecture with clinical evidence. Every ingredient is selected for its molecular efficacy.</p>
                                <button className="btn">Our Methodology</button>
                            </div>
                        </div>
                        <div className="card">
                            <div className="content">
                                <h3 className="title">Full Disclosure</h3>
                                <p className="copy">Transparency is our baseline. We share our concentrations and sources so you never have to guess what's in your bottle.</p>
                                <button className="btn">View Standards</button>
                            </div>
                        </div>
                        <div className="card">
                            <div className="content">
                                <h3 className="title">Universal Reach</h3>
                                <p className="copy">High-performance beauty shouldn't be a luxury. We bring clinical-grade formulations to a global audience.</p>
                                <button className="btn">Our Impact</button>
                            </div>
                        </div>
                        <div className="card">
                            <div className="content">
                                <h3 className="title">Conscious Growth</h3>
                                <p className="copy">We build for the next century, prioritizing renewable sourcing and circular packaging across all our brands.</p>
                                <button className="btn">Sustainability</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="div" />

            {/* ══ SECTION 3 · LEADERSHIP ══ */}
            {/* ══ SECTION 3 · LEADERSHIP ══ */}
            <section className="leadership-wrap" id="leadership">
                <div className="leadership-header" ref={headerRef}>
                    <div className="ls-eyebrow">LEADERSHIP</div>
                    <div className="ls-headline-serif" ref={serifRef}>The People Behind</div>
                    <div className="ls-headline-italic" ref={italicRef}>The Vision</div>
                    <p className="ls-subtext">
                        Our founding team and senior leadership combine scientific expertise, brand-building
                        acumen, and a relentless commitment to honest beauty.
                    </p>
                </div>

                <div className="founder-stage">
                    {/* M Dinesh KUMAR */}
                    <div className="founder-card">
                        <div className="photo-frame" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a1a' }}>
                            <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <div className="photo-overlay"></div>
                            <div className="shimmer-bar"></div>
                            <div className="corner-accent corner-tl"></div>
                            <div className="corner-accent corner-tr"></div>
                            <div className="corner-accent corner-bl"></div>
                            <div className="corner-accent corner-br"></div>
                            <div className="particles"></div>
                        </div>
                        <div className="founder-info">
                            <div className="info-fill"></div>
                            <div className="founder-info-inner">
                                <div className="founder-name">M Dinesh KUMAR</div>
                                <div className="founder-title">Founder &amp; Creative Director</div>
                                <div className="divider-line"></div>
                                <p className="founder-bio">
                                    User Experience Design (UED), UX Research, Brand Design, Brand Marketing, Brand Consulting, Digital Marketing, Web Design, SEO, SEM, Graphic Design.
                                </p>
                                <div className="founder-links">
                                    <a className="link-dot" href="https://www.linkedin.com/in/dineshmux" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" fill="#888" stroke="none" /></svg></a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Meera Kapoor */}
                    {/* <div className="founder-card">
                        <div className="photo-frame">
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374&auto=format&fit=crop" alt="Meera Kapoor" />
                            <div className="photo-overlay"></div>
                            <div className="shimmer-bar"></div>
                            <div className="corner-accent corner-tl"></div>
                            <div className="corner-accent corner-tr"></div>
                            <div className="corner-accent corner-bl"></div>
                            <div className="corner-accent corner-br"></div>
                            <div className="particles"></div>
                        </div>
                        <div className="founder-info">
                            <div className="info-fill"></div>
                            <div className="founder-info-inner">
                                <div className="founder-name">Meera Kapoor</div>
                                <div className="founder-title">Co-Founder &amp; CSO</div>
                                <div className="divider-line"></div>
                                <p className="founder-bio">
                                    PhD in Cosmetic Chemistry. Leads a 60-person team focusing on Green Chemistry and molecular efficacy.
                                </p>
                                <div className="founder-links">
                                    <a className="link-dot" href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" fill="#888" stroke="none" /></svg></a>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </section>

            <hr className="div" />

            {/* ══ SECTION 4 · CTA ══ */}
            <section id="cta3">
                <canvas id="c3" ref={canvasRef}></canvas>
                <div className="cta3-content">
                    <h2 id="h3">Let's Build the Future of <br />Honest Beauty</h2>
                    <p id="p3">Partner with Nyoraa to redefine transparency in skincare.</p>
                    <Link href="/contacts-us">
                        <button className="btn3" id="b3">Get In Touch</button>
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}

