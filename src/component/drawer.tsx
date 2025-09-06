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



import Tab from '@mui/material/Tab';
import { TabContext, TabList, TabPanel } from '@mui/lab';



export default function RightSidebar({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

}) {
  const [value, setValue] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // Drawer'ın kapatma fonksiyonu
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className='drawer-container'>
      {/* ToggleButton her zaman görünür */}
      <ToggleButton
        className={open ? 'toggle-button-open' : 'toggle-button-close'}
        value="toggle"
        onClick={open?handleDrawerClose:()=>setOpen(true)} // Hem Drawer'ı kapatır hem onClose'u tetikler
      >
        {open ? <ArrowForwardIosOutlinedIcon /> : <ArrowBackIosOutlinedIcon />}
      </ToggleButton>

      {/* Drawer sadece open true ise görünür */}
      {open && (
        <Drawer
          className='right-drawer'
          anchor="right"
          open={open}
          onClose={handleDrawerClose} // Aynı fonksiyon
        >
          <Box className='drawer-content'>
            <TabContext value={value}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Yol Tarifi" value="1" className='address-description' sx={{ fontWeight: 700, width: 150, height: 20 }} />
                <Tab label="Rota listesi" value="2" className='route-lists' />
              </TabList>
              <TabPanel value="1"><Directions /></TabPanel>
              <TabPanel value="2">Item Two</TabPanel>
            </TabContext>
          </Box>
        </Drawer>
      )}
    </div>
  );
}