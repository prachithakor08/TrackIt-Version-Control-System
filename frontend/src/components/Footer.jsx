import React from 'react';
import './footer.css';

export default function Footer() {
  return (
    <footer>
      <div className='footerMainContainer'>
        
        {/* Row 1: About links */}
        <div className='footerRow'>
          <a href="/about">About Us</a>
          <a href="/terms">Terms and Conditions</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/contact">Contact Us</a>
          <a href="/guide">User Guide</a>
        </div>

        {/* Row 2: Socials */}
        <div className='footerRow socials'>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <i className="fa-brands fa-instagram"></i> 
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            <i className="fa-brands fa-linkedin"></i> 
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <i className="fa-brands fa-facebook"></i> 
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer">
            <i className="fa-brands fa-youtube"></i> 
          </a>
        </div>

        {/* Row 3: Copyright */}
        <div className='copyright'>
          © 2025 TrackIt | All Rights Reserved
        </div>

      </div>
    </footer>
  );
}
