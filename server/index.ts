import { AxiosRequestHeaders, AxiosResponseHeaders } from "axios";

const express = require('express');
const mongoose  = require("mongoose");


const app = express();
mongoose.connect('mongodb://localhost:27017/cavi', {
    useNewUrlParser: true
})

interface FormData
{
  key: string,
  value: string,
  variableData: VariableData[]
}

interface VariableData
{
  varName: string,
  index: number,
  text: string
}


const KeyValueSchema = new mongoose.Schema({
    key: String,
    value: String,
    variableData: 
    [{
        varName: String,
        index: Number,
        text: String
    }]
})

const KeyValue = mongoose.model('KeyValue', KeyValueSchema);

app.use((req: any, res: any, next: () => void) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  
app.use(express.json());


app.get('/search', async (req: any, res: any) =>
{

    var query = req.query.name;
    try
    {
        const search = await searchDocument(query);
        res.send(search);
    }
    catch (error)
    {
        res.status(500).send({error}); 
    }
})

app.post('/add', (req: any, res: any) =>
{
    var response = req.body;
    var reponsedata: FormData = {key: response.key, value: response.value, variableData: response.variableData}
    insertDocument(reponsedata);
    res.sendStatus(200);
})

app.get("/all", (req: any, res: any) =>
{
    res.send(allDocuments())
})

app.get('/', async (req: any, res: any) =>
{
    const val = await allDocuments();
    res.send(val);
    
})

app.listen(3000, () =>
{
    console.log("Server listening on 3000");
})

const allDocuments = async () =>
{
    try {
        const arr : FormData[] = [];
        const result = await KeyValue.find({});
        result.forEach((z:FormData)=>
        {
            arr.push({key: z.key , value: z.value, variableData: z.variableData})
        })
        return arr;
      } catch (error) {
        console.log("Error searching database", error);
        throw error;
      }

}

const searchDocument = async (_key: string) =>
{
    try {
        const result = await KeyValue.findOne({key: _key});
        return result;
      } catch (error) {
        console.log("Error searching database", error);
        throw error;
      }
        // return result;
}

const insertDocument = async (doc: FormData) =>
{
    const keyValue = new KeyValue({
        key: doc.key,
        value: doc.value,
        variableData: doc.variableData,
    });
    const result = await keyValue.save();
    // return result;
}
