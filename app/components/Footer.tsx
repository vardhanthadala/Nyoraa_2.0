import Image from "next/image";
import React, { memo } from "react";

const Footer = memo(() => {
  return (
    <footer>
      <div className="footer-wrap">
        <div className="footer-content">
          <div className="footer-links">
            <div className="footer-col">
              <b>Eldew Rituals</b>
              <a href="/#brands">Face Care</a>
              <a href="/#brands">Serums</a>
              <a href="/#brands">Cleansers</a>
              <a href="/#brands">Moisturizers</a>
            </div>
            <div className="footer-col">
              <b>Brand Spotlight</b>
              <a href="https://hueglam.com/" target="_blank" rel="noopener noreferrer">HUEGLAM</a>
              <a href="/coming-soon">Wellness (Soon)</a>
              <a href="/coming-soon">Home (Soon)</a>
              <a href="/coming-soon">Partner Brands</a>
            </div>
            {/* <div className="footer-col">
              <b>Connect</b>
              <a href="#"> Instagram</a>
              <a href="#">LinkedIn</a>
              <a href="#"> Twitter</a>
              <a href="/contacts-us">Contact Us</a>
            </div> */}
            <div className="footer-col">
              <b>Corporate</b>
              <a href="/about-us">About Nyoraa</a>
              <a href="/coming-soon">Careers</a>
              <a style={{ cursor: 'default' }}>Investors</a>
              <a href="/contacts-us">Contact</a>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="ft-brand-wrap">
              <div className="ft-brand" style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <Image src="/logo.png" alt="Nyoraa Logo" width={220} height={55} style={{ objectFit: 'contain' }} />
              </div>
              <p>©2026 Nyoraa Consumers Pvt Ltd. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
