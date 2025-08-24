
import { useDirections } from "../context/directions";
import TurnLeftIcon from '@mui/icons-material/TurnLeft';
import TurnRightIcon from '@mui/icons-material/TurnRight';
import TurnSharpLeftIcon from '@mui/icons-material/TurnSharpLeft';
import TurnSharpRightIcon from '@mui/icons-material/TurnSharpRight';
import TurnSlightLeftIcon from '@mui/icons-material/TurnSlightLeft';
import TurnSlightRightIcon from '@mui/icons-material/TurnSlightRight';
import StraightIcon from '@mui/icons-material/Straight';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import FlagIcon from '@mui/icons-material/Flag';
import DirectionsIcon from '@mui/icons-material/Directions';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import '../css/directions.css';

function getStepIcon(type: number) {
switch(type){
    case 0:return <TurnLeftIcon />; //sola dön
    case 1: return <TurnRightIcon />; //sağa dön
    case 2:return <TurnSharpLeftIcon />; //keskin sola dön
    case 3: return <TurnSharpRightIcon />; //keskin sağa dön
    case 4: return <TurnSlightLeftIcon />; //hafif sola dön
    case 5: return <TurnSlightRightIcon />; //hafif sağa dön
    case 6: return <StraightIcon />; //dikey
    case 7: return <RotateRightIcon />; //sağa dön
    case 8: return <RotateLeftIcon />; //sola dön

    case 9: return <TurnRightIcon />;; //flag
    case 10: return <FlagIcon />; //varış
    case 11: return <LocationOnIcon />; 
    case 12: return <WestIcon />; //west
    case 13: return <EastIcon />; //east
    default: return null;
}
}
export default function Directions(){
    const{steps,distance,duration}= useDirections();
    
 
    if(!steps || steps.length===0){
       return;
    }

    console.log("Steps:", steps);
  


     
    return (
        <div className="directions-content" style={{color:'black'}}>
            <h2 className="total-distance">{distance} </h2>
            <h3 className="total-duration">{duration}</h3>
            <div className="directions-list">

           {steps.map((step,index)=>
            <div key={index} className="direction-step">
         
            <span className="step-icon">{getStepIcon(step.type)}</span>
                <p className="step-instruction">{step.instruction}</p>
                  <div className="distance-duration-container">
                <span className="step-distance">{step.distance}</span>
                <span className="step-duration">{step.duration}</span>
                </div>
                
            </div>
           )

           }


            
        </div>
        </div>
    )
}