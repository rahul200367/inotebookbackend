const express = require('express');
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const JWT_SECRET= 'Rahulisgoodboy';
//create a user using :post "/api/auth/".Doesn;t require auth
router.post('/createuser', [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
], async (req, res) => {
    let success = false;
    //if there are error ,return bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    //check whether the user with this email exits aleady
   try{
    let user = await User.findOne({email: req.body.email});
    console.log(user);
    if (user){
        return res.status(400).json({success,error:"Sorry a user with this email already exists"})
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    //create a new user
    user = await  User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
    })
    const data={
        user:{
            id: user.id
        }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
   //console.log(authtoken);
   res.status(200).json({success,authtoken});
   }catch(error){
    console.error(error.message);
    res.status(500).send("some error occured");
   }

})
//authenticate a user using  post"/api/auth/login"
router.post('/login', [
    body('email','Enter a vald email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success = false;
//if there are errors return bad request
const errors = validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
}
const {email, password}=req.body;
try{
    let user = await User.findOne({email});
    if(!user){
        success = false;
        return res.status(400).json({error:'please try to login with current credential'})
}
const passwordcompare =  await bcrypt.compare(password , user.password);
if(!passwordcompare){
    success = false;
    return res.status(400).json({success,error:'please try to login with current credential'})

}
const data = {
    user:{
        id: user.id
    }
}
const authtoken = jwt.sign(data, JWT_SECRET);
success = true;
res.json({success,authtoken});
    }
   catch(error){
    console.error(error.message);
    res.status(500).send("Internal server error occured");
   }
});
//route 3 ;get login in userdetaiils
router.post('/getuser',fetchuser, async (req, res) => {
try{
    userId = req.user.id;
const user = await User.findById(userId).select("-password")
 res.send(user)
}catch(error){
    console.error(error.message);
    res.status(500).send("Internal server error occured"); 
}
})
module.exports = router;

