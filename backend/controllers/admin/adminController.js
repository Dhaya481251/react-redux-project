const User = require("../../models/userModel");
const generateToken = require("../../utils/generateToken");

const adminLogin = async(req,res) => {
    try {
        const {email,password} = req.body;
        const admin = await User.findOne({email,isAdmin:true});
        if(!admin){
            return res.status(404).json({message:"Admin not found"});
        }

        const passwordMatch = await admin.matchPassword(password);
        if(!passwordMatch){
            return res.status(400).json({message:"Password does not match"});
        }

        if(admin && passwordMatch){
            const token = generateToken(res,admin._id,'admin_jwt');
            return res.status(200).json({
                _id:admin._id,
                name:admin.name,
                email:admin.email,
                isAdmin:admin.isAdmin,
                profileImage:admin.profileImage,
                token
            });
        }else{
            return res.status(400).json('Invalid email or password');
        }
    } catch (err) {
        return res.status(500).json({error:err});
    }
}

const adminHome = async(req,res) => {
    try {
        const adminId = req.admin._id;
        if(!adminId){
            return res.status(404).json({message:'AdminId not found'})
        }

        const admin = await User.findById(adminId);
        console.log('adminId : ',adminId)

        if(!admin){
            return res.status(404).json({message:'Admin not found'});
        }
        return res.status(200).json(admin);
    } catch (err) {
        return res.status(500).json({error:"Internal server error"});
    }
}

const adminLogout = async(req,res) => {
    try {
        res.cookie('admin_jwt','',{
            httpOnly:true,
            expires:new Date(0)
        })

        res.status(200).json({message:'Admin logged out successfully'});
    } catch (error) {
        res.status(500).json({message:'Internal server error'});
    }
}

const getUsers = async (req, res) => {
    try {
        const { search, page=1 , limit=10 } = req.query;
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 5;

        let query = { isAdmin: false };

        if (search && search.trim() !== '') {
            const searchRegex = new RegExp(search.trim(), 'i');

            query = {
                isAdmin: false,
                $or: [
                    { name: searchRegex },
                    { email: searchRegex }
                ]
            };
        }

        const skip = (pageNumber-1)*limitNumber;

        const [users,totalUsers] = await Promise.all([
            User.find(query)
            .select('-password')
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limitNumber),

            User.countDocuments(query)
        ])

        const totalPages = Math.ceil(totalUsers/limitNumber);

        res.status(200).json({users,currentPage:pageNumber,totalPages,totalUsers,hasNext:pageNumber<totalPages,hasPrev:pageNumber>1,limit:limitNumber});
        // const users = await User.find(query)
        //     .select('-password')
        //     .sort({ createdAt: -1 });

        // res.status(200).json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const editUser = async(req,res) => {
    try {
        const {id} = req.params;

        if(!id){
            res.status(400).json({message:'User ID is required'});
        }

        const user = await User.findById(id);

        if(!user){
            res.status(404).json({message:"User not found"});
        }

        if(req.body){
            if(user.name){
                user.name = req.body.name || user.name;
            }

            if(user.email){
                user.email = req.body.email || user.email;
            }

            if(req.body.password){
                user.password = req.body.password;
            }

            if(req.file){
                user.profileImage = `/uploads/${req.file.filename}`;
            }

            const updatedUser = await user.save();

            console.log('User updated successfully',updatedUser.name);

            res.status(200).json({
                _id:updatedUser._id,
                name:updatedUser.name,
                email:updatedUser.email,
                isAdmin:updatedUser.isAdmin,
                profileImage:updatedUser.profileImage
            })
        }
    } catch (err) {
        res.status(500).json({error : err});
    }
}

const deleteUser = async(req,res) => {
    const {id} = req.params;
    const deleteUser = await User.findById(id);

    if(!deleteUser){
        return res.status(404).json({message:'User not found'});
    }

   await deleteUser.deleteOne();

   const users = await User.find({isAdmin:false});
   users.filter((user) => user._id!==deleteUser._id);
   return res.status(200).json(users);
} 

const createUser = async(req,res) => {
    try {
        const {name,email,password} = req.body;
        
        const userExist = await User.findOne({email});

        if(userExist){
            return res.status(404).json({message:'User already exists'});
        }

        const user = await User.create({name,email,password});
        if(user){
            const token = generateToken(res,user._id,'user_jwt');
            return res.status(200).json({
                _id:user._id,
                name:user.name,
                email:user.email,
                profileImage:user.profileImage,
                isAdmin:user.isAdmin,
                token,
                message:'User created successfully'
            })
        }
        return res.status(400).json({message:'Invalid user data'});
    } catch (err) {
        return res.status(500).json({message:err});
    }
}

module.exports = {
    adminLogin,
    adminHome,
    adminLogout,
    getUsers,
    editUser,
    deleteUser,
    createUser,
}

