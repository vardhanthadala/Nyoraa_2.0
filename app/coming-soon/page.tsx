"use client";
import React from 'react';
import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function ComingSoon() {
  return (
    <div className="coming-soon-page">
      <Navbar />
      <div className="coming-soon-content">
        <div className="coming-soon-svg-wrap" style={{ marginTop: '80px' }}>
          <object
            type="image/svg+xml"
            data="/coming-soon.svg"
            aria-label="Coming Soon Animation"
            className="coming-soon-svg"
          >
            Coming Soon
          </object>
        </div>
        <div className="coming-soon-text">
          {/* <h1>COMING SOON</h1> */}
          {/* <p>We&apos;re building something amazing. Stay tuned.</p> */}
          <Link href="/" className="coming-soon-btn">BACK TO HOME</Link>
        </div>
      </div>

      <style jsx global>{`
        .coming-soon-page {
          background: #FAFAFA;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .coming-soon-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          text-align: center;
        }
        .coming-soon-svg-wrap {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }
        .coming-soon-svg {
          width: 100%;
          height: auto;
          max-height: 55vh;
        }
        .coming-soon-text {
          margin-top: 1.5rem;
        }
        .coming-soon-text h1 {
          font-family: var(--fd, serif);
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 600;
          color: #231F20;
          letter-spacing: 0.15em;
          margin: 0 0 0.75rem;
        }
        .coming-soon-text p {
          font-size: clamp(0.9rem, 2vw, 1.1rem);
          color: #808285;
          margin: 0 0 2rem;
        }
        .coming-soon-btn {
          display: inline-block;
          padding: 0.85rem 2.5rem;
          border: 2px solid #231F20;
          border-radius: 50px;
          color: #231F20;
          text-decoration: none;
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          font-weight: 500;
          transition: all 0.3s;
        }
        .coming-soon-btn:hover {
          background: #231F20;
          color: #fff;
        }
        @media (max-width: 768px) {
          .coming-soon-svg {
            max-height: 40vh;
          }
          .coming-soon-content {
            padding: 1rem;
          }
        }
        @media (max-width: 480px) {
          .coming-soon-svg {
            max-height: 30vh;
          }
        }
      `}</style>
    </div>
  );
}
