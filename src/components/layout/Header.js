import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { logout } from '../../services/authService';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useMediaQuery,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ShoppingCart,
  ListAlt,
  Person,
  Logout,
  Login,
  PersonAdd,
  AdminPanelSettings,
  Menu as MenuIcon,
  Close as CloseIcon,
  LocalPizza
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Styled components outside the component
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.common.white,
  boxShadow: theme.shadows[4],
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0, 3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 2),
  },
}));

const LogoLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'inherit',
  '&:hover': {
    color: theme.palette.secondary.main,
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  marginLeft: theme.spacing(1),
}));

const NavLink = styled(Link)(({ theme }) => ({
  margin: theme.spacing(0, 1.5),
  color: theme.palette.common.white,
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: theme.palette.secondary.main,
  },
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(1, 0),
    width: '100%',
    padding: theme.spacing(1, 2),
  },
}));

const AuthButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
  marginLeft: theme.spacing(2),
  padding: theme.spacing(0.75, 2),
  fontWeight: 'bold',
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
    marginTop: theme.spacing(1),
    width: '100%',
  },
}));

const MobileDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    paddingTop: theme.spacing(8),
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
}));

const Header = () => {
  const { user, logout: logoutContext } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = async () => {
    try {
      await logout();
      logoutContext();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderNavLinks = () => {
    const links = [
      { path: '/customer/pizzas', label: 'Pizzas', icon: <LocalPizza /> },
      { path: '/customer/cart', label: 'Cart', icon: <ShoppingCart /> },
      { path: user?.isAdmin ? '/admin/order' : '/customer/orders', label: 'Orders', icon: <ListAlt /> },
      { path: '/customer/profile', label: 'Profile', icon: <Person /> },
    ];

    if (user?.isAdmin) {
      links.unshift({ path: '/admin', label: 'Admin', icon: <AdminPanelSettings /> });
    }

    return links.map((link) => (
      <NavLink key={link.path} to={link.path} onClick={() => setMobileOpen(false)}>
        <Box component="span" mr={1}>
          {link.icon}
        </Box>
        {link.label}
      </NavLink>
    ));
  };

  const renderAuthButtons = () => {
    return user ? (
      <Tooltip title="Logout">
        <AuthButton onClick={handleLogout} startIcon={<Logout />}>
          Logout
        </AuthButton>
      </Tooltip>
    ) : (
      <>
        <NavLink to="/login">
          <Box component="span" mr={1}>
            <Login />
          </Box>
          Login
        </NavLink>
        <AuthButton component={Link} to="/register" startIcon={<PersonAdd />}>
          Register
        </AuthButton>
      </>
    );
  };

  const renderMobileMenu = () => {
    return (
      <MobileDrawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
      >
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}
          position="absolute"
          top={0}
          right={0}
        >
          <IconButton onClick={handleDrawerToggle} color="inherit">
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {renderNavLinks().map((link, index) => (
            <ListItem 
              button 
              key={index} 
              component={Link} 
              to={link.props.to}
              onClick={handleDrawerToggle}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {link.props.children[0]}
              </ListItemIcon>
              <ListItemText primary={link.props.children[1]} />
            </ListItem>
          ))}
          {user ? (
            <ListItem button onClick={handleLogout}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          ) : (
            <>
              <ListItem 
                button 
                component={Link} 
                to="/login"
                onClick={handleDrawerToggle}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>
                  <Login />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem 
                button 
                component={Link} 
                to="/register"
                onClick={handleDrawerToggle}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>
                  <PersonAdd />
                </ListItemIcon>
                <ListItemText primary="Register" />
              </ListItem>
            </>
          )}
        </List>
      </MobileDrawer>
    );
  };

  return (
    <StyledAppBar position="sticky">
      <StyledToolbar>
        <LogoLink to="/">
          <LocalPizza />
          <LogoText>Styles Pizza</LogoText>
        </LogoLink>

        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            {renderMobileMenu()}
          </>
        ) : (
          <Box display="flex" alignItems="center">
            {renderNavLinks()}
            {renderAuthButtons()}
          </Box>
        )}
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Header;