// import { useParams } from "next/navigation";
import { readData } from "../db";

export default async (req, res) => {
    const id = req.query.id;
    console.log(id);
    readData(id).then((data) => {
        console.log(data);
    })
    res.json({ query: id });
}
