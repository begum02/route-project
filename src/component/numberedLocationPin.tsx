

export default function NumberedLocationIcon({waypointCount}:{waypointCount:number}) {
    console.log("Rendering waypoint with number:", waypointCount); // Debug log

  return(
    <>
     <svg width="30" height="30" viewBox="0 0 42 55" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M21 0C32.598 0 42 9.40202 42 21C42 22.4157 41.8599 23.7986 41.5929 25.1358C39.7394 39.1032 21.1104 55 21.1104 55C21.1104 55 5.25689 41.4717 1.34456 28.4096C0.475507 26.1054 0 23.6083 0 21C0 9.40202 9.40202 0 21 0Z" fill="#26529B"/>
<path d="M38 21C38 11.6112 30.3888 4 21 4C11.6112 4 4 11.6112 4 21C4 30.3888 11.6112 38 21 38C30.3888 38 38 30.3888 38 21Z" fill="white"/>


        <text 
  
          textAnchor="middle"
          dominantBaseline="middle"
          fill="black"
          style={{ fontFamily: 'Arial, sans-serif' , fontSize: '23px' }}
          x="21"
          y="21"         
          
        >
          {waypointCount}
        </text>
       
      </svg>
    </>
  )
}

