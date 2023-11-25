import { distinctData } from "./db";

export default async (req, res) => {
    distinctData().then((data)=>{
        res.json({query:data})
    })
}

