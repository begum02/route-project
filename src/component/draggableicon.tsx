
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useState } from 'react'
import NumberedLocationIcon from './numberedLocationPin';
import LocationPin from './locationpin';
interface DraggableIconProps{
    id:string,
  
    Icon: React.ElementType, // Icon component type
    className?: string,
    style?: React.CSSProperties,
    waypointCount?: number,
    isWaypoint?:boolean,
    isDraggable?: boolean;
    onDragEnd?: () => void;
    onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;

  




}







export default function DraggableIcon(
    { id, Icon, className,isDraggable, waypointCount, isWaypoint,onDragEnd,onDragStart}: DraggableIconProps
) 

  
{

 
      

return (
    <div id={id} className={className}  draggable={isDraggable} onDragStart={onDragStart}  onDragEnd={onDragEnd} >

     { isWaypoint? (<NumberedLocationIcon waypointCount={waypointCount||0}   />)
         :(id==="start-icon"?<LocationPin color={'#99231A'}/>:<LocationPin color={'#539E32'}/>) }
 
     
    </div>
)
}