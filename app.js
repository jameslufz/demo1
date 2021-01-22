const   express         =   require('express')
const   jwt             =   require('jsonwebtoken')
const   bodyParser      =   require("body-parser")
const   session         =   require('express-session')
const   cookieParser    =   require('cookie-parser')
const   PORT    =   process.env.PORT || 5000

const   app     =   express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.header('Access-Control-Allow-Methods','POST, GET, PUT, PATCH, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers','Content-Type, Option, Authorization')
    next()
})

app.get('/',(req,res)=>{
    res.json({
        message: 'hello'
    })
})


//////////////////////////////////
//////////////////////////////////
//////////////////////////////////

    const mocks   =   [
            {
                "vehicle"   :   "Car",
                "name"      :   "James",
                "brand"     :   "Tesla"
            },
            {
                "vehicle"   :   "Motorcycle",
                "name"      :   "James",
                "brand"     :   "GPX"
            },
            {
                "vehicle"   :   "Car",
                "name"      :   "Beam",
                "brand"     :   "Honda"
            },
            {
                "vehicle"   :   "Airplane",
                "name"      :   "Chi",
                "brand"     :   "Yamaha"
            },
            {
                "vehicle"   :   "Boat",
                "name"      :   "Beam",
                "brand"     :   "Tesla"
            }
        ]
app.get("/api",(req,res) => {
    res.json(mocks)
})
app.get("/api/:name",(req,res) => {
    const   name    =   req.params.name
    const   result  =   mocks.filter(mock => mock.name.toLocaleLowerCase() == name.toLocaleLowerCase())
    res.json(result)
})
app.get("/api/:name/:brand",(req,res) => {
    const   name    =   req.params.name
    const   brand   =   req.params.brand
    const   result  =   mocks.filter(mock => 
        (mock.name.toLocaleLowerCase() == name.toLocaleLowerCase()) 
        && mock.brand.toLocaleLowerCase() == brand.toLocaleLowerCase()
    )
    res.json(result)
})

app.get("/next/api",(req,res) => {

    const   schema  =   {
        name    :   req.body.name,
        age     :   req.body.age
    }
    if(!schema.name || !schema.age){
        res.json({message:"error"})
    }else{
        
        jwt.sign({schema},'chuchibukim',{ expiresIn:'1h' }, (err,token)    =>{
            
            app.use(session({
                secret: token,
                cookie: {
                    path: '/',
                    domain: 'http://localhost:3000',
                    maxAge: 1000 * 60 * 24 // 24 hours
                }
            }))

            if(token){
                res.json({message:"success",status:200})
            }

        })
    }
    // jwt.sign({schema},'chuchibukim',{ expiresIn:'1h' }, (err,token)    =>{
    //     res.json({token})
    // })
    // const   txt     =   req.body
    // res.json(txt)
})
//////////////////////////////////
//////////////////////////////////
//////////////////////////////////

app.post('/api/verify', verifyToken, (req, res)=>  {
    jwt.verify(req.token,'chuchibukim',(err,data)=> {
        if(err)
        {
            res.sendStatus(403)
        }else{
            res.json({
                message:    'hello world',
                data
            })
        }
    })

})


app.get('/api/login',(req, res)   =>  {

    const   schema  =   {
        id          :   1,
        username    :   'jameslufz',
        password    :   '1234'
    }

    jwt.sign({schema},'chuchibukim',{ expiresIn:'1h' }, (err,token)    =>{
        res.json({token})
    })
})


function verifyToken (req,res,next) {

    const   bearerHeader    =   req.headers['authorization']
    if(typeof bearerHeader !== undefined)
    {
        const bearer        =   bearerHeader.split(' ')
        const bearerToken   =   bearer[1]
        req.token   =   bearerToken
        next()
    }
    else
    {
        res.json({
            message: res.sendStatus(403)
        })
    }

}
app.listen(PORT, ()   =>  console.log('Server ON : port ' + PORT))
