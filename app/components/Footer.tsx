"use client";

import React, { memo } from "react";

const Footer = memo(() => {
  return (
    <footer>
      <div className="footer-wrap">
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
              <div className="ft-brand">
                N<span>y</span>oraa
              </div>
              <p>©2026 Nyoraa House of Beauty. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
