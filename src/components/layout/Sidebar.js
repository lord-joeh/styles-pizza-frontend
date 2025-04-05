import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  useMediaQuery,
  Box
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import {
  Dashboard,
  ShoppingCart,
  ListAlt,
  Fastfood,
  Menu as MenuIcon,
  Close as CloseIcon,
  LocalPizza,
} from '@mui/icons-material';

// Styled components outside the component
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 240,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 240,
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const MobileDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 240,
    backgroundColor: theme.palette.background.paper,
  },
}));

const SidebarItem = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const Sidebar = ({ isAdmin }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    {
      path: isAdmin ? '/admin' : '/customer',
      label: 'Dashboard',
      icon: <Dashboard />,
    },
    ...(isAdmin
      ? [
          {
            path: '/admin/pizzas',
            label: 'Pizza Management',
            icon: <LocalPizza />,
          },
          {
            path: '/admin/orders',
            label: 'Order Management',
            icon: <ListAlt />,
          },
          {
            path: '/admin/ingredients',
            label: 'Ingredient Management',
            icon: <Fastfood />,
          },
        ]
      : [
          {
            path: '/customer/cart',
            label: 'Cart',
            icon: <ShoppingCart />,
          },
          {
            path: '/customer/orders',
            label: 'Order History',
            icon: <ListAlt />,
          },
        ]),
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderMenuItems = () => (
    <List>
      {menuItems.map((item) => (
        <SidebarItem
          button
          key={item.path}
          component={Link}
          to={item.path}
          onClick={() => isMobile && setMobileOpen(false)}
        >
          <ListItemIcon sx={{ color: 'text.primary' }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.label} />
        </SidebarItem>
      ))}
    </List>
  );

  if (isMobile) {
    return (
      <>
        <IconButton
          color="inherit"
          aria-label="open menu"
          onClick={handleDrawerToggle}
          edge="start"
          sx={{ ml: 1 }}
        >
          <MenuIcon />
        </IconButton>
        <MobileDrawer
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better performance on mobile
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
            <IconButton onClick={handleDrawerToggle} size="large">
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          {renderMenuItems()}
        </MobileDrawer>
      </>
    );
  }

  return (
    <StyledDrawer variant="permanent" open>
      {renderMenuItems()}
    </StyledDrawer>
  );
};

export default Sidebar;