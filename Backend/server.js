import app from "./src/app.js"
import connectToDatabse from "./src/config/database.js"

const startServer=()=>{
try{

    connectToDatabse()
    
    
    
    app.listen(3000,()=>{
        console.log("server is running on port 3000")
    })
}
catch(err){
    console.error(`failed to start server ${err.message}`)
}
}
startServer()