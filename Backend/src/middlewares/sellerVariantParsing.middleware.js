export const parseVariantData=(req,res,next)=>{
try{
    
if(req.body.price){
    req.body.price=JSON.parse(req.body.price)
    
}
if(req.body.attributes){
    req.body.attributes=JSON.parse(req.body.attributes)

    
}
next()

}
catch(error){
return res.status(400).json( {
    success:false,
    message:"Invalid JSON in price or attributes",
    error:error.message
})
}
}