import { writeData } from "./db";

export default async (req, res) => {
    writeData(req.body);
    console.log(req.body);
    res.json({ hello: 'memo' });
}
