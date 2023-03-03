const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');


module.exports.login = async(req,res,next)=>{
	try{
		const{username} = req.body;
		const user = await User.findOne({username})
		if(!user){
			return res.json({msg:"Account need to be Regitered",status:false});			
		}
		return res.json({status:true, user})
	}catch(ex){
		next(ex)
	}
}


module.exports.register = async(req,res,next)=>{
	try{
		const {username,number} = req.body;
		const profile = 'https://ik.imagekit.io/d3kzbpbila/default_eTFP5aV9S.webp?ik-sdk-version=javascript-1.4.3&updatedAt=1674664031760'
		const user = await User.create({
			username,profile,number
		})
		return res.json({status:true,user})
	}catch(ex){
		next(ex);
	}
}

module.exports.doctorLogin = async(req,res,next) => {
	try{
		const {username,password} = req.body;

		const doctor = await Doctor.findOne({username,password});
		if(!doctor){
			return res.json({msg:"Account need to be registered", status:false});
		}
		return res.json({status:true, doctor});
	}catch(ex){
		next(ex)
	}
}

module.exports.therapyNeeded = async(req,res,next) => {
	try{
		const userId = req.params.id;
		const {therapyNeeded,therapy} = req.body;
		const therapyProvided = false

		const user = await User.findByIdAndUpdate(userId,{
			therapyNeeded, therapy, therapyProvided
		})

		return res.json({status:true, user})


	}catch(ex){
		next(ex)
	}
}

module.exports.updateMessages = async(req,res,next) => {
	try{
		const userId = req.params.id;
		const {messages} = req.body;
		let messageAlert = false
		if(!messages[messages.length - 1].doctor){
			messageAlert = true
		}
		const user = await User.findByIdAndUpdate(userId,{
			messages,messageAlert
		},{new:true})
		return res.json({status:true, user});
	}catch(ex){
		next(ex)
	}
}

module.exports.therapyProvide = async(req,res,next) => {
	try{
		const userId = req.params.id;
		const {therapyNeeded,therapyProvided} = req.body;

		const user = await User.findByIdAndUpdate(userId,{
			therapyNeeded, therapyProvided
		})

		return res.json({status:true, user})
	}catch(ex){
		next(ex)
	}
}

module.exports.doctorRegister = async(req,res,next) => {
	try{
		const {username,password} = req.body;
		const profile = 'https://img.freepik.com/premium-vector/doctor-profile-with-medical-service-icon_617655-48.jpg?w=2000'
		const doctor = await Doctor.create({
			username,profile,password
		})
		return res.json({status:true,doctor})
	}catch(ex){
		next(ex)
	}
}

module.exports.getAll = async(req,res,next) => {
	try{

		const data = await User.find();
		return res.json({status:true, data})

	}catch(ex){
		next(ex)
	}
}