import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField, { type FilledTextFieldProps, type OutlinedTextFieldProps, type StandardTextFieldProps, type TextFieldVariants } from '@mui/material/TextField';
import { forwardRef, useEffect, useState } from 'react';
import axios from 'axios';
import type { JSX } from 'react/jsx-runtime';
import '../css/autocomplete.css';
import { UNSAFE_mapRouteProperties } from 'react-router';
import Map from 'ol/Map'; // Bu satırı ekle

interface LocationOption{
  properties: {
    label: string;
    id? : string;


  }

}


interface CustomAutocompleteProps{
  value?:string;
  id?:string;
  onChange?:(id:string,value:string)=>void;
  disabled?:boolean;
  inputValue:{id:string,value:string}|string;
  onFocus?: () => void;
  ref?:React.RefObject<Map | null>;
 className?:string;
 isGeocodingEnabled?: boolean|undefined; // Yeni prop ekle
setIsGeocodingEnabled?: ((enabled: boolean) => void) | undefined;

  onInputChange?: (event: React.ChangeEvent<object>, value: string) => void;
 

  
}

const CustomAutocomplete=forwardRef<Map|null,CustomAutocompleteProps>(({className,isGeocodingEnabled,setIsGeocodingEnabled, onInputChange,inputValue,value,onChange,onFocus},ref)=>{
  const[options,setOptions]=useState<LocationOption[]>([]);
    const inputVal = typeof inputValue === 'object' && inputValue !== null ? inputValue.value : inputValue;
 const removeOverlay=(id:string)=>{
   if(ref&&'current' in ref && ref.current){
    const overlay=ref.current.getOverlayById(id);
    if(overlay){
      ref.current.removeOverlay(overlay);
      console.log('Overlay removed:', id);
    }
    else{
      console.log('Overlay not found:', id);
    }
    if(isGeocodingEnabled === false && typeof setIsGeocodingEnabled === 'function'){
      setIsGeocodingEnabled(true);
    }
   }
 }

  const handleOptionSelect=(event: React.ChangeEvent<object>,id:string,selectedOption:LocationOption)=>{
    if(!selectedOption){
      console.log('No option selected');
      return;
    }
    
    if(selectedOption.properties?.id&&selectedOption.properties?.label){
      const id = selectedOption.properties.id;
      const label = selectedOption.properties.label;
      console.log('Selected option:', selectedOption,'ID:', id, 'Label:', label);
      if(onChange){
        onChange(id,label);
        return label;
      }
    }
  }



  useEffect(()=>{
       console.log("hello");
     

    if(inputVal&&inputVal.length>3){ 
      console.log('Input value changed hello:', inputValue);
     
      
      const apiUrl = `https://route-project-backend-2o08hk5ti-begum02s-projects.vercel.app/api/autocomplete?query=${encodeURIComponent(inputValue)}`;
      console.log('Fetching data from:', apiUrl);

      axios.get(apiUrl)
      .then((response) => {
        const data=response.data;
        console.log("çekilen veri:", data);
      
          const fetchedOptions=data.features.map((feature:LocationOption)=>({
            properties: {
              label: feature?.properties.label || '',
              id: feature?.properties.id || ''
            }
      
          }))
          console.log('Fetched options:', fetchedOptions);
         if(fetchedOptions.length === 0) {
            console.log('No options found for the input value:', inputValue);
          }
          setOptions(fetchedOptions);
          console.log('options updated:', options);
         
        
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setOptions([]);
      });
    }
  }, [inputValue]);



    return(
        <div className="autocomplete">
        <Autocomplete
          id="location-autocomplete"

          className={className}
         freeSolo
          options={options??[]}
             getOptionLabel={(option: LocationOption | string) =>
          typeof option === 'string' ? option : option.properties?.label || ''
        }
     
        
          onFocus={onFocus} 
          onChange={(event,newValue)=>{
            if(newValue && typeof newValue === 'object' && newValue.properties.id){
               if(onInputChange){
                onInputChange(event, newValue.properties.label);
               }
               if(className==='start-autocomplete'){
                  removeOverlay('start-icon');
               }
             if(className==='end-autocomplete'){
                removeOverlay('end-icon');
              }

         if(className?.startsWith('waypoint-autocomplete-')){
                const waypointIndex = parseInt(className.split('-')[2]);
          removeOverlay(`waypoint-${waypointIndex}`);
                

            }
          }
            if(!newValue){
              console.log('No option selected');
              
              if(onInputChange){
                onInputChange(event, '');
              

              }
                         if(className==='start-autocomplete'){
                  removeOverlay('start-icon');
               }
             if(className==='end-autocomplete'){
                removeOverlay('end-icon');
              }

         if(className?.startsWith('waypoint-autocomplete-')){
                const waypointIndex = parseInt(className.split('-')[2]);
          removeOverlay(`waypoint-${waypointIndex}`);
                

            }
              return;
            }
          if(typeof newValue === 'string'){
            if(onChange){
              onChange(className||'unknown',newValue);}
          
          }
          else{
            
            const label = newValue.properties?.label|| '';
            const id = newValue.properties?.id||className||'unknown';
            console.log('Selected option:', newValue,'ID:', id, 'Label:', label);
            if(onChange){
              onChange(id,label);
          
               }
            }
          }

}
         onInputChange={onInputChange
          
         }
           value={options.find(option => option.properties.label === inputVal) ?? null} 
          inputValue={inputVal??''}
           renderInput={(params) => (
  <TextField {...params} className="autocomplete-input" type='search'
  onKeyDown={(e)=>{
    if(e.key==='Backspace'){ // SORUN: inputValue değeri kontrol ediliyor
           if(className==='start-autocomplete'){
      
         removeOverlay('start-icon');
         const leftSidebarIcon: HTMLElement | null = document.getElementById('start-icon');

           if (leftSidebarIcon) {
             leftSidebarIcon.setAttribute('draggable', 'true');
             leftSidebarIcon.style.opacity = '1';
           }
         
         


    }
    else if(className==='end-autocomplete'){
      removeOverlay('end-icon');
      const leftSidebarIcon: HTMLElement | null = document.getElementById('end-icon');
      if (leftSidebarIcon) {
        leftSidebarIcon.setAttribute('draggable', 'true');
        leftSidebarIcon.style.opacity = '1';
      }
    }
    else if(className?.startsWith('waypoint-autocomplete-')){

      const wayPointIndex=parseInt(className.split('-')[2]);
          removeOverlay(`waypoint-${wayPointIndex}`);
      console.log('Waypoint index:', wayPointIndex);


      const leftSidebarIcon:HTMLElement|null=document.getElementById(`waypoint-${wayPointIndex}`);
      if(leftSidebarIcon){
        leftSidebarIcon.setAttribute('draggable', 'true');
        leftSidebarIcon.style.opacity = '1';
      }
    }

   
  }

}
  }


  />
)}
          sx={{ width: 224, height: 28 }}
          slotProps={{
            listbox: {
              style: {
                maxHeight: 100, // Maksimum yükseklik
                overflow: 'auto', // Taşma durumunda kaydırma çubuğu ekle
              },
            },
          }}
        />

            </div>
    )
}
)
export default CustomAutocomplete;