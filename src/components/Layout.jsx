import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const drawerWidth = 240;

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: 'flex' }}>
      <Header
        handleDrawerToggle={handleDrawerToggle}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        isMobile={isMobile}
        collapsed={collapsed}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          overflowX: 'hidden',
          width: {
            xs: '100%',
            sm: `calc(100% - ${collapsed ? 64 : drawerWidth}px)`
          },
          ml: isMobile ? 0 : `${collapsed ? 64 : drawerWidth}px`,
          transition: 'margin-left 0.3s',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
