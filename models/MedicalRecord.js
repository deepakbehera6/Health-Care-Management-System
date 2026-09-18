const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const medicalRecordSchema=Schema({
    patient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  doctor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  diagnosis: { type: String, required: true },
  prescription: { type: String, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);