
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useState } from 'react'
import NumberedLocationIcon from './numberedLocationPin';
import LocationPin from './locationpin';
interface DraggableIconProps{
    id:string,
    number?:number;
  
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
    { id, Icon, className,isDraggable, waypointCount, isWaypoint,onDragEnd,onDragStart,number}: DraggableIconProps
) 


  
{

 
      console.log("DraggableIcon rendered with id:", id, "isWaypoint:", isWaypoint, "number:", number);

return (
    <div id={id} className={className}  draggable={isDraggable} onDragStart={onDragStart}  onDragEnd={onDragEnd} >

     { isWaypoint? (<NumberedLocationIcon number={number||0}   />)
         :(id==="start-icon"?<LocationPin color={'#99231A'}/>:<LocationPin color={'#539E32'}/>) }
 
     
    </div>
)
}