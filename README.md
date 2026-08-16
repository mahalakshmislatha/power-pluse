# PowerPulse - Tamil Nadu Power Outage Tracker

## Problem Statement
Power outages across Tamil Nadu (both scheduled and unscheduled) often happen without immediate official updates, leaving residents unsure about the status, duration, and extent of the outage in their neighborhood. 

PowerPulse is a simple crowdsourced power outage tracker for Tamil Nadu. Citizens can report active power cuts or restorations with automatic location detection, view live status pins on an interactive map, track outage history, and check compensation eligibility based on TNERC rules.

## Getting Started

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Run Locally
From the root directory:
```bash
npm run dev
```

This starts:
- Server on `http://localhost:5000`
- Client on `http://localhost:5173`
