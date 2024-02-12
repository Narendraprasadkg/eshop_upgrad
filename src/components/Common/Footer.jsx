import React from 'react';
import Typography from '@material-ui/core/Typography';

const Footer = () => (
  <footer className="footer">
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Typography variant="body2">
        Copyright © <a href="https://www.upgrad.com/" target="_blank" rel="noopener noreferrer">upGrad</a> 2023.
      </Typography>
    </div>
  </footer>
);

export default Footer;
