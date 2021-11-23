const cors = require('cors')
const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()


const app = express()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0g2vq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

//console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const database = client.db("travel");
        const servicesCollection = database.collection("tplans");
        const bookingsCollection = client.db("travel").collection("bookings")


        //get
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })






        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            console.log('getting specific', id)
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query)
            res.json(service)
        })



        app.post('/addServices', async (req, res) => {
            const result = await servicesCollection.insertOne(req.body)
            res.send(result);
        })

        //comfirm

        app.post('/confirmOrder', async (req, res) => {
            const result = await bookingsCollection.insertOne(req.body)
            res.send(result);
        })

        //myOrders

        app.get('/myOrder/:email', async (req, res) => {
            const result = await bookingsCollection.find({ email: req.params.email }).toArray()
            res.send(result);
        })

        //manageorder

        app.get('/allOrder', async (req, res) => {
            const result = await bookingsCollection.find({}).toArray()
            res.send(result)
        })

        //addservice

        app.get('/addServices', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })
        //updatestatus

        app.put("/statusUpdate/:id", async (req, res) => {
            const filter = { _id: ObjectId(req.params.id) };
            const result = await bookingsCollection.updateOne(filter, {
                $set: {
                    status: req.body.status,
                },
            });
            res.send(result);

        });


        //   deleteOrder
        app.delete('/deleteOrder/:id', async (req, res) => {
            const result = await bookingsCollection.deleteOne({ _id: ObjectId(req.params.id) })
            res.send(result);
        })

        //service  
        app.post('/services', async (req, res) => {

            const service = {

                "name": "BOSNIA AND HERZEGOVINA TOUR",
                "price": "900",
                "desc": "A full city tour",
                "img": "https://images.unsplash.com/photo-1602518110440-e3e6518a0d75?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=735&q=80",


            }
            const result = await servicesCollection.insertOne(service)
            console.log(result);

        })

    }
    finally {
        //  await client.close();
    }

}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('europe going')
})

app.listen(port, () => {
    console.log('server running at port', port)
})

