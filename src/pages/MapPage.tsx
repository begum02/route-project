import React, { createRef, useEffect, useRef } from 'react';
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

import { useState } from 'react';

import Overlay from 'ol/Overlay';
import { toLonLat } from 'ol/proj';
import { createRoot } from 'react-dom/client';
import CustomAutocomplete from '../component/autocomplete';
import ProfileButtons from '../component/profilebuttons';
import { useProfile, ProfileProvider} from '../context/vehicleprofileprovider';
import DraggableIcon from '../component/draggableicon';
import NumberedLocationIcon from '../component/numberedLocationPin';

import axios from 'axios';
import { data } from 'react-router';
import { preventDefault } from 'ol/events/Event';

      import { fromLonLat } from 'ol/proj';
import { useDirections } from '../context/directions';
import Directions from '../component/directions';
import RightSidebar from '../component/drawer';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { v4 as uuidv4 } from 'uuid';
import LocationPin from '../component/locationpin';
import { LineString } from 'ol/geom';
import Feature from 'ol/Feature';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import VectorLayer from 'ol/layer/Vector';      // DOĞRU!
import VectorSource from 'ol/source/Vector';    // DOĞRU!


const MapPage = () => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance=useRef<Map|null>(null);
    const routeLayerRef = useRef<VectorLayer | null>(null);
         const[startinputValue,setStartInputValue]=useState<string>('');
    const[endinputValue,setEndInputValue]=useState<string>('');
    const[waypointInputValues,setWaypointInputValues]=useState<{id:string,value:string}[]>([]);
const [waypoints,setWaypoints] = useState<{id:string,value:string}[]>([]);
    const[isLoggedIn,setIsLoggedIn]=useState(false);
    const[isDropped,setIsDropped]=useState<boolean>(false);
   const[leftSidebarOpen,setLeftSidebarOpen]=useState(true);
   const[rightSidebarOpen,setRightSidebarOpen]=useState(true);
    const [menuOpen,setMenuOpen]=useState<boolean>(false);
   const [droppedIcons, setDroppedIcons] = useState<string[]>([]); // Bırakılan ikonların id'lerini tutar
 const[isGeocodingEnabled,setIsGeocodingEnabled]=useState<boolean>(true);
     const [waypointCount, setWaypointCount] = useState<number>(0);
const [overlays,setOverlays]=useState<Overlay[]>([]);
const[isDragged,setIsDragged]=useState<boolean>(false);

const [isDragging, setIsDragging] = useState<boolean>(false); // Sürükleme durumunu tutar

const{activeButtonMenu,activeButtonSubMenu}=useProfile();
const {
    startAdress,
    setStartAdress,
    endAdress,
    duration,
    setEndAdress,
    wayPointAddresses,
    setWayPointAddresses,
    fetchDirections
} = useDirections();

const addLocationInput=()=>{
    const newId=uuidv4();
    setWaypoints(prev=>[...prev,{id:newId,value:''} ]);
    setWayPointAddresses(prev=>[...prev,{id:newId,name:'', coordinate: [0,0]} ]);
    setWaypointInputValues(prev=>[...prev,{id:newId,value:''} ]);

}
const removeWaypoint = (id: string) => {
  // State'ten waypoint'i kaldır
 
setWaypoints(prev=>prev.filter(wp=>wp.id!==id)); 
  setWayPointAddresses(prev => prev.filter((wp)=> wp.id !== id));
  setWaypointInputValues(prev => prev.filter((wp) => wp.id !== id));

  console.log('Removing waypoint at index:', id);
   setWaypointCount(prev => prev > 0 ? prev - 1 : 0);


 


};
type DirectionsResult = {
  features?: Array<{
    geometry?: {
      coordinates?: number[][];
      type?: string;
    };
  }>;
  // Diğer alanlar...
};

 const  handleDragStart=(e:React.DragEvent<HTMLDivElement>)=>{
    e.dataTransfer.setData('text/plain', e.currentTarget.id);  //Sürüklenen öğeyi haritaya taşıyacak burada SVG öğesinin id'sini kullanıyoruz
    e.dataTransfer.effectAllowed ='move';
    console.log('Dragging:', e.currentTarget.id); // Konsola sürüklenen öğenin id'sini yazdır
    setIsDragging(true); // Sürükleme başladığında durumu güncelle

}
const geocode=async(id:string,input:string)=>{
    if(!isGeocodingEnabled){
         console.log('Geocoding is disabled, cannot geocode for id:', id);
         return;

    }
    try{
       const response=await axios.get(`http://localhost:3000/api/orsgeocode?text=${encodeURIComponent(input)}`);
       if(!response|| response.status!==200){
        console.error('Geocoding request failed for id:', id);   
        return;}
        const data= await response.data;
        console.log(data);

        setWayPointAddresses(prev=> prev.map((val)=> val.id===id?{...val,name:input}:val));
        
             // HATA KONTROLÜ EKLE!
    if (!data || !data.features || !data.features[0].geometry || !data.features[0].geometry.coordinates) {
      console.error('Geokodlama sonucu boş veya eksik:', data);
      return; // Fonksiyonu burada sonlandır
    }
                
    const markerContainer=document.createElement('div');
    const root=createRoot(markerContainer);

        
            console.log('Overlay bulunamadı',id);
                 const overlay = new  Overlay({
                    id:id , // Overlay'in id'sini başlangıç olarak ayarla
                    element: markerContainer, // Overlay'in içeriği olarak oluşturulan div'i kullan
                    position: undefined, // Başlangıçta konum yok
                    stopEvent: false, // Etkinlikleri durdurma
                });
                mapInstance.current?.addOverlay(overlay);
 
            const lon=parseFloat(data.features[0].geometry.coordinates[0]);
            const lat=parseFloat(data.features[0].geometry.coordinates[1]);
          const  position=fromLonLat([lon,lat]);
         overlay.setPosition(position);
          
            console.log(id, 'Geokodlama sonucu:', data);
          

        if(!overlay){
            console.log('Overlay bulunamadı',id);
            return;
        }

   
                    if(id==='start-icon'){
        root.render(<DraggableIcon id={id} Icon={LocationPin} isDraggable={true} onDragEnd={()=>handleAddressChangeByDraggingIcon(id)} onDragStart={handleDragStart}/>);
            
           
                setStartAdress(prev=>({...prev,name:input,coordinate:[lon,lat]}));
                console.log('Start address updated:', input);
            }

            if(id.startsWith('waypoint-')){
                const waypointIndex=wayPointAddresses.findIndex(wp=>wp.id===id);
                const waypointOverlay=mapInstance.current?.getOverlayById(id);
                console.log('Yeni waypoint overlay eklendi:', id, 'Waypoint index:', waypointOverlay);
                console.log( 'Yeni waypoint overlay eklendi:', id);
                root.render(<DraggableIcon id={id} Icon={NumberedLocationIcon} isDraggable={true} waypointCount={waypointIndex+1} isWaypoint={true}  onDragEnd={()=>handleAddressChangeByDraggingIcon(id)} onDragStart={handleDragStart} number={waypointIndex+1}/>);
               console.log('render edildi:', id);
                 setWayPointAddresses(prev => 
  prev.map((val) => val.id === waypointOverlay?.getId() ? { ...val, name: input, coordinate: [lon, lat] } : val)
  );
     setWaypointInputValues(prev =>
      prev.map(val =>
        val.id === id ? { ...val, value: input } : val
      )
    );
  
  // ...
    }
                 
            if(id==='end-icon'){
                root.render(<DraggableIcon id={id} Icon={LocationOnIcon} isDraggable={true} onDragEnd={()=>handleAddressChangeByDraggingIcon(id)} onDragStart={handleDragStart}/>);
                setEndAdress(prev=>({...prev,name:input,coordinate:[lon,lat]}));
                console.log('End address updated:', input);
            }
                    



 

        
 
    
        
             
            console.log(id, 'Geokodlama sonucu:', data);

                setOverlays(prev=>[...prev,overlay]); // Yeni overlay'i state'e ekle
         

                     mapInstance.current?.getView().setCenter(fromLonLat([lon, lat]));
              mapInstance.current?.updateSize();
               if(!position){
                console.log('Geokodlama sonucu konum bulunamadı:', id);
                return;
               }
    
            
             
              console.log('Map view center updated to:', position);
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
           if (!position) {
  console.log('Overlay konumu bulunamadı', overlayId);
  return;
}
const [lon, lat] = toLonLat(position);
if (typeof lon !== 'number' || typeof lat !== 'number' || isNaN(lon) || isNaN(lat)) {
  console.error('Geçersiz koordinatlar:', lon, lat);
  return;
}

    // Artık kendi backend'ine istek atıyorsun!
    const response = await fetch(`http://localhost:3000/api/orsreversegeocode?lon=${lon}&lat=${lat}`);
    if (!response.ok) {
      throw new Error('Ters geokodlama isteği başarısız oldu');
    }
    const data = await response.json();

    console.log(overlayId, 'Ters geokodlama sonucu:', data);
            
  
            
             
            if(overlayId==='start-icon'){
                setStartAdress(prev=>({...prev,name:data.features[0].properties.label,coordinate:data.features[0].geometry.coordinates})); // Başlangıç adresini güncelle}))

                console.log('Start address updated:', data.properties.label);
                

          
                

                  
            }
         if (overlayId.startsWith('waypoint-')) {
         
        
            setWayPointAddresses(prev => prev.map((val) => val.id === overlayId ? { ...val, name: data.features[0].properties.label, coordinate: data.features[0].geometry.coordinates } : val));
                            console.log(`Waypoint ${overlayId } address updated:`, data.features[0].properties.label);
                            // **Burada inputValue'yu da güncelle:**
    setWaypointInputValues(prev =>
      prev.map(val =>
       `waypoint-${val.id}` === overlayId
          ? { ...val, value: data.features[0].properties.label }
          : val
      )
    );

    console.log("waypointInputValues", waypointInputValues);
        }
            if(overlayId==='end-icon'){
                 setEndAdress(prev=>({...prev,name:data.features[0].properties.label,coordinate:data.features[0].geometry.coordinates}))
            }
            
    

        }
           
    
     catch(error){

        console.error('Error during reverse geocoding:', error);
     }

}
 const clearOverlay=(id:string)=>{
    const overlay=mapInstance.current?.getOverlayById(id);
    if(overlay){
   
        

    
                 mapInstance.current?.removeOverlay(overlay);
        setOverlays(prev=>prev.filter(o=>o.getId()!==id)); // State'den overlay'i kaldır

    }
    else{
        console.log('Overlay not found:', id);
    }
 }


const handleAddressChangeByDraggingIcon=(id:string)=>{
    setIsDragged(true);
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
    const [lon, lat] = fromLonLat(position); // Overlay konumunu lon,lat formatına çevir
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
        // Adres değiştikten sonra rotayı güncelle!


        const  leftSidebarIcon=document.getElementById(id);
        if(leftSidebarIcon?.closest('.left-sidebar')){
            leftSidebarIcon.setAttribute('draggable', 'false');
            leftSidebarIcon.style.opacity='0.52'; // Sürüklenebilir ikonun opaklığını azalt
            
        }
        setIsGeocodingEnabled(true);
     

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

useEffect(() => {
  // Koordinatlar değiştiğinde rota çizgisini güncelle
  if (
    startAdress.coordinate &&
    endAdress.coordinate &&
    wayPointAddresses.every(wp => wp.coordinate && wp.name)
  ) {
    fetchDirections({ startAdress, endAdress, wayPointAddresses }).then(result => {
      if (result && result.geometry) {
        drawRouteLine(result.geometry);
      }
    });
  }
}, [startAdress, endAdress, wayPointAddresses, fetchDirections]);
const drawRouteLine = (geometry:[number, number][]) => {
  console.log('Drawing route line with geometry:', geometry);
    if (!mapInstance.current) {
    console.error('Harita instance yok!');
    return;
  }
  

const transformedCoords = geometry.map(coord => fromLonLat([coord[1], coord[0]]));

  const routeLine = new LineString(transformedCoords);

  const routeFeature = new Feature({
    geometry: routeLine,
  });

  routeFeature.setStyle(
    new Style({
      stroke: new Stroke({
        color: '#1976d2',
        width:4,
      }),
    })
  );

  const vectorSource = new VectorSource({
    features: [routeFeature],
  });

  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });
    // Eski rota layer'ı kaldır
  if (routeLayerRef.current) {
    mapInstance.current?.removeLayer(routeLayerRef.current);
  }

  // Yeni rota layer'ı ekle ve ref'e ata
  mapInstance.current?.addLayer(vectorLayer);
  routeLayerRef.current = vectorLayer;
  console.log('Route line drawn with coordinates:', geometry);


 
};
const routebuttonClickHandler = async () => {
  const result = await fetchDirections({ startAdress, endAdress, wayPointAddresses });
  if (
    result &&
 
    result.geometry
  ) {
    drawRouteLine(result.geometry);
  }
};
        useEffect(() => { 
        if (startAdress.name === '') {
         
            setStartInputValue('');  //burada amaç başlangıç adresi boş olduğunda input değerini temizlemek

        }
    }, [startAdress.name]); // Başlangıç adresi değiştiğinde input değerini temizle

    useEffect(() => {
        if (endAdress.name === '') {
            setEndInputValue(''); // Bitiş adresi boş olduğunda input değerini temizle
        }}, [endAdress.name]); // Bitiş adresi değiştiğinde input değerini temizle

  
      



 
        ///sürükleme işlemi tamamlandığında yapılır, öğe haritaya bırakılır
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
            if(isDragging){handleAddressChangeByDraggingIcon('start-icon')}} } />); // Eğer bırakılan ikon başlangıç ikonu ise LocationPin bileşenini kullan
          
      }
        if(droppedIconId==='end-icon'){
         root.render(<DraggableIcon id={droppedIconId} Icon={LocationPin} isDraggable={true} onDragStart={handleDragStart}  onDragEnd={ ()=>{if(isDragging){handleAddressChangeByDraggingIcon('end-icon')}}} />); // Eğer bırakılan ikon bitiş ikonu ise LocationOnIcon bileşenini kullan
            
        }

        if(droppedIconId.startsWith('waypoint-')){             
            const waypointIndex=parseInt(droppedIconId.split('-')[1]); // Waypoint ikonunun indeksini al
            console.log('Waypoint index:', waypointIndex); // Konsola waypoint indeksini yazdır
            root.render(<DraggableIcon id={droppedIconId} Icon={NumberedLocationIcon} isDraggable={true}  onDragStart={handleDragStart}  onDragEnd={ ()=>{if(isDragging){handleAddressChangeByDraggingIcon(droppedIconId)}}}waypointCount={waypointIndex+1} isWaypoint={true}  number={waypointIndex+1}/>); // Eğer bırakılan ikon bir ara nokta ikonu ise NumberedLocationIcon bileşenini kullan
            console.log('Waypoint icon dropped:', droppedIconId); // Konsola bırakılan waypoint ikonunun id'sini yazdır
      
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
            className="start-autocomplete"
            inputValue={isDragged ? (startAdress.name ?? '') : (startinputValue ?? '')}
               onFocus={()=>
               {
                setIsDragged(false);
                if(startAdress.name){
                    setStartInputValue(startAdress.name); // Başlangıç adresi varsa input değerini güncelle
                }
                
                }}
           ref={mapInstance} 
           
                
           onInputChange={(_event,value)=>{
            const trimmedValue = value.trim();
                     if(trimmedValue===''){
                     setIsDragged(false); // Eğer input değeri boşsa sürükleme durumunu false yap
                     setStartAdress({name: '', coordinate: null}); // Eğer input değeri boşsa başlangıç adresini temizle
                
                    clearOverlay('start-icon'); // Overlay'i temizle
                    
                 const leftSidebarIcon=document.getElementById('start-icon');
                 if(leftSidebarIcon?.closest('.left-sidebar')){
                    leftSidebarIcon.setAttribute('draggable', 'true'); // Eğer başlangıç ikonu sol kenar çubuğunda ise sürüklenebilir yap
                    leftSidebarIcon.style.opacity='1'; // Opaklığı 1 yap
                 }
                     

                    

            
            }
            setStartInputValue(trimmedValue);
  
   
           }}
        
          onChange={(id, value) =>{ const correctId="start-icon"; handleAdressChangeWithAutocomplete(correctId, value);   console.log('Input value changed:', value);}}// Konsola input değeri değiştiğinde yazdır
          
          
          
            />
        
</div>

<div className="waystations-input">
{
    waypoints.map((wp,index)=> (
          <div className= "waystation-input" key={wp.id} >
              <DraggableIcon 
              id={`waypoint-${wp.id}`}
                number={index+1}
                Icon={NumberedLocationIcon} 
                isDraggable={true}
                waypointCount={index+1}
                isWaypoint={true}
                onDragStart={handleDragStart}
                onDragEnd={()=>handleAddressChangeByDraggingIcon(`waypoint-${wp.id}`)}

                  />
              
          <CustomAutocomplete className={`waypoint-autocomplete-${wp.id}`} ref={mapInstance}  isGeocodingEnabled={isGeocodingEnabled}  inputValue={(waypointInputValues.find(val=>val.id===wp.id)?.value??'')} 
          onFocus={()=>{setIsDragged(false);  setWaypointInputValues(prev=>prev.map(val=>val.id===wp.id?{...val,value:wayPointAddresses.find(wp=>wp.name)?.name??''}:val) )}}onChange={(_id, value) => {
  setWaypointInputValues(prev =>
    prev.map(val =>
      val.id === wp.id ? { ...val, value } : val
    )
  );
  handleAdressChangeWithAutocomplete(`waypoint-${wp.id}`, value);
}}  onInputChange={(_event,value)=>{ clearOverlay(`waypoint-${wp.id}`);const trimmedValue=value.trim();
          if(trimmedValue===''){
            setIsDragged(false);
          //  clearOverlay(`waypoint-${wp.id}`);

            setWayPointAddresses(prev=>prev.map(val=>val.id===wp.id?{...val,name:''}:val));
            const leftSidebarIcon=document.getElementById(`waypoint-${wp.id}`);
            if(leftSidebarIcon?.closest('.left-sidebar')){
              leftSidebarIcon.setAttribute('draggable', 'true');
              leftSidebarIcon.style.opacity='1';
            }
          }
          setWaypointInputValues(prev =>
  prev.map(val =>
    val.id === wp.id ? { ...val, value: trimmedValue  }: val
  )
);}}/>
            <IconButton  id={wp.id}className={`remove-waypoint-button-${wp.id}`}onClick={()=>{removeWaypoint(wp.id)}}><RemoveCircleIcon/></IconButton>
            </div>
    ))

}
</div>


<div className="end-location-input">
   <DraggableIcon
        id="end-icon"
        Icon={LocationOnIcon}
        style={{ color: 'white', backgroundColor: 'red' }}
        isDraggable={true}
        onDragStart={handleDragStart}
        onDragEnd={()=>handleAddressChangeByDraggingIcon('end-icon')}/>
         <CustomAutocomplete
            className="end-autocomplete"
            inputValue={isDragged?endAdress.name: endinputValue}
               onFocus={()=>
               {
                setIsDragged(false);
                if(endAdress.name){
                    setEndInputValue(endAdress.name); // Başlangıç adresi varsa input değerini güncelle
                }
                
                }}
           ref={mapInstance} 
           
                
           onInputChange={(_event,value)=>{
            const trimmedValue = value.trim();
            if(trimmedValue===''){
                setIsDragged(false); // Eğer input değeri boşsa sürükleme durumunu false yap
                setEndAdress({name: '', coordinate: null});
                clearOverlay('end-icon'); // Overlay'i temizle
                const leftSidebarIcon=document.getElementById('end-icon');
                if(leftSidebarIcon?.closest('.left-sidebar')){
                    leftSidebarIcon.setAttribute('draggable', 'true'); // Eğer bitiş ikonu sol kenar çubuğunda ise sürüklenebilir yap
                    leftSidebarIcon.style.opacity='1'; // Opaklığı 1 yap
                }
            }
            setEndInputValue(trimmedValue);
            console.log('Input value changed:', trimmedValue);
           }}
        
          onChange={(id, value) =>{ handleAdressChangeWithAutocomplete("end-icon", value);   console.log('Input value changed:', value);}} // Konsola input değeri değiştiğinde yazdır
          
          
          
            />


</div>
</div>


<div className="waystationbutton-routebutton">

    <IconButton className="add-route-button-icon" onClick={()=>{addLocationInput()}}>
        <AddCircleIcon className="add-route-button-icon-svg" />
        </IconButton>
  <button className="draw-route-button" onClick={routebuttonClickHandler}>Rota çiz</button>
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
<div className='right-sidebar'>

<RightSidebar/>
</div>
     

    
</div>)

}






export default MapPage;

