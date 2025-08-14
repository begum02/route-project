import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField, { type FilledTextFieldProps, type OutlinedTextFieldProps, type StandardTextFieldProps, type TextFieldVariants } from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { JSX } from 'react/jsx-runtime';
import '../css/autocomplete.css';
import { UNSAFE_mapRouteProperties } from 'react-router';

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
  inputValue: string;


  onInputChange?: (event: React.ChangeEvent<object>, value: string) => void;
 

  
}

export default function CustomAutocomplete( {onInputChange,inputValue,value,onChange}: CustomAutocompleteProps
){
  const[options,setOptions]=useState<LocationOption[]>([]);

  const handleOptionSelect=(event: React.ChangeEvent<object>,selectedOption:LocationOption)=>{
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
    if(inputValue&&inputValue.length>3){ 
      console.log('Input value changed hello:', inputValue);
     
      
      const apiUrl = `https://route-project-backend-jfiml74lr-begum02s-projects.vercel.app/api/autocomplete?query=${encodeURIComponent(inputValue)}`;
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
          freeSolo
          options={options}
             getOptionLabel={(option: LocationOption | string) =>
          typeof option === 'string' ? option : option.properties?.label || ''
        }
       
        
          onInputChange={onInputChange  }
          onChange={(event, value) => handleOptionSelect(event, value as LocationOption)}

          value={options.find(option => option.properties.label === inputValue) ?? null} 
   
           renderInput={(params) => (
  <TextField {...params} className="autocomplete-input" />
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