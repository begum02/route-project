
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import AccessibleIcon from '@mui/icons-material/Accessible';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useState } from 'react';
import React from 'react';
import '../css/profilbuttons.css';

import  {useProfile }  from '../context/vehicleprofileprovider';



const buttonList=[
    {name:'walk', icon:<DirectionsWalkIcon />, menuitems:['yürüyüş','doğa yürüyüşü']},
    {name:'bike', icon:<PedalBikeIcon />, menuitems:['bisiklet','dağ bisikleti','elektrikli bisiklet','yol bisikleti']},
    {name:'otomobil', icon:<DirectionsCarIcon />},
    {name:'heavy', icon:<LocalShippingIcon />, menuitems:['otobüs','ağır vasıta','tarım aracı','kargo kamyonu','ormancılık kamyonu','yük kamyonu']},
    {name:'tekerlekli sandalye',icon:<AccessibleIcon />},

]



export default function ProfileButtons(){
  const { activeButtonMenu, setActiveButtonMenu, activeButtonSubMenu, setActiveButtonSubMenu } = useProfile();
    const[anchorEl,setAnchorEl]=useState<null | HTMLElement>(null);
  

   

    const isMenuOpen=Boolean(anchorEl);
   const handleClick=(event:React.MouseEvent<HTMLElement>,buttonName:string)=>{
     setAnchorEl(event.currentTarget);
     setActiveButtonMenu(buttonName);
      setActiveButtonSubMenu('');

 

    };

 const handleOptionClick= (Option:string)=>{
        setActiveButtonSubMenu(Option);
           setAnchorEl(null);
 }

 return(
    <div className="profile-icons">
      <div className='profile-buttons'>
       
        {buttonList.map(btn=> (
            <React.Fragment key={btn.name}>
            <IconButton 
            className={`profil-button ${activeButtonMenu===btn.name?'active':''} `}

            onClick={(e)=>handleClick(e,btn.name)}
            >
                {btn.icon}
            </IconButton>
          {btn.menuitems&&
      
        <Menu
            anchorEl={anchorEl}
            open={isMenuOpen&& activeButtonMenu===btn.name}
            onClose={()=>setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' } } >
            {
                btn.menuitems.map(item=>
                    <MenuItem
                        key={item}
                        onClick={()=>handleOptionClick(item)}>{item}</MenuItem>

                )
            }
          

            </Menu>
             
         
        

           }
      

    

        
  
            

        </React.Fragment>

          ))
          
          }
      </div>
     
          
            {activeButtonMenu&&(
              <div className='vehicle-profile'>
              {activeButtonSubMenu?
                <span>{activeButtonSubMenu} </span> :
                ((buttonList.find(btn=>btn.name===activeButtonMenu)?.menuitems))?
                (null):
                <span>{activeButtonMenu} </span>
              }
              </div>
            )}
     
 
        
        </div>
 )

}