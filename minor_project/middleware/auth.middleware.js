const auth = (req, res, next)=>{
    console.log(`auth middleware called`);
    next();
}

export default auth;