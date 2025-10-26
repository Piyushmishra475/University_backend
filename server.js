const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')

const app = express()
app.use(cors())
app.use(bodyParser.json())

// ---------------------- simple list
const universities = [
  { id: 'a', name:'Riverside Private University', location:'City X' },
  { id: 'b', name:'Hillcrest Global Institute', location:'City Y' }
]

// ---------------------- nested sample data
const details = {
  a: {
    id:'a',
    name:'Riverside Private University',
    faculties:[
      {name:'Engineering', courses:['BTech CS','BTech EE']},
      {name:'Business', courses:['BBA','MBA']}
    ]
  },
  b: {
    id:'b',
    name:'Hillcrest Global Institute',
    faculties:[
      {name:'Design', courses:['BDes','MDes']},
      {name:'Computing', courses:['BSc CS','MSc AI']}
    ]
  }
}

const leadsFile = './leads.json'

// ---------------- Load existing leads
let leads = []
try {
  if (fs.existsSync(leadsFile)) {
    leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8'))
  }
} catch (err) {
  console.log('No existing leads file found')
}

// -------------------- Save leads to file
const saveLeads = () => {
  fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2))
}

app.get('/api/universities', (req,res) => {
  return res.json({ success:true, data: universities })
})

app.get('/api/universities/:id', (req,res) => {
  const d = details[req.params.id]
  if(!d) return res.status(404).json({success:false,message:'not found'})
  return res.json({success:true,data:d})
})

app.post('/api/leads', (req,res) => {
  const {name,email,message,phone,state,course,intake} = req.body || {}
  const id = String(Date.now())
  const rec = {id,name,email,phone,state,course,intake,createdAt:new Date().toISOString()}
  leads.push(rec)
  saveLeads()
  return res.json({success:true,data:rec})
})

app.get('/api/leads', (req,res) => {
  return res.json({success:true,data:leads})
})



const port = process.env.PORT || 4000
app.listen(port,()=>console.log('API running on',port))
