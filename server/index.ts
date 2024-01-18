const express = require('express');
const mongoose  = require("mongoose");


const app = express();
mongoose.connect('mongodb://localhost:27017/cavi', {
    useNewUrlParser: true
})

const KeyValueSchema = new mongoose.Schema({
    key: String,
    value: String
})

const KeyValue = mongoose.model('KeyValue', KeyValueSchema);

interface HashMap {
    [key: string]: string
}

class StringHashMap {
    private data: HashMap = {};

    add(key: string, value:string)
    {
        this.data[key] = value;
    }
    remove(key: string)
    {
        delete this.data[key]
    }
    search(____: string)
    {
        return this.data[____]
    }
    getKeysAndValues()
    {
        const keys = Object.keys(this.data);
        const values = Object.values(this.data);

        let retString = "";
        for (let i = 0; i < keys.length; i++)
        {
            retString += keys[i] + " - " + values[i] + "|";
        }
        return retString
    }
}


// const list: string[] = [];

app.use((req: any, res: { header: (arg0: string, arg1: string) => void; }, next: () => void) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  
app.use(express.json());

const stringHashMap = new StringHashMap();
stringHashMap.add("a", "lol");  

app.get('/search', async (req: any, res: any) =>
{

    var query = req.query.name;
    try
    {
        const search = await searchDocument(query);
        console.log("AA", search);
        res.send(search);
    }
    catch (error)
    {
        console.log(error);
        res.status(500).send({error}); 
    }
    // searchDocument(query).then((search) => {console.log(search);res.send(search)});
    // console.log(search)
    // res.send(search);
    // res.send(stringHashMap.search(query));

})

app.post('/add', (req: any, res: any) =>
{
    var response = JSON.parse(req.body.string);
    insertDocument(response.name, response.snippet);

    stringHashMap.add(response.name, response.snippet);
    res.sendStatus(200);
})

app.get("/all", (req: any, res:any) =>
{
    console.log("ALL")
    res.send(allDocuments())
})

app.get('/', async (req: any, res: { send: (arg0: string) => void; }) =>
{
    // res.send(stringHashMap.getKeysAndValues());
    // insertDocument("name", req.params.id);
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
        const arr : any = [];
        const result = await KeyValue.find({});
        result.forEach((z:any)=>
        {
            arr.push({key: z.key , value: z.value})
        })
        return arr;
      } catch (error) {
        console.log("Error searching database", error);
        throw error;
      }

    const arr : any = [];
    await KeyValue.find({}).then((e:any)=>{e.forEach((z:any)=>{arr.push(z.key + " - " + z.value)})});
    // console.log(arr);
    return arr[1];
}


const searchDocument = async (_key: any) =>
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

const insertDocument = async (key: any, value: any) =>
{
    const keyValue = new KeyValue({
        key: key,
        value: value
    });
    const result = await keyValue.save();
    // return result;
}
