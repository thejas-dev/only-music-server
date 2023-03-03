const mongoose = require('mongoose')

const doctorSchema =  new mongoose.Schema({
	username:{
		type: String,
		min:3,
		max:20,
	},
	password:{
		type:String,
		default:""
	}
	},
	{
		timestamps:true,
	}

)



module.exports = mongoose.model("Doctors",doctorSchema)