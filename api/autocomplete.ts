
import { VercelRequest, VercelResponse } from '@vercel/node';


export default async function handler(req: VercelRequest, res: VercelResponse) {
           const text=req.query.query as string;
       
        const orsKey=process.env.ORS_KEY;
 

  
    if(req.method=="GET"){


        const params= new URLSearchParams({
            text: text,
            api_key: orsKey || ''
        });

        const url=`https://api.openrouteservice.org/geocode/autocomplete?${params.toString()}`;

        const data=await fetch(url);
        const json=await data.json();


        res.status(200).json(json);

        
    }

}