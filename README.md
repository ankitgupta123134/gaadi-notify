# 🚗 GaadiNotify

### AI-Powered Vehicle Notification & Incident Management System

GaadiNotify is a privacy-first vehicle notification and incident management
platform that uses AI-powered number plate OCR and fuzzy matching to identify
registered vehicles and manage vehicle-related incidents.

The system is designed so that the person scanning a vehicle never gets
access to the vehicle owner's private contact information.

---

## ✨ Key Features

### 🤖 AI Number Plate Detection

- Upload a vehicle image from the Scan page.
- Tesseract.js OCR extracts number plate text.
- OCR output is normalized before matching.
- Fuzzy matching helps handle OCR mistakes and text variations.
- Matching confidence can be tracked for every detection.

### 🔐 Privacy-Safe Notification Workflow

- Vehicle owner's private contact information remains protected.
- The scanner does not receive the owner's phone number or personal details.
- Notification processing is handled by the backend.
- The system is designed to support external notification providers
  for production use.

### 📍 Evidence & Incident Tracking

Each incident can contain:

- Number plate
- Evidence/image
- Location
- OCR result
- Matching confidence
- Incident timestamp
- Incident status

### 📋 Incident History

Users can view previously created incidents and track their status.

Example statuses:

- Pending
- Matched
- Notified
- Resolved

### 👨‍💼 Admin Dashboard

Administrators can monitor application activity such as:

- Total incidents
- Registered vehicles
- Successful matches
- Notification activity
- Incident status
- Matching statistics

### 🔗 Retroactive Vehicle Linking

If an incident is created before a vehicle is registered, GaadiNotify can
later associate the existing incident with the newly registered vehicle when
a matching number plate is found.

This allows previously recorded incidents to remain useful even when the
vehicle was not registered at the time of the incident.

---

# 🧠 How GaadiNotify Works

```text
                    🚗 Vehicle
                        │
                        ▼
              Upload Vehicle Image
                        │
                        ▼
                 Tesseract.js OCR
                        │
                        ▼
                Text Normalization
                        │
                        ▼
                 Fuzzy Plate Matching
                        │
              ┌─────────┴─────────┐
              │                   │
            Match              No Match
              │                   │
              ▼                   ▼
       Find Registered       Return Result
          Vehicle
              │
              ▼
       Create / Update
          Incident
              │
              ▼
       Notification Workflow
              │
              ▼
       Scanner sees only
          the result