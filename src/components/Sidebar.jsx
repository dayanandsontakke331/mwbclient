import { Drawer, List, ListItem, ListItemButton, ListItemText, IconButton, Tooltip } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import JobPreferences from '../pages/Preferences/JobPreferences';


const Sidebar = ({ mobileOpen, handleDrawerToggle, isMobile, collapsed }) => {
    const { user } = useAuth()
    console.log("sdfghjk", user)
    const location = useLocation();
    const drawerWidth = collapsed ? 64 : 240;
    const navItems = [
     
        { label: 'Test', icon: <DashboardIcon />, path: '/', allowedTo: ['recruiter', 'jobseeker', 'admin'] },
        { label: 'Dashboard', icon: <DashboardIcon />, path: '/', allowedTo: ['recruiter', 'jobseeker', 'admin'] },

    
        { label: 'Job Seekers', icon: <PeopleIcon />, path: '/JobSeekers', allowedTo: ['recruiter', 'admin'] },
        { label: 'Post Job', icon: <WorkIcon />, path: '/postjob', allowedTo: ['recruiter', 'admin'] },
        { label: 'All Jobs', icon: <WorkIcon />, path: '/AllJobs', allowedTo: ['recruiter', 'admin'] },
        { label: 'Job Applications', icon: <AssignmentIcon />, path: '/jobapplications', allowedTo: ['recruiter', 'admin'] },

    
        { label: 'Jobs', icon: <WorkIcon />, path: '/jobs', allowedTo: ['jobseeker'] },
        { label: 'My Applications', icon: <WorkIcon />, path: '/myApplications', allowedTo: ['jobseeker'] },

        { label: 'Profile', icon: <AccountCircleIcon />, path: '/profile', allowedTo: ['recruiter', 'jobseeker', 'admin'] },
        { label: 'Settings', icon: <SettingsIcon />, path: '/settings', allowedTo: ['recruiter', 'jobseeker', 'admin'] },
    ];


    const allowedNavs = navItems.filter(item => !item.allowedTo || item.allowedTo.includes(user.role));

    const drawer = (
        <div>
            <List>
                {allowedNavs.map((item) => {
                    const isSelected = location.pathname === item.path;

                    return (
                        <ListItem key={item.label} disablePadding sx={{ display: 'block' }}>
                            <Tooltip title={collapsed ? item.label : ''} placement="right">
                                <ListItemButton
                                    component={Link}
                                    to={item.path}
                                    onClick={handleDrawerToggle}
                                    selected={isSelected}
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: collapsed ? 'center' : 'flex-start',
                                        px: 2.5,
                                    }}
                                >
                                    <item.icon.type sx={{ mr: collapsed ? 0 : 2 }} />
                                    {!collapsed && <ListItemText primary={item.label} />}
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    );
                })}
            </List>

        </div>
    );

    return isMobile ? (
        <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { width: drawerWidth },
            }}
        >
            {drawer}
        </Drawer>
    ) : (
        <Drawer
            variant="permanent"
            sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    transition: 'width 0.3s',
                    overflowX: 'hidden',
                    boxSizing: 'border-box',
                },
            }}
            open
        >
            {drawer}
        </Drawer>
    );
};

export default Sidebar;