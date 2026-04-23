"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';

export default function ContactUs() {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const formRef = useRef(null);
  const successRef = useRef(null);
  const particlesRef = useRef(null);

  const validate = (formData) => {
    let newErrors = {};
    if (!formData.get('name')) newErrors.name = "A name is required for resonance.";
    const email = formData.get('email');
    if (!email) {
      newErrors.email = "Email is essential for connection.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "This frequency doesn't match an email pattern.";
    }
    if (!formData.get('message')) newErrors.message = "Please share your thoughts with us.";
    return newErrors;
  };

  const createParticles = () => {
    const container = particlesRef.current;
    if (!container) return;
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      container.appendChild(p);
      gsap.set(p, {
        x: '50%',
        y: '50%',
        opacity: Math.random(),
        scale: Math.random() * 2,
        backgroundColor: Math.random() > 0.5 ? '#1325e8' : '#8f10b7'
      });
      gsap.to(p, {
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 600,
        opacity: 0,
        duration: 1.5 + Math.random(),
        ease: "power2.out",
        onComplete: () => p.remove()
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const validationErrors = validate(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // GSAP Out Animation for form
    gsap.to(formRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        setIsSent(true);
        setIsSubmitting(false);
      }
    });
  };

  useEffect(() => {
    if (isSent && successRef.current) {
      createParticles();
      const tl = gsap.timeline();
      tl.fromTo(successRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1, ease: "elastic.out(1, 0.5)" });
      tl.from(".success-char", {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.5");
      tl.to(".success-glow", {
        opacity: 0.6,
        duration: 1.5,
        repeat: -1,
        yoyo: true
      });
    }
  }, [isSent]);

  return (
    <div className="contact-us-page-wrapper">
      <nav>
        <div className="nav-logo">N<span>y</span>oraa</div>
        <ul className="nav-links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about-us">About Us</Link></li>
          <li><Link href="/contacts-us">Contact Us</Link></li>
        </ul>
        <button className="nav-btn">Explore</button>
      </nav>

      <section className="contact_us">
        <div className="container">
          <div className="row">
            <div className="col-md-10 offset-md-1">
              <div className="contact_inner">
                <div className="row">
                  <div className="col-md-10">
                    <div className="contact_form_inner" style={{ position: 'relative', minHeight: '400px' }}>
                      <div className="contact_field">
                        <div className="cinematic-header">
                          <h3>Contact Us</h3>
                          <div className="accent-line"></div>
                        </div>
                        
                        {!isSent ? (
                          <div ref={formRef}>
                            <p className="sub-text">Feel Free to contact us any time. We will get back to you as soon as we can!.</p>
                            <form className="contact_form" onSubmit={handleSubmit} noValidate>
                              <div className="input-wrap">
                                <input 
                                  type="text" 
                                  name="name" 
                                  className={`form-control form-group ${errors.name ? 'is-invalid' : ''}`} 
                                  placeholder="Name" 
                                  onFocus={() => setErrors(prev => ({...prev, name: null}))}
                                />
                                {errors.name && <div className="cinematic-tooltip">{errors.name}</div>}
                              </div>

                              <div className="input-wrap">
                                <input 
                                  type="email" 
                                  name="email" 
                                  className={`form-control form-group ${errors.email ? 'is-invalid' : ''}`} 
                                  placeholder="Email" 
                                  onFocus={() => setErrors(prev => ({...prev, email: null}))}
                                />
                                {errors.email && <div className="cinematic-tooltip">{errors.email}</div>}
                              </div>

                              <div className="input-wrap">
                                <textarea 
                                  name="message" 
                                  className={`form-control form-group ${errors.message ? 'is-invalid' : ''}`} 
                                  placeholder="Message"
                                  onFocus={() => setErrors(prev => ({...prev, message: null}))}
                                ></textarea>
                                {errors.message && <div className="cinematic-tooltip">{errors.message}</div>}
                              </div>

                              <button type="submit" className={`contact_form_submit ${isSubmitting ? 'submitting' : ''}`} disabled={isSubmitting}>
                                {isSubmitting ? 'Transmitting...' : 'Send Message'}
                              </button>
                            </form>
                          </div>
                        ) : (
                          <div className="success-message" ref={successRef}>
                            <div className="particles-container" ref={particlesRef}></div>
                            <div className="success-glow"></div>
                            <h2 className="success-title">
                              {"RESONANCE LOCKED".split("").map((char, i) => (
                                <span key={i} className="success-char">{char === " " ? "\u00A0" : char}</span>
                              ))}
                            </h2>
                            <p>Transmission successful. Our team will sync with you shortly.</p>
                            <button className="reset-btn" onClick={() => setIsSent(false)}>Send Another</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="right_conatct_social_icon d-flex align-items-end">
                      <div className="socil_item_inner d-flex">
                        <li><a href="#"><i className="fab fa-facebook-square"></i></a></li>
                        <li><a href="#"><i className="fab fa-instagram"></i></a></li>
                        <li><a href="#"><i className="fab fa-twitter"></i></a></li>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="contact_info_sec">
                  <h4>Contact Info</h4>
                  <div className="d-flex info_single align-items-center">
                    <i className="fas fa-headset"></i>
                    <span>+91 8639504644</span>
                  </div>
                  <div className="d-flex info_single align-items-center">
                    <i className="fas fa-envelope-open-text"></i>
                    <span>vardhan.thadala23@gmail.com</span>
                  </div>
                  <div className="d-flex info_single align-items-center">
                    <i className="fas fa-map-marked-alt"></i>
                    <span>Hyderabad, Telangana, India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="map_sec">
        <div className="container">
          <div className="row">
            <div className="col-md-10 offset-md-1">
              <div className="map_inner">
                <h4>Find Us on Google Map</h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore quo beatae quasi assumenda, expedita aliquam minima tenetur maiores neque incidunt repellat aut voluptas hic dolorem sequi ab porro, quia error.</p>
                <div className="map_bind">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121812.87198754165!2d78.36973347102641!3d17.412153066367527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1713852700000!5m2!1sen!2sin" 
                    width="100%" 
                    height="450" 
                    frameBorder="0" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    aria-hidden="false" 
                    tabIndex="0"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
