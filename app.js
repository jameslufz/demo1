const   express =   require('express')
const   jwt     =   require('jsonwebtoken')
const   Port    =   process.env.Port || 3000
const   app     =   express()

app.get('/',(req,res)=>{
    res.json({
        message: 'hello'
    })
})

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


app.post('/api/login',(req, res)   =>  {

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
app.listen(Port, ()   =>  console.log('Server ON : port ' + Port))