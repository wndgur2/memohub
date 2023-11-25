import { distinctData } from "./db";

export default async (req, res) => {
    distinctData(req.query.originalUrl).then((data)=>{
        res.json({query:data})
    })
}