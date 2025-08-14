import React, { lazy, useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import '../css/mappage.css';

import IconButton from '@mui/material/IconButton';


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
import CustomAutocomplete from '../component/autocomplete';
import ProfileButtons from '../component/profilebuttons';
import { useProfile, ProfileProvider} from '../context/context';
import DraggableIcon from '../component/draggableicon';
import NumberedLocationIcon from '../component/numberedLocationPin';
import LocationPin from '../component/LocationPin';
import axios from 'axios';
import { data } from 'react-router';
import { preventDefault } from 'ol/events/Event';



const MapPage = () => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance=useRef<Map|null>(null);
         const[inputValue,setInputValue]=useState<string>('');

    const[isLoggedIn,setIsLoggedIn]=useState(false);
    const[isDropped,setIsDropped]=useState<boolean>(false);
   const[leftSidebarOpen,setLeftSidebarOpen]=useState(true);
   const[rightSidebarOpen,setRightSidebarOpen]=useState(true);
    const [menuOpen,setMenuOpen]=useState<boolean>(false);
   const [droppedIcons, setDroppedIcons] = useState<string[]>([]); // Bırakılan ikonların id'lerini tutar
 const[isGeocodingEnabled,setIsGeocodingEnabled]=useState<boolean>(true);
     const [waypointCount, setWaypointCount] = useState<number>(0);
const [overlays,setOverlays]=useState<Overlay[]>([]);
const [startAdress, setStartAdress]=useState<{name: string ,coordinate:[number,number]|null}>({
      name:'',
      coordinate:null,

});




const [endAdress, setEndAdress]=useState<{name:string ,coordinate:[number,number]|null}>({
  name:'',
  coordinate:null

    
}); // Bitis noktasının adresini tutar<string>('');

const[wayPointAddress,setWayPointAdress]=useState<{name:string[],coordinate:[number,number][]}>({
    name: [],
    coordinate: [],

})

const [isDragging, setIsDragging] = useState<boolean>(false); // Sürükleme durumunu tutar



const addLocationInput=()=>{
    setWaypointCount(waypointCount+1);

}

const geocode=async(id:string,input:string)=>{
    if(!isGeocodingEnabled){
         console.log('Geocoding is disabled, cannot geocode for id:', id);
         return;

    }
    try{
        const overlay= mapInstance.current?.getOverlayById(id);
        if(!overlay){
            console.log('Overlay bulunamadı',id);
        }
        const position=overlay?.getPosition();
        if(!position){
          return console.log('Overlay konumu bulunamadı',id);
        }
       const[lon,lat]=toLonLat(position);
       const response=await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(input));
         if(!response.ok){
           throw new Error('Geokodlama isteği başarısız oldu');

    }
         const data=await response.json();
            console.log(id, 'Geokodlama sonucu:', data[0].lon + ', ' + data[0].lat);
            overlay?.setPosition([data[0].lon,data[0].lat]); 

            
}
    catch(error){
        console.error('Geokodlama sırasında hata oluştu:', error);
    }
    
}




const reverseGeocode=async(overlayId:string)=>{

     try{
           const overlay=mapInstance.current?.getOverlayById(overlayId);
           if(!overlay){
            console.log('Overlay bulunamadı',overlayId);
            
            return;
           }

           const position=overlay?.getPosition();
           if(!position){
            console.log('Overlay konumu bulunamadı',overlayId);
            return;
           }

           
          const [lon, lat] = toLonLat(position); // Overlay konumunu lon,lat formatına çevir
           const response= await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lon=${lon}&lat=${lat}&zoom=18&addressdetails=1`);
           if(!response.ok){
            throw new Error('Ters geokodlama isteği başarısız oldu');
           }
            const data=await response.json();

            console.log(overlayId, 'Ters geokodlama sonucu:', data);
             console.log('Ters geokodlama sonucu:', data.display_name);
             console.log("Ters geokodlama sonucu koordinatlar:", lon,lat);
        
  
            
             
            if(overlayId==='start-icon'){
                setStartAdress(prev=>({...prev,name:data.display_name,coordinate:[lon,lat]})); // Başlangıç adresini güncelle}))
                console.log('Start address updated:', data.display_name);
                  
            }
         if (overlayId.startsWith('waypoint-')) {
    setWayPointAdress(prev => ({
        name: [...prev.name, data.display_name], // Yeni adres ismini ekle
        coordinate: [...prev.coordinate, [data.lon, data.lat]], // Yeni koordinatları ekle
    }));
}
            if(overlayId==='end-icon'){
                 setEndAdress(prev=>({...prev,name:data.display_name,coordinate:[lat,lon] }))
            }
            
    

        }
           
    
     catch(error){

        console.error('Error during reverse geocoding:', error);
     }

}



const handleAddressChangeByDraggingIcon=(id:string)=>{
    const overlay=mapInstance.current?.getOverlayById(id);
    if(!overlay){
        console.log('Overlay bulunamadı:', id);
        return;
    }
    const position=overlay.getPosition();
    if(!position){
        console.log('Overlay konumu bulunamadı:', id);
        return;
    }
    const [lon, lat] = toLonLat(position); // Overlay konumunu lon,lat formatına çevir
    console.log('Overlay position:', lon, lat);

    
   reverseGeocode(id); // Sürüklenen ikonun adresini ters geokodlama ile al
     console.log('Address changed by dragging icon:', id);
     setIsGeocodingEnabled(false);
     setIsDragging(false); // Sürükleme işlemi bittiğinde durumu güncelle


    
  
  
     
    }
     

     const handleAdressChangeWithAutocomplete=(id:string, value:string)=>{
        if(isDragging){
            console.log('Dragging in progress, address change ignored for:', id);
            return;
        }
        if(!value||value.trim()===''){
            console.log('Geçersiz input değeri');
            return;
        }
        console.log('Address changed with autocomplete:', id, value);
        geocode(id, value); // Autocomplete ile adres değişikliği yapıldığında geokodlama işlemi yap
        setIsGeocodingEnabled(true);

     }

     
 const  handleDragStart=(e:React.DragEvent<HTMLDivElement>)=>{
    e.dataTransfer.setData('text/plain', e.currentTarget.id);  //Sürüklenen öğeyi haritaya taşıyacak burada SVG öğesinin id'sini kullanıyoruz
    e.dataTransfer.effectAllowed ='move';
    console.log('Dragging:', e.currentTarget.id); // Konsola sürüklenen öğenin id'sini yazdır
    setIsDragging(true); // Sürükleme başladığında durumu güncelle

}

const toggleleftsidebarmenu=()=>{

    setLeftSidebarOpen(!leftSidebarOpen);




}

//dragover → "Bu kutuya bir şey bırakabilir miyim?" diye sorarsın, preventDefault cevabı "Evet, buraya bırakabilirsin" olur.
//drop → "Bıraktım!" dersin. preventDefault burada da "Tamam, kendi özel bırakma işlemini yapacağım; tarayıcı karışmasın." demektir.
//start → Sürükleme başlarken yapılır, sürüklenen veriyi tanımlar ,UI hazırlığı yapılır

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

    useEffect(() => {
  console.log('Overlays updated:', overlays);
}, [overlays]);
    
//sürükleme işlemi tamamlandığında yapılır, öğe haritaya bırakılır
//Bu işlemde haritaya bırakılan öğe ile ilgili işlemler yapılır, örneğin haritaya yeni bir nokta eklemek gibi
// Uİ da kalıcı değişiklikler yapılır
const dropHandler=(e:React.DragEvent<HTMLDivElement>)=>{
    e.preventDefault(); // Sürüklenen öğenin haritaya bırakılmasına izin vermek için varsayılan davranışı engelle
    const droppedIconId=e.dataTransfer.getData('text/plain'); // Sürüklenen öğenin id'sini al
    console.log('dropped');
    console.log('Dropped:', droppedIconId); // Konsola bırakılan öğenin id'sini yazdır
    setIsDragging(false); // Sürükleme işlemi bittiğinde durumu güncelle
     
   const droppedIconElement=document.getElementById(droppedIconId); // Sürüklenen öğeyi DOM'dan al
      if(droppedIconElement&& mapInstance.current){
       const rect=e.currentTarget.getBoundingClientRect(); // Harita alanının boyutlarını ve pozisyon bilgisini al
       const x=e.clientX-rect.left; //fare tıklama kordinatını al sonra harita alanının sol kenarına göre konumlandır (0,0) 
       const y=e.clientY-rect.top; // fare tıklama kordinatını al sonra harita alanının üst kenarına göre konumlandır (0,0)
       const coordinate=mapInstance.current?.getCoordinateFromPixel([x,y]); // Harita koordinatlarını al
       const latLon=toLonLat(coordinate); // Harita koordinatlarını enlem ve boylam olarak al
       if(!coordinate){
         console.log(coordinate);
         return; // Eğer koordinat alınamazsa çık
       }
       setDroppedIcons(prev=>[...prev, droppedIconId]); // Bırakılan ikonu state'e ekle
           // Sadece bırakılan ikonu devre dışı bırak
           const existingOverlay = mapInstance.current?.getOverlayById(droppedIconId);
      if(existingOverlay){
        
        existingOverlay.setPosition(coordinate); // Eğer overlay zaten varsa, konumunu güncelle
        console.log('Overlay position updated:', toLonLat(coordinate)); // Konsola güncellenen overlay'in konumunu yazdır

        return; // Overlay zaten varsa, yeni overlay ekleme

      

    }
        else{
    const markerContainer=document.createElement('div'); // Bırakılan işaretçi için bir React öğesi oluştuR
      if(droppedIconElement.closest('.left-sidebar')){
         droppedIconElement.setAttribute('draggable', 'false');
    
         droppedIconElement.style.opacity='0.52';

         
      }
    

       const root=createRoot(markerContainer); //  React kökü oluştur ve  dom objesi olan divi  React içerisinde render etmek için kullanılıyor 
 //React bileşenini oluşturulan div içine render et
      if(droppedIconId==='start-icon'){
            
           root.render(<DraggableIcon id="start-icon" Icon={LocationPin} isDraggable={true}  onDragStart={handleDragStart}  onDragEnd={()=>{
            if(isDragging){handleAddressChangeByDraggingIcon('start-icon')}} }/>); // Eğer bırakılan ikon başlangıç ikonu ise LocationPin bileşenini kullan
          
      }
        if(droppedIconId==='end-icon'){
         root.render(<DraggableIcon id={droppedIconId} Icon={LocationPin} isDraggable={true}  />); // Eğer bırakılan ikon bitiş ikonu ise LocationOnIcon bileşenini kullan
            
        }

        if(droppedIconId.startsWith('waypoint-')){             
            root.render(<DraggableIcon id={droppedIconId} Icon={NumberedLocationIcon} isDraggable={true} waypointCount={parseInt(droppedIconId.split('-')[1])+1} isWaypoint={true} />); // Eğer bırakılan ikon bir ara nokta ikonu ise NumberedLocationIcon bileşenini kullan
         
      
        }
     const overlay = new Overlay({
    id: droppedIconId, // Overlay'in id'sini sürüklenen öğenin id'si olarak ayarla
  position: coordinate,
  element: markerContainer,
  stopEvent: false,
});
      

   

     mapInstance.current.addOverlay(overlay); //Overlayi MapRefe eklememizin sebebi  MapRef'in divi göstermesidir mapInstance ise map objesini gösterir 
      setOverlays(prev=>[...prev,overlay]); // Yeni overlay'i state'e ekle
     
        console.log('Overlay added at:', latLon); // Konsola eklenen overlay'in konumunu yazdır

        }
        }
  
          
    }


//kullanıcı fare tuşuna basmayı bıraktığında tetiklenir  öğe hedefe bırakılsada bırakılmasada yine tetiklenir
const dragEndHandler=(e:React.DragEvent<HTMLDivElement>)=>{ 
     if(e.dataTransfer.dropEffect === 'move') { // eğer  drop işlemi başarılı ise
      
        console.log('Drag ended successfully'); // Konsola başarılı sürükleme işlemi mesajı

     }

}

return(<div className="map-page">

<div id="map" style={{ width: '100%', height: '100%' }} ref={mapRef} onDragOver={dragOverHandler} onDrop={dropHandler}>   </div>
 {leftSidebarOpen?(<div className="left-sidebar">
    <div className="left-sidebar-items">
        <ProfileButtons/>
  

<div className="route-inputs">
<div className="start-location-input">

<DraggableIcon id="start-icon" Icon={LocationPin} isDraggable={true} onDragEnd={()=>handleAddressChangeByDraggingIcon('start-icon')} onDragStart={handleDragStart}/>

         
  
      
        <CustomAutocomplete
          inputValue={startAdress.name}
          value={startAdress.name}
          onChange={(id, value) => handleAdressChangeWithAutocomplete(id, value)}
          onInputChange={(_event, value) =>{
              const trimmedValue=value.trim();
              console.log(trimmedValue);
            setInputValue(trimmedValue);
          
            console.log('Input value changed:', value); // Konsola input değeri değiştiğinde yazdır
           } } />
</div>

<div className="waystations-input">
{
    Array.from({length:waypointCount},(_,index)=>{
        const id=`waypoint-${index+1}`
       
        return(
          <div className="waystation-input" key={index+1}>
              <DraggableIcon 
              id={`waypoint-${index}`}
                Icon={NumberedLocationIcon} 
                isDraggable={true}
                waypointCount={index+1}
                isWaypoint={true}  />
              
             <CustomAutocomplete inputValue={inputValue} onInputChange={(event,id:string,input)=>handleAdressChangeWithAutocomplete(id,input)} />

            </div>)
    })} 
    


</div>


<div className="end-location-input">
   <DraggableIcon
        id="end-icon"
        Icon={LocationOnIcon}
        style={{ color: 'white', backgroundColor: 'red' }}
        isDraggable={true}/>
    <CustomAutocomplete/>

</div>
</div>


<div className="waystationbutton-routebutton">

    <IconButton className="add-route-button-icon" onClick={()=>{addLocationInput()}}>
        <AddCircleIcon className="add-route-button-icon-svg" />
        </IconButton>
  <button className="draw-route-button">Rota çiz</button>

</div> 
</div>
</div>



):(<div className="left-sidebar-closed">
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

