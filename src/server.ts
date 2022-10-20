import app from "./app"
app.listen(process.env.DEVELOPMENT_PORT, ()=>{
    console.log(`server started \n port ${process.env.DEVELOPMENT_PORT}`)
})