const User = require('../../models/userModel');
const generateToken = require('../../utils/generateToken');

const registerUser = async(req,res) => {
    try {
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({message:'All fields are required'})
        }
        const userExist = await User.findOne({email});

        if(userExist){
            return res.status(409).json({message:'User already exists'});
        }else{
            const user = await User.create({name,email,password});

            if(user){
                const token = generateToken(res,user._id,'user_jwt');
                return res.status(200).json({
                    _id:user._id,
                    name:user.name,
                    email:user.email,
                    token,
                    profileImage:user.profileImage,
                    isAdmin:user.isAdmin,
                    message:'User registered successfully'
                })
            }
            return res.status(400).json({message:'Invalid user details'});
        }

    } catch (error) {
        return res.status(500).json({message:"Internal server error"});
    }
}

const loginUser = async(req,res) => {
    try {
        const {email,password} = req.body;
    if(!email || !password) {
        return res.status(400).json({message:'All fields are required'});
    }

    const findUser = await User.findOne({email,isAdmin:false});
    if(!findUser){
        return res.status(404).json({message:'User not found'});
    }

    const passwordMatch = await findUser.matchPassword(password);
    if(!passwordMatch){
        return res.status(400).json({message:"Incorrect Password"});
    }
    
    if(findUser && passwordMatch){
        const token = generateToken(res,findUser._id,'user_jwt');

        return res.status(200).json({
            _id:findUser._id,
            name:findUser.name,
            email:findUser.email,
            token,
            profileImage:findUser.profileImage,
            isAdmin:findUser.isAdmin,
            message:"User logged in successfully",
        });
    }
    } catch (error) {
        return res.status(500).json({message:"Internal server error"});
    }
}

const logoutUser = async(req,res) => {
    try {
        res.cookie('user_jwt','',{
            httpOnly:true,
            expires:new Date(0)
        })

        return res.status(200).json({message:'User logged out successfully'});
    } catch (error) {
        return res.status(500).json({message:'Internal server error'})
    }
}

const loadHome = async(req,res) => {
    try {
        const userId = req.user._id;
        if(!userId){
            return res.status(400).json({message:'Welcome to Home. Please login'})
        }
        const user = await User.findById(userId)

        if(!user){
           return res.status(404).json({message:'User not found'}); 
        }
        return res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message:'Internal server error'});
    }
}

const updateProfileImage = async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({message:'No image file uploaded'});
        }
    
        const imagePath = `/uploads/${req.file.filename}`;
    
        const user = await User.findByIdAndUpdate(req.user._id,{profileImage:imagePath},{new:true}).select('-password');
    
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
    
        return res.status(200).json({
          _id:user._id,
          name: user.name,
          email: user.email,
          isAdmin:user.isAdmin,
          profileImage: user.profileImage,
        });
    } catch (err) {
        return res.status(500).json({message:"Internal server error"})
    }

};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    loadHome,
    updateProfileImage,
}

// const checkLoggedIn = async(req,res) => {
//     try {
//         const user = await User.findById(req.user._id);
//         if(!user){
//             return res.status(404).json(null)
//         }
//         return res.status(200).json(user)
//     } catch (error) {
//         return res.status(500).json({message:'Internal server error'});
//     }
// }