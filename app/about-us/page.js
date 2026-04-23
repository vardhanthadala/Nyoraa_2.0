"use client";
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

export default function AboutUs() {
    const containerRef = useRef(null);
    const italicRef = useRef(null);
    const serifRef = useRef(null);
    const canvasRef = useRef(null);
    const headerRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // -- AQUATIC SWIPER INITIALIZATION --
        let swiperInstance;
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

        // GSAP
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
        let ctaFrameId;
        const canvas = canvasRef.current;
        if (canvas) {
            const el = canvas.parentElement;
            const W = el.offsetWidth, H = el.offsetHeight;
            canvas.width = W; canvas.height = H;
            const ctx = canvas.getContext('2d');
            const lines = Array.from({ length: 18 }, (_, i) => ({
                y: (i / 17) * H,
                amp: 8 + Math.random() * 20,
                freq: 0.005 + Math.random() * 0.01,
                phase: Math.random() * Math.PI * 2,
                speed: 0.008 + Math.random() * 0.01
            }));
            let t = 0;
            const draw = () => {
                ctaFrameId = requestAnimationFrame(draw); t += 1;
                ctx.clearRect(0, 0, W, H);
                lines.forEach((l, i) => {
                    ctx.beginPath();
                    ctx.moveTo(0, l.y);
                    for (let x = 0; x <= W; x += 2) {
                        const y = l.y + Math.sin(x * l.freq + t * l.speed + l.phase) * l.amp;
                        ctx.lineTo(x, y);
                    }
                    ctx.strokeStyle = `rgba(184, 146, 74, ${0.05 + i * 0.008})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                });
            };
            draw();

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

        return () => {
            if (swiperInstance) swiperInstance.destroy();
            ScrollTrigger.getAll().forEach(t => t.kill());
            if (ctaFrameId) cancelAnimationFrame(ctaFrameId);
        };
    }, []);

    useEffect(() => {
        // -- HEADER WRAPPING LOGIC --
        if (serifRef.current) {
            const text = serifRef.current.textContent;
            serifRef.current.textContent = "";
            text.split(" ").forEach((word, i) => {
                const mask = document.createElement("span");
                mask.className = "word-mask";
                const inner = document.createElement("span");
                inner.className = "word-inner";
                inner.textContent = word;
                mask.appendChild(inner);
                serifRef.current.appendChild(mask);
                if (i < text.split(" ").length - 1) serifRef.current.appendChild(document.createTextNode(" "));
            });
        }

        if (italicRef.current) {
            const text = italicRef.current.textContent;
            italicRef.current.textContent = "";
            [...text].forEach((ch, i) => {
                if (ch === " ") {
                    italicRef.current.appendChild(document.createTextNode(" "));
                    return;
                }
                const span = document.createElement("span");
                span.className = "char";
                span.style.animationDelay = `${0.62 + i * 0.055}s`;
                span.textContent = ch;
                italicRef.current.appendChild(span);
            });
        }

        // -- INTERSECTION OBSERVERS --
        const headerObs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) entry.target.classList.add('in');
        }, { threshold: 0.2 });
        if (headerRef.current) headerObs.observe(headerRef.current);

        // -- PARTICLE GENERATION --
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

        // Intersection Observer for card entry
        const cardObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) e.target.classList.add('in');
            });
        }, { threshold: 0.1 });
        cards.forEach(c => cardObs.observe(c));

        return () => {
            cardObs.disconnect();
            headerObs.disconnect();
        };
    }, []);

    return (
        <div className="about-us-page-wrapper" ref={containerRef}>
            <nav>
                <div className="nav-logo">N<span>y</span>oraa</div>
                <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <li><Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                    <li><Link href="/about-us" onClick={() => setIsMenuOpen(false)}>About Us</Link></li>
                    <li><Link href="/contacts-us" onClick={() => setIsMenuOpen(false)}>Contact Us</Link></li>
                </ul>
                <button 
                    className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>

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
                            <div className="swiper-slide swiper-slide--one">
                                <div>
                                    <h2>Jellyfish</h2>
                                    <p>Jellyfish and sea jellies are the informal common names given to the medusa-phase of certain gelatinous members of the subphylum Medusozoa, a major part of the phylum Cnidaria.</p>
                                    <a href="https://en.wikipedia.org/wiki/Jellyfish" target="_blank">explore</a>
                                </div>
                            </div>
                            <div className="swiper-slide swiper-slide--two">
                                <div>
                                    <h2>Seahorse</h2>
                                    <p>Seahorses are mainly found in shallow tropical and temperate salt water throughout the world. They live in sheltered areas such as seagrass beds, estuaries, coral reefs, and mangroves.</p>
                                    <a href="https://en.wikipedia.org/wiki/Seahorse" target="_blank">explore</a>
                                </div>
                            </div>
                            <div className="swiper-slide swiper-slide--three">
                                <div>
                                    <h2>octopus</h2>
                                    <p>Octopuses inhabit various regions of the ocean, including coral reefs, pelagic waters, and the seabed; some live in the intertidal zone and others at abyssal depths.</p>
                                    <a href="https://en.wikipedia.org/wiki/Octopus" target="_blank">explore</a>
                                </div>
                            </div>
                            <div className="swiper-slide swiper-slide--four">
                                <div>
                                    <h2>Shark</h2>
                                    <p>Sharks are a group of elasmobranch fish characterized by a cartilaginous skeleton, five to seven gill slits on the sides of the head, and pectoral fins that are not fused to the head.</p>
                                    <a href="https://en.wikipedia.org/wiki/Shark" target="_blank">explore</a>
                                </div>
                            </div>
                            <div className="swiper-slide swiper-slide--five">
                                <div>
                                    <h2>Dolphin</h2>
                                    <p>Dolphins are widespread. Most species prefer the warm waters of the tropic zones, but some, such as the right whale dolphin, prefer colder climates.</p>
                                    <a href="https://en.wikipedia.org/wiki/Dolphin" target="_blank">explore</a>
                                </div>
                            </div>
                        </div>
                        <div className="swiper-pagination"></div>
                    </div>
                    <img src="https://cdn.pixabay.com/photo/2021/11/04/19/39/jellyfish-6769173_960_720.png" alt="" className="bg r" />
                    <img src="https://cdn.pixabay.com/photo/2012/04/13/13/57/scallop-32506_960_720.png" alt="" className="bg2 r" />
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
                        <span className="vwr-line"><span className="vwr-word">Making</span> <span className="vwr-word d1"><em>Honest</em></span></span>
                        <span className="vwr-line"><span className="vwr-word d2">Beauty</span> <span className="vwr-word d3">Universal</span></span>
                    </div>
                    <p className="sh-p r d3" style={{ maxWidth: '600px', margin: '0 auto 4rem', textAlign: 'center' }}>We exist to democratise effective, transparent personal care — where every formulation earns its place through clinical evidence, not marketing spend.</p>
                    <div className="page-content r d2">
                        <div className="card">
                            <div className="content">
                                <h2 className="title">Scientific Rigour</h2>
                                <p className="copy">We replace marketing conjecture with clinical evidence. Every ingredient is selected for its molecular efficacy.</p>
                                <button className="btn">Our Methodology</button>
                            </div>
                        </div>
                        <div className="card">
                            <div className="content">
                                <h2 className="title">Full Disclosure</h2>
                                <p className="copy">Transparency is our baseline. We share our concentrations and sources so you never have to guess what's in your bottle.</p>
                                <button className="btn">View Standards</button>
                            </div>
                        </div>
                        <div className="card">
                            <div className="content">
                                <h2 className="title">Universal Reach</h2>
                                <p className="copy">High-performance beauty shouldn't be a luxury. We bring clinical-grade formulations to a global audience.</p>
                                <button className="btn">Our Impact</button>
                            </div>
                        </div>
                        <div className="card">
                            <div className="content">
                                <h2 className="title">Conscious Growth</h2>
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
                    {/* Dr. Aryan Kapoor */}
                    <div className="founder-card">
                        <div className="photo-frame">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop" alt="Dr. Aryan Kapoor" />
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
                                <div className="founder-name">Dr. Aryan Kapoor</div>
                                <div className="founder-title">Founder &amp; CEO</div>
                                <div className="divider-line"></div>
                                <p className="founder-bio">
                                    MD in Dermatology (AIIMS) &amp; MBA (ISB). Featured in Forbes India and Vogue Business as a pioneer of transparent skincare.
                                </p>
                                <div className="founder-links">
                                    <a className="link-dot" href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" fill="#888" stroke="none" /></svg></a>
                                    <a className="link-dot" href="#" aria-label="Twitter"><svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg></a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Meera Kapoor */}
                    <div className="founder-card">
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
                    </div>
                </div>
            </section>

            <hr className="div" />

            {/* ══ SECTION 4 · CTA ══ */}
            <section id="cta3">
                <canvas id="c3" ref={canvasRef}></canvas>
                <div className="cta3-content">
                    <h2 id="h3">Let's Build the Future of <br /><em>Honest Beauty</em></h2>
                    <p id="p3">Partner with Nyoraa to redefine transparency in skincare.</p>
                    <button className="btn3" id="b3">Get In Touch</button>
                </div>
            </section>

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
                                }}
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
        </div>
    );
}

