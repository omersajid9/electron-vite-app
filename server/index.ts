const express = require('express');

const app = express();

app.use((req: any, res: { header: (arg0: string, arg1: string) => void; }, next: () => void) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  

app.get('/', (req: any, res: { send: (arg0: string) => void; }) =>
{
    res.send("Hello from backend");
})

app.listen(3000, () =>
{
    console.log("Server listening on 300");
})