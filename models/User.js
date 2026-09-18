const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true,unique:true},
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Patient', 'Doctor', 'Admin'], 
    default: 'Patient' 
  },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  profilePicture: { type: String, default: 'default.png' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
