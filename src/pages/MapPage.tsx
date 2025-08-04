import React, { lazy, useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import '../css/mappage.css';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import AccessibleIcon from '@mui/icons-material/Accessible';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import IconButton from '@mui/material/IconButton';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MenuIcon from '@mui/icons-material/Menu';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { listItemSecondaryActionClasses } from '@mui/material/ListItemSecondaryAction';
import Overlay from 'ol/Overlay';
import { toLonLat } from 'ol/proj';
import { createRoot } from 'react-dom/client';

const StyledBadge = styled(Badge)<BadgeProps>(() => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid white`,
    padding: '0 4px',
  },
}));

const MapPage = () => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance=useRef<Map|null>(null);
    const[isLoggedIn,setIsLoggedIn]=useState(false);
   const[leftSidebarOpen,setLeftSidebarOpen]=useState(true);
   const[rightSidebarOpen,setRightSidebarOpen]=useState(true);
    const [menuOpen,setMenuOpen]=useState(false);
    const[activeButtonMenu,setActiveButtonMenu]=useState<string|null>(null);
    
    const walkbuttonRef = useRef<HTMLButtonElement | null>(null);
    const bikeButtonRef = useRef<HTMLButtonElement | null>(null);
   const  accessibleButtonRef = useRef<HTMLButtonElement | null>(null);
   const carButtonRef = useRef<HTMLButtonElement | null>(null);
 const truckButtonRef = useRef<HTMLButtonElement | null>(null);
 const closeButtonRef = useRef<HTMLButtonElement | null>(null);
 const locationInputRef = useRef<HTMLDivElement | null>(null);
 const [waypointCount, setWaypointCount] = useState(0);
const [overlays,setOverlays]=useState<Overlay[]>([]);
const[iconDraggableStates,setIconDraggableStates]=useState({
    start:true,
    end:true,
    waypoints:{} as {[key:number]:boolean}
})

const addLocationInput=()=>{
    setWaypointCount(waypointCount+1);

}
 const menuhandleMouseEnter=()=>{
    setMenuOpen(true);
 }

 const menuhandleMouseLeave=()=>{
    setMenuOpen(false);

 }

const toggleleftsidebarmenu=()=>{

    setLeftSidebarOpen(!leftSidebarOpen);




}

//dragover → "Bu kutuya bir şey bırakabilir miyim?" diye sorarsın, preventDefault cevabı "Evet, buraya bırakabilirsin" olur.
//drop → "Bıraktım!" dersin. preventDefault burada da "Tamam, kendi özel bırakma işlemini yapacağım; tarayıcı karışmasın." demektir.
//start → Sürükleme başlarken yapılır, sürüklenen veriyi tanımlar ,UI hazırlığı yapılır
const  dragStartHandler=(e:React.DragEvent<HTMLDivElement>)=>{
    e.dataTransfer.setData('text/plain', e.currentTarget.id);  //Sürüklenen öğeyi haritaya taşıyacak burada SVG öğesinin id'sini kullanıyoruz
    e.dataTransfer.effectAllowed ='move';
    console.log('Dragging:', e.currentTarget.id); // Konsola sürüklenen öğenin id'sini yazdır

}

//Sürükleme esnasında hedef üzerine gelindiğinde yapılır, UI değişiklikleri yapılabilir ama geçici olarak
const dragOverHandler=(e:React.DragEvent<HTMLDivElement>)=>{
    e.preventDefault(); // Sürüklenen öğenin haritaya bırakılmasına izin vermek için varsayılan davranışı engelle bu drop işlemi için gereklidir
    e.dataTransfer.effectAllowed = 'copy'; // Sürüklenen öğenin kopyalanacağını belirtir


}
//sürükleme işlemi tamamlandığında yapılır, öğe haritaya bırakılır
//Bu işlemde haritaya bırakılan öğe ile ilgili işlemler yapılır, örneğin haritaya yeni bir nokta eklemek gibi
// Uİ da kalıcı değişiklikler yapılır


    useEffect(()=>{
        if(mapRef.current&&!mapInstance.current){

           const map=new Map({
            target:mapRef.current,
            layers:[
                new TileLayer({
                    opacity:1,
                 source : new OSM()
                 
                                   
            
                }),
 ],
  view:new View({
    center:[3379146.0, 4893896.0],
    maxZoom:15,
    zoom:2

  },

)

           })
           mapInstance.current=map;

        }
        return ()=>{
            if(mapInstance.current){ // sayfa değişirse veya component unmount olursa
                mapInstance.current.setTarget(undefined); // Map'in target'ını temizle
                mapInstance.current=null;
            }
        }

    },[]);
    
//sürükleme işlemi tamamlandığında yapılır, öğe haritaya bırakılır
//Bu işlemde haritaya bırakılan öğe ile ilgili işlemler yapılır, örneğin haritaya yeni bir nokta eklemek gibi
// Uİ da kalıcı değişiklikler yapılır
const dropHandler=(e:React.DragEvent<HTMLDivElement>)=>{
    e.preventDefault(); // Sürüklenen öğenin haritaya bırakılmasına izin vermek için varsayılan davranışı engelle
    const droppedIconId=e.dataTransfer.getData('text/plain'); // Sürüklenen öğenin id'sini al
    console.log('dropped');
    console.log('Dropped:', droppedIconId); // Konsola bırakılan öğenin id'sini yazdır

   const droppedIconElement=document.getElementById(droppedIconId); // Sürüklenen öğeyi DOM'dan al
      if(droppedIconElement&& mapInstance.current){
       const rect=e.currentTarget.getBoundingClientRect(); // Harita alanının boyutlarını ve pozisyon bilgisini al
       const x=e.clientX-rect.left; //fare tıklama kordinatını al sonra harita alanının sol kenarına göre konumlandır (0,0) 
       const y=e.clientY-rect.top; // fare tıklama kordinatını al sonra harita alanının üst kenarına göre konumlandır (0,0)
       const coordinate=mapInstance.current?.getCoordinateFromPixel([x,y]); // Harita koordinatlarını al
       const latLon=toLonLat(coordinate); // Harita koordinatlarını enlem ve boylam olarak al
       if(!coordinate) return; // Eğer koordinat alınamazsa çık

       const markerContainer=document.createElement('div'); // Bırakılan işaretçi için bir React öğesi oluştuR
       const root=createRoot(markerContainer); //  React kökü oluştur ve  dom objesi olan divi  React içerisinde render etmek için kullanılıyor 
      root.render(<LocationOnIcon style={{ color: 'red' }}/>);  //React bileşenini oluşturulan div içine render et

    
     const overlay=new Overlay({
        id:droppedIconId,
        position:coordinate,
        element:markerContainer,
        
     })
  

     mapInstance.current.addOverlay(overlay); //Overlayi MapRefe eklememizin sebebi  MapRef'in divi göstermesidir mapInstance ise map objesini gösterir 
      setOverlays(prev=>[...prev,overlay]); // Yeni overlay'i state'e ekle
     
        console.log('Overlay added at:', latLon); // Konsola eklenen overlay'in konumunu yazdır

        
          
    }
  }
//kullanıcı fare tuşuna basmayı bıraktığında tetiklenir  öğe hedefe bırakılsada bırakılmasada yine tetiklenir
const dragEndHandler=(e:React.DragEvent<HTMLDivElement>)=>{ 
     if(e.dataTransfer.dropEffect === 'move') { // eğer  drop işlemi başarılı ise
      
        console.log('Drag ended successfully'); // Konsola başarılı sürükleme işlemi mesajı

     }

}

return(<div className="map-page">
<div id="map" style={{ width: '100%', height: '100%' }} ref={mapRef} onDragOver={dragOverHandler} onDrop={dropHandler} >   </div>
 {leftSidebarOpen?(<div className="left-sidebar">
    <div className="left-sidebar-items">
    <div className="profile-icons">
           <IconButton className="profil-button" ref={walkbuttonRef}>
            <DirectionsWalkIcon className="profil-button-icon" />
            </IconButton>

        <IconButton className="profil-button" ref={bikeButtonRef}>
            <PedalBikeIcon  className="profil-button-icon" />
        </IconButton>
    

    
        <IconButton className="profil-button" ref={accessibleButtonRef}>
            <AccessibleIcon className="profil-button-icon" />
        </IconButton>
     <IconButton className="profil-button" ref={carButtonRef}>
            <DirectionsCarIcon className="profil-button-icon"  />
        </IconButton>
    <IconButton className="profil-button" ref={truckButtonRef}>
            <LocalShippingIcon className="profil-button-icon" />
        </IconButton>
            
    <IconButton className="cancel-button" onClick={()=>{toggleleftsidebarmenu()}}>
            <CloseIcon className="cancel-button-icon"  />
        </IconButton>

</div>

<div className="route-inputs">
<div className="start-location-input">
         
      <div className="start-location-input-icon"  onDragStart={dragStartHandler} id="start-location-icon" style={{backgroundColor:'black'}}>
        <LocationOnIcon className="location-input-icon-svg" />
        </div>
       
        <input type="text" className="location-input-field" placeholder="Konum girin..." />
</div>

<div className="waystations-input">
{
    Array.from({length:waypointCount},(_,index)=>(
         
          <div className="waystation-input"
          key={index}>
               <div className='waystation-input-icon'  onDragStart={dragStartHandler} id={`waystation-icon-${index}`} style={{backgroundColor:'black'}}>
              <Badge badgeContent={4} color="primary">
        <LocationOnIcon />
      </Badge>
            </div>
            
            <input type="text" className="location-input-field" placeholder="Konum girin..." />

            </div>
    )
    )

}
</div>


<div className="end-location-input">
      <div className="end-location-input-icon"  onDragStart={dragStartHandler}   id="end-location-icon" style={{backgroundColor:'black'}}> 
        <LocationOnIcon 
      />
</div>
        <input type="text" className="location-input-field" placeholder="Konum girin..." />
</div>
</div>
<div className="waystationbutton-routebutton">

    <IconButton className="add-route-button-icon" onClick={()=>{addLocationInput()}}>
        <AddCircleIcon className="add-route-button-icon-svg" />
        </IconButton>
  <button className="draw-route-button">Rota çiz</button>
</div>

</div>
 



</div>):(<div className="left-sidebar-closed">
    <IconButton className="menu-button" onClick={()=>{
    toggleleftsidebarmenu();}}>
        <MenuIcon className="menu-button-icon" />
</IconButton>


</div>)}
{isLoggedIn?(<div className='user-profile'> </div>):(<div className="login-button-container"><button className="login-button">Oturum aç</button> </div>)
    }
{rightSidebarOpen?(<div className='right-sidebar'>
    <div className='right-sidebar-
    items'>
        <div className='adress-descirption-buttonandroute-list-button'>
            <button className="address-description-button">Yol tarifi</button>
            <button className='route-list-button'>Rota listesi</button>
            </div>
        
     
</div>
     </div>):(<div className='right-sidebar-closed'>

    </div>
    )
 }

    
    </div>)

}







export default MapPage;