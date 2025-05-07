import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

// Styled components outside the component
const StyledFooter = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.common.white,
  padding: theme.spacing(4),
  textAlign: 'center',
  marginTop: 'auto', // Pushes footer to bottom
}));

const FooterContent = styled(Box)(({ theme }) => ({
  maxWidth: 1200,
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));

const FooterSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.common.white,
  marginBottom: theme.spacing(1),
  '&:hover': {
    color: theme.palette.secondary.main,
    textDecoration: 'none',
  },
}));

const SocialIcons = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const CopyrightText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(4),
  fontSize: '0.8rem',
  opacity: 0.8,
}));

const Footer = () => {
  return (
    <StyledFooter component="footer">
      <FooterContent>
        <FooterSection>
          <Typography variant="h6" gutterBottom>
            Quick Links
          </Typography>
          <FooterLink href="/customer/pizzas" underline="none">
            Menu
          </FooterLink>
          <FooterLink href="/about" underline="none">
            About Us
          </FooterLink>
          <FooterLink href="/contact" underline="none">
            Contact
          </FooterLink>
        </FooterSection>

        <FooterSection>
          <Typography variant="h6" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body2">
            Accra, Ghana
          </Typography>
          <Typography variant="body2">
            Accra
          </Typography>
          <Typography variant="body2">
            (025) 626-9405
          </Typography>
        </FooterSection>

        <FooterSection>
          <Typography variant="h6" gutterBottom>
            Follow Us
          </Typography>
          <SocialIcons>
            <IconButton aria-label="Facebook" color="inherit">
              <Facebook />
            </IconButton>
            <IconButton aria-label="Twitter" color="inherit">
              <Twitter />
            </IconButton>
            <IconButton aria-label="Instagram" color="inherit">
              <Instagram />
            </IconButton>
            <IconButton aria-label="LinkedIn" color="inherit">
              <LinkedIn />
            </IconButton>
          </SocialIcons>
        </FooterSection>
      </FooterContent>

      <CopyrightText variant="body2">
        &copy; {new Date().getFullYear()} Styles Pizza. All rights reserved.
      </CopyrightText>
    </StyledFooter>
  );
};

export default Footer;