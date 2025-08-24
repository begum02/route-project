import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import Directions from './directions';
import '../css/drawer.css';
import ToggleButton from '@mui/material/ToggleButton';

 

export default function EmptyRightSidebar() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <div className='drawer-container'>
    <ToggleButton 
      className={open ? 'toggle-button-open' : 'toggle-button-close'}
      value="toggle"
      onClick={toggleDrawer(!open)}
    >
      {open ? <ArrowForwardIosOutlinedIcon/> : <ArrowBackIosOutlinedIcon />}
    </ToggleButton>


      <Drawer
        className='right-drawer'
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
      >
        <Box className='drawer-content'><Directions /></Box>
      </Drawer>
    </div>
  );
}