"use strict";
const express = require('express');
const app = express();
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*"); 
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });
app.get('/', (req, res) => {
    res.send("Hello from backend");
});
app.listen(3000, () => {
    console.log("Server listening on 300");
});
