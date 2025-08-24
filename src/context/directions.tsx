import React,{ createContext,useContext, useState} from "react";

import axios from "axios";
import { useProfile } from "./vehicleprofileprovider";

interface Step{
    instruction:string;
    distance:number;
    duration:number;
    type:number;

}

 export interface DirectionsContextType{

    steps: Step[];
    duration: string;
    distance: string;
    startAdress: { name: string; coordinate: [number, number] | null };
    setStartAdress: React.Dispatch<React.SetStateAction<{ name: string; coordinate: [number, number] | null }>>;
    endAdress: { name: string; coordinate: [number, number] | null };
    setEndAdress: React.Dispatch<React.SetStateAction<{ name: string; coordinate: [number, number] | null }>>;
    wayPointAddresses: { id:string, name: string; coordinate: [number, number] }[];
    setWayPointAddresses: React.Dispatch<React.SetStateAction<{id:string, name: string; coordinate: [number, number] }[]>>;
  
  
    setDirections: (data: { steps: Step[]; duration: string; distance: string }) => void;
    fetchDirections: (data: {startAdress: { name: string; coordinate: [number, number] | null }, endAdress: { name: string; coordinate: [number, number] | null }, wayPointAddresses: { id:string,name: string; coordinate: [number, number] }[]}) => Promise<any>; // Promise<void> yerine Promise<any>

}
const profileMap: { [key: string]: string } = {
  'yürüyüş': 'foot-walking',
  'bisiklet': 'cycling-regular',
  'otomobil': 'driving-car',
  'tekerlekli sandalye': 'wheelchair',
  'ağır vasıta': 'driving-hgv',
  'doğa yürüyüşü': 'foot-hiking',
  'dağ bisikleti': 'cycling-mountain',
  'elektrikli bisiklet': 'cycling-electric',
  'yol bisikleti': 'cycling-road',
  'otobüs': 'bus',
  'tarım aracı': 'agricultural',
  'kargo kamyonu': 'cargo-van',
  'ormancılık kamyonu': 'construction',
  'yük kamyonu': 'truck',
  // Diğerlerini de ekle
};


const DirectionsContext = createContext<DirectionsContextType | undefined>(undefined);

export  function DirectionsProvider({ children }: { children: React.ReactNode }) {
   
   const{activeButtonMenu,activeButtonSubMenu}=useProfile();
   const profile =
     activeButtonSubMenu && profileMap[activeButtonSubMenu]
       ? profileMap[activeButtonSubMenu]
       : (activeButtonMenu && profileMap[activeButtonMenu]
           ? profileMap[activeButtonMenu]
           : profileMap['otomobil']); // Varsayılan olarak 'driving-car' kullanılıyor

     const [steps, setSteps] = useState<Step[]>([]);
    const [duration, setDuration] = useState<string>("");
    const [distance, setDistance] = useState<string>("");
    const [startAdress, setStartAdress] = useState<{ name: string; coordinate: [number, number] | null }>({
        name: "",
        coordinate: null
    });
    
      const [endAdress, setEndAdress] = useState<{ name: string; coordinate: [number, number] | null }>({
        name: "",
        coordinate: null
    }); // Bitis noktasının adresini tutar<string>('');
    
    const[wayPointAddresses,setWayPointAddresses]=useState<{id:string,name:string, coordinate: [number, number]}[]>([]);
    


    const fetchDirections = async ({
        startAdress,
        endAdress,
        wayPointAddresses
    
      
    }: {
        startAdress: { name: string; coordinate: [number, number] | null },
        endAdress: { name: string; coordinate: [number, number] | null },
        wayPointAddresses: {id:string, name: string; coordinate: [number, number] }[],
       
    }) => {
        let responseData=null;
         if(!startAdress.coordinate || !endAdress.coordinate ) {
            console.error("Eksik veya hatalı koordinat!");
            return;
        }
               
             console.log(startAdress.coordinate);
             console.log(endAdress.coordinate);
             console.log(wayPointAddresses);
             console.log('Profile:', profile);
              const dev_api_url='http://localhost:3000/api/calculateroute';
              const api_url='https://route-project-backend-2o08hk5ti-begum02s-projects.vercel.app/api/calculateroute';
        try{
            const validWaypoints = wayPointAddresses
  .filter(addr => addr.coordinate && addr.coordinate[0] !== 0 && addr.coordinate[1] !== 0)
  .map(addr => addr.coordinate);

        const response = await axios.post(dev_api_url, {
  start: startAdress.coordinate,
  end: endAdress.coordinate,
  waypoints: validWaypoints,
  profile: profile
},{headers:{'Content-Type': 'application/json'}});
            console.log('Response from API:', response.data);
            if (!response.data || !response.data.steps || !response.data.duration || !response.data.distance) {
                throw new Error('Invalid response from API');
            }
         const   data = await response.data;
            responseData=data;
            console.log('Fetched directions:', data);
            if (data && data.steps && data.duration && data.distance) {
                setDirections(data);

            }
         
        
        }
    
        
     catch(error){
            console.error('Error fetching directions:', error);
        }

        return responseData;
        
    }
    const setDirections=(data:{steps:Step[],duration:string,distance:string})=>{
        setSteps(data.steps);
        setDuration(data.duration);
        setDistance(data.distance);
    }



    return (
        <DirectionsContext.Provider
    value={{
        steps,
        duration,
        distance,
        startAdress,
        setStartAdress,
        endAdress,
        setEndAdress,
        wayPointAddresses,
        setWayPointAddresses,
        fetchDirections,
        setDirections
    }}
>
    {children}
</DirectionsContext.Provider>
    );
   //DirectionContext bir interface yapısıdır ve Provider'ı extend ederek özelliklerini kullanabilirsiniz.

}
// eslint-disable-next-line react-refresh/only-export-components
export function useDirections() {
    const context = useContext(DirectionsContext);
    if (!context) {
      throw new Error('useDirections must be used within a DirectionsProvider');
    }
    return context;
}
