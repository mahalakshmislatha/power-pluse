const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let reports = [
  {
    id: 'rep-1',
    type: 'cut',
    area: 'T. Nagar, Chennai',
    district: 'Chennai',
    lat: 13.0418,
    lng: 80.2341,
    reason: 'transformer fault',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    confirmations: 4,
    status: 'active'
  },
  {
    id: 'rep-2',
    type: 'cut',
    area: 'Anna Nagar, Chennai',
    district: 'Chennai',
    lat: 13.0850,
    lng: 80.2101,
    reason: 'maintenance',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    confirmations: 6,
    status: 'active'
  },
  {
    id: 'rep-3',
    type: 'restored',
    area: 'Adyar, Chennai',
    district: 'Chennai',
    lat: 13.0012,
    lng: 80.2565,
    reason: 'maintenance',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    confirmations: 2,
    status: 'resolved'
  },
  {
    id: 'rep-4',
    type: 'cut',
    area: 'Gandhipuram, Coimbatore',
    district: 'Coimbatore',
    lat: 11.0168,
    lng: 76.9558,
    reason: 'tree fall',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    confirmations: 3,
    status: 'active'
  },
  {
    id: 'rep-5',
    type: 'cut',
    area: 'KK Nagar, Madurai',
    district: 'Madurai',
    lat: 9.9252,
    lng: 78.1198,
    reason: 'storm',
    timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    confirmations: 5,
    status: 'active'
  },
  {
    id: 'rep-6',
    type: 'restored',
    area: 'Thillai Nagar, Trichy',
    district: 'Tiruchirappalli',
    lat: 10.8280,
    lng: 78.6867,
    reason: 'maintenance',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    confirmations: 1,
    status: 'resolved'
  }
];

// Mock Scheduled Shutdowns (Planned Maintenance by TNEB / TANGEDCO)
let scheduledShutdowns = [
  {
    id: 'sched-1',
    district: 'Chennai',
    substation: 'T. Nagar 110kV SS',
    areas: ['Usman Road', 'Pondy Bazaar', 'Ranganathan Street', 'Panagal Park', 'G.N. Chetty Road'],
    date: '2026-08-18',
    timeWindow: '09:00 AM - 04:00 PM',
    reason: 'Monthly Substation Maintenance & Feeder Upgrades',
    status: 'Scheduled',
    tneblink: 'https://www.tangedco.gov.in/'
  },
  {
    id: 'sched-2',
    district: 'Chennai',
    substation: 'Anna Nagar 230kV SS',
    areas: ['Shanthi Colony', 'Third Avenue', 'K4 Station Area', 'Anna Nagar East'],
    date: '2026-08-19',
    timeWindow: '09:00 AM - 05:00 PM',
    reason: 'Transformer Cable Replacement & Tree Pruning',
    status: 'Scheduled',
    tneblink: 'https://www.tangedco.gov.in/'
  },
  {
    id: 'sched-3',
    district: 'Coimbatore',
    substation: 'Peelamedu SS',
    areas: ['PSG Tech Area', 'Avinashi Road', 'Hopes College', 'TIDEL Park Road'],
    date: '2026-08-18',
    timeWindow: '09:00 AM - 04:00 PM',
    reason: 'Substation Equipment Maintenance',
    status: 'Scheduled',
    tneblink: 'https://www.tangedco.gov.in/'
  },
  {
    id: 'sched-4',
    district: 'Madurai',
    substation: 'Tallakulam SS',
    areas: ['KK Nagar', 'Goripalayam', 'Anna Nagar', 'Race Course'],
    date: '2026-08-20',
    timeWindow: '08:30 AM - 02:30 PM',
    reason: 'Grid Feeder Maintenance',
    status: 'Scheduled',
    tneblink: 'https://www.tangedco.gov.in/'
  },
  {
    id: 'sched-5',
    district: 'Tiruchirappalli',
    substation: 'Thillai Nagar SS',
    areas: ['Thillai Nagar Main', 'Salai Road', 'Sastri Road', 'Tennur'],
    date: '2026-08-19',
    timeWindow: '09:00 AM - 04:00 PM',
    reason: 'High Voltage Line Upgrades',
    status: 'Scheduled',
    tneblink: 'https://www.tangedco.gov.in/'
  },
  {
    id: 'sched-6',
    district: 'Salem',
    substation: 'Suramangalam SS',
    areas: ['Junction Main', 'Four Roads', 'Five Roads', 'Meyyanur'],
    date: '2026-08-21',
    timeWindow: '09:00 AM - 05:00 PM',
    reason: 'Transformer Maintenance',
    status: 'Scheduled',
    tneblink: 'https://www.tangedco.gov.in/'
  }
];

let complaints = [];

app.get('/api/reports', (req, res) => {
  res.json(reports);
});

app.get('/api/scheduled-shutdowns', (req, res) => {
  res.json(scheduledShutdowns);
});

const ALL_38_DISTRICTS = [
  { name: 'Ariyalur', towns: ['Ariyalur Town', 'Jayamkondam', 'Sendurai', 'Udayarpalayam'] },
  { name: 'Chengalpattu', towns: ['Tambaram', 'Chengalpattu Town', 'Chromepet', 'Pallavaram', 'Guduvancheri'] },
  { name: 'Chennai', towns: ['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'Mylapore', 'Porur', 'Guindy'] },
  { name: 'Coimbatore', towns: ['Gandhipuram', 'RS Puram', 'Peelamedu', 'Singanallur', 'Saravanampatti', 'Pollachi'] },
  { name: 'Cuddalore', towns: ['Cuddalore Town', 'Chidambaram', 'Neyveli', 'Panruti', 'Vriddhachalam'] },
  { name: 'Dharmapuri', towns: ['Dharmapuri Town', 'Harur', 'Palacode', 'Pennagaram'] },
  { name: 'Dindigul', towns: ['Dindigul Town', 'Palani', 'Kodaikanal', 'Oddanchatram'] },
  { name: 'Erode', towns: ['Erode Town', 'Perundurai', 'Bhavani', 'Gobichettipalayam', 'Sathyamangalam'] },
  { name: 'Kallakurichi', towns: ['Kallakurichi Town', 'Tirukkoyilur', 'Ulundurpet', 'Sankarapuram'] },
  { name: 'Kanchipuram', towns: ['Kanchipuram Town', 'Sriperumbudur', 'Walajabad', 'Uttiramerur'] },
  { name: 'Kanyakumari', towns: ['Nagercoil', 'Kanyakumari Town', 'Marthandam', 'Thuckalay'] },
  { name: 'Karur', towns: ['Karur Town', 'Kulithalai', 'Aravakurichi', 'Manmangalam'] },
  { name: 'Krishnagiri', towns: ['Krishnagiri Town', 'Hosur', 'Denkanikottai', 'Pochampalli'] },
  { name: 'Madurai', towns: ['KK Nagar', 'Anna Nagar', 'Simmakkal', 'Tallakulam', 'Thiruparankundram', 'Melur'] },
  { name: 'Mayiladuthurai', towns: ['Mayiladuthurai Town', 'Sirkazhi', 'Tharangambadi', 'Kuthalam'] },
  { name: 'Nagapattinam', towns: ['Nagapattinam Town', 'Velankanni', 'Kilvelur', 'Vedaranyam'] },
  { name: 'Namakkal', towns: ['Namakkal Town', 'Rasipuram', 'Tiruchengode', 'Paramathi Velur'] },
  { name: 'Nilgiris', towns: ['Udhagamandalam (Ooty)', 'Coonoor', 'Kotagiri', 'Gudalur'] },
  { name: 'Perambalur', towns: ['Perambalur Town', 'Kunnam', 'Veppanthattai'] },
  { name: 'Pudukkottai', towns: ['Pudukkottai Town', 'Aranthangi', 'Alangudi', 'Gandarvakkottai'] },
  { name: 'Ramanathapuram', towns: ['Ramanathapuram Town', 'Rameswaram', 'Paramakudi', 'Mudukulathur'] },
  { name: 'Ranipet', towns: ['Ranipet Town', 'Arakkonam', 'Wallajah', 'Arcot'] },
  { name: 'Salem', towns: ['Salem Town', 'Attur', 'Mettur', 'Omalur', 'Sankari', 'Yercaud'] },
  { name: 'Sivaganga', towns: ['Sivaganga Town', 'Karaikudi', 'Devakottai', 'Manamadurai'] },
  { name: 'Tenkasi', towns: ['Tenkasi Town', 'Sankarankovil', 'Kadayanallur', 'Courtallam'] },
  { name: 'Thanjavur', towns: ['Thanjavur Town', 'Kumbakonam', 'Pattukkottai', 'Thiruvaiyaru'] },
  { name: 'Theni', towns: ['Theni Town', 'Periyakulam', 'Bodinayakanur', 'Cumbum'] },
  { name: 'Thoothukudi', towns: ['Thoothukudi Town', 'Tiruchendur', 'Kovilpatti', 'Sathankulam'] },
  { name: 'Tiruchirappalli', towns: ['Thillai Nagar', 'Srirangam', 'Cantonment', 'K.K. Nagar', 'Lalgudi'] },
  { name: 'Tirunelveli', towns: ['Tirunelveli Town', 'Palayamkottai', 'Ambasamudram', 'Nanguneri'] },
  { name: 'Tirupathur', towns: ['Tirupathur Town', 'Vaniyambadi', 'Ambur', 'Natrampalli'] },
  { name: 'Tiruppur', towns: ['Tiruppur Town', 'Avinashi', 'Dharapuram', 'Udumalaipettai'] },
  { name: 'Tiruvallur', towns: ['Tiruvallur Town', 'Avadi', 'Ponneri', 'Poonamallee'] },
  { name: 'Tiruvannamalai', towns: ['Tiruvannamalai Town', 'Arani', 'Cheyyar', 'Polur'] },
  { name: 'Tiruvarur', towns: ['Tiruvarur Town', 'Mannargudi', 'Thiruthuraipoondi', 'Nannilam'] },
  { name: 'Vellore', towns: ['Vellore Town', 'Katpadi', 'Gudiyattam', 'Pernambut'] },
  { name: 'Viluppuram', towns: ['Viluppuram Town', 'Tindivanam', 'Gingee', 'Vanur'] },
  { name: 'Virudhunagar', towns: ['Virudhunagar Town', 'Sivakasi', 'Rajapalayam', 'Aruppukkottai'] }
];

app.get('/api/districts', (req, res) => {
  const summary = ALL_38_DISTRICTS.map(d => {
    const activeCuts = reports.filter(r => r.district.toLowerCase() === d.name.toLowerCase() && r.type === 'cut' && r.status === 'active').length;
    const totalReports = reports.filter(r => r.district.toLowerCase() === d.name.toLowerCase()).length;
    const upcomingShutdowns = scheduledShutdowns.filter(s => s.district.toLowerCase() === d.name.toLowerCase()).length;
    
    return {
      name: d.name,
      towns: d.towns,
      activeCuts,
      totalReports,
      upcomingShutdowns,
      status: activeCuts === 0 ? 'Normal' : activeCuts > 2 ? 'High Outage' : 'Moderate Outage'
    };
  });

  res.json(summary);
});


app.get('/api/complaints', (req, res) => {
  res.json(complaints);
});

app.post('/api/complaints', (req, res) => {
  const { area, district, consumerNo, description, contactNo } = req.body;
  
  const newComplaint = {
    id: 'CMP-' + Math.floor(100000 + Math.random() * 900000),
    area: area || 'Unknown Area',
    district: district || 'Tamil Nadu',
    consumerNo: consumerNo || 'N/A',
    description: description || 'Power outage reported',
    contactNo: contactNo || 'N/A',
    timestamp: new Date().toISOString(),
    status: 'Logged with Minnagam 1912'
  };

  complaints.unshift(newComplaint);
  res.status(201).json(newComplaint);
});

app.post('/api/reports', (req, res) => {
  const { type, lat, lng, area, district, reason } = req.body;
  if (!lat || !lng) {
    return res.status(400).json({ error: 'Location required' });
  }

  const newReport = {
    id: 'rep-' + Date.now(),
    type: type || 'cut',
    area: area || 'Unknown Area',
    district: district || 'Tamil Nadu',
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    reason: reason || 'unspecified',
    timestamp: new Date().toISOString(),
    confirmations: 1,
    status: type === 'restored' ? 'resolved' : 'active'
  };

  reports.unshift(newReport);
  io.emit('new_report', newReport);
  res.status(201).json(newReport);
});

app.post('/api/reports/:id/confirm', (req, res) => {
  const report = reports.find(r => r.id === req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  report.confirmations += 1;
  io.emit('update_report', report);
  res.json(report);
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.emit('initial_data', reports);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`PowerPulse server running on port ${PORT}`);
});

