const mongoose = require('mongoose')


const userSchema =  new mongoose.Schema({
	username:{
		type: String,
		min:3,
		max:20,
	},
	number:{
		type:Number,
		default:""
	},
	therapy:{
		type:String,
		default:""
	},
	profile:{
		type:String,
		default:""
	},
	therapyNeeded:{
		type:Boolean,
		default:false
	},
	therapyProvided:{
		type:Boolean,
		default:false
	},
	messages:{
		type:Array,
		default:[]
	},
	messageAlert:{
		type:Boolean,
		default:false
	}
	},
	{
		timestamps:true,
	}
);


module.exports = mongoose.model("Users",userSchema)