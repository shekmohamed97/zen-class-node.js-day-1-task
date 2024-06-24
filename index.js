import express from "express";
import  fs from "fs";
import { format } from "date-fns/format";
import path from "path";


const app= express();

const PORT = 6000

app.get("/write",(req,res)=>{
    let today = format(new Date(),"dd-MM-yyyy-HH-mm-ss");
    console.log("today",today);
    const filePath = `TimeStamp/${today}.txt`;
    fs.writeFileSync(filePath,`${today}`,"utf-8");
    res.status(200).send(`TimeStamp written :${today}`);
});

app.get("/read",(req,res)=>{
    const directoryPath=path.join("TimeStamp");

    fs.readdir(directoryPath,(err,files)=>{
        if(err){
            return res.status(500).send("Unable to scan directory :"+err);
        }

        files=files.map(fileName=>{
            return{
                name:fileName,
                time:fs.statSync(path.join(directoryPath,fileName)).mtime.getTime()
            }
        }).sort((a,b)=>b.time-a.time).map(v=>v.name);

        if(files.length===0){
            return res.status(404).send("No timestamp files found");
        }

        const latesFile=files[0];
        const filePath=path.join(directoryPath,latesFile);


        let data = fs.readFileSync(filePath,"utf-8");
        res.status(200).send(data);
    });
});

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})