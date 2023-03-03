const cors = require('cors');
const socket = require('socket.io')
const express = require('express');
const stripe = require('stripe')('sk_test_51Mhdi9SD5rpc3nFrfQrEKxvDQ64lILXj3oO8csaDSth2k8D1s61hh0xGyDNlQ1w9MRhHSODs7x0zsLECsvJWCi1L00SrbUYqNW');
require('dotenv').config();

const mongoose = require('mongoose');

const userRoutes = require("./routes/userRoutes")

const app = express();
app.use(cors({origin:'*'}));

app.use(express.json());
app.use('/api/auth',userRoutes);

const items = new Map([
    ['stress',{priceInCents:24900, name:'Stress Music Therapy',items:'Music Therapy to relieve Stress',image:'https://media.istockphoto.com/id/1281326263/vector/stress-level-reduced-with-problem-and-pressure-solving-tiny-persons-concept-tired-from.jpg?s=612x612&w=0&k=20&c=cxAtecUf4_Yyzn8QYUg41MHNXzNPXli0Y1uT6RWhm1c='}],
    ['depression',{priceInCents:59900, name:'Depression Music Therapy',items:'Music Therapy to relieve Depression',image:'https://www.sleepfoundation.org/wp-content/uploads/2020/09/shutterstock_1502365082.jpg'}],
    ['meditation',{priceInCents:19900, name:'Meditaion Music Therapy',items:'Music Therapy for Mediatation',image:'https://img.freepik.com/free-vector/organic-flat-people-meditating-illustration_23-2148906556.jpg?w=2000'}],
    ['motivation',{priceInCents:29900, name:'Motivation Music Therapy',items:'Music Therapy for Motivation',image:'https://nationaltoday.com/wp-content/uploads/2021/10/Motivation-and-Inspiration-Day-640x514.jpg'}],
    ['autism',{priceInCents:79900, name:'Autism Music Therapy',items:'Music Therapy for Autism',image:'https://imageio.forbes.com/specials-images/imageserve/61cc9dc17390740da6554667/Little-boy-and-a-colorful-brain-sketch/960x0.jpg?format=jpg&width=960'}],
    ['sleeplessness',{priceInCents:9900, name:'Sleeplessness Music Therapy',items:'Music Therapy to relieve from Sleeplessness',image:'https://thumbs.dreamstime.com/b/sleeplessness-24366752.jpg'}],
])

app.get('/',async(req,res)=>{
	res.send('hello world')
})
app.post('/pay',async(req,res)=>{

	const session  = await stripe.checkout.sessions.create({
		payment_method_types:['card'],
        mode:'payment',
        line_items: req.body.items.map(itemBody=>{
                const item = items.get(itemBody.id)
                return {
                    price_data:{
                        currency:'inr',
                        product_data:{
                            name:item.name,
                            description:item.items,
                            images:[item.image]
                        },
                        unit_amount:item.priceInCents
                    },
                    quantity:1,
                }                    
            }),
            success_url:`https://only-music.vercel.app/thanks?disease2=${req.body.items[0].id}&name=${req.body.username}&id=${req.body.id}`,
            cancel_url:`https://only-music.vercel.app`,

	})
	res.json({url:session.url})
})




mongoose.connect(process.env.MONGO_ID,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("db connected successfully")
}).catch((err)=>{
    console.log(err);
});

const Server = app.listen(process.env.PORT,()=>{
	console.log('server started')
})


const io = socket(Server,{
    cors:{
        origin:"https://only-music.vercel.app",
        credentials:true,
    },
})

global.onlineUsers = new Map();

io.on('connection',(socket)=>{
    console.log('a user connected');
    socket.on('joinwebsite',({name})=>{
        console.log(name)
        let res = {
            name:name
        }
        io.sockets.emit("newPatient",res);
    })
    socket.on('therapyBought',({disease,user})=>{
        console.log(disease,user);
        let res = {
            disease:disease,
            user:user
        }
        io.sockets.emit('therapyAlert',res);
    })
    socket.on('newMessage',()=>{
        io.sockets.emit('messageRefresh')
    })
    socket.on('newMessageFromDoctor',()=>{
        io.sockets.emit('messageRefreshFromDoctor')
    })
    socket.on('disconnect',()=>{
        console.log('user disconnected');
    })
})