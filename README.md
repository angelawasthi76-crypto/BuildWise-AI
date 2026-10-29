# BuildWise AI
## AI-Powered Multimodal Construction Intelligence Platform

### 1. Project Overview

BuildWise AI is an AI-powered construction intelligence platform designed to support construction professionals with safety analysis, crack assessment, project planning, property valuation, construction-related questions, daily site planning, and weather-aware work advisories.

The platform uses a React frontend and a Python FastAPI backend. Groq provides AI-generated responses, while weather information is retrieved through the Open-Meteo services.

### 2. Project Features

1. **Construction Safety Analyzer:** Analyzes uploaded construction-site images to identify potential hazards, PPE concerns, risk severity, and recommended corrective actions.
2. **Crack Detection:** Analyzes uploaded images for visible cracks, their possible severity and causes, and the need for professional inspection.
3. **Project Planning:** Generates preliminary construction estimates, material quantities, costs in Indian rupees (INR), and schedules based on user-provided inputs.
4. **Property Valuation:** Estimates property value, price per square foot, rental potential, return on investment, and appreciation based on supplied details.
5. **Construction Chatbot:** Answers construction-related questions using an AI-powered chat interface.
6. **Daily Site Assistant:** Generates daily work plans, material and equipment requirements, safety checks, and potential site risks.
7. **Weather Advisory:** Uses weather information and planned construction activities to provide a weather-aware GO/NO-GO advisory.

### 3. Technology Stack

- **Frontend:** React and Vite
- **Backend:** Python and FastAPI
- **AI service:** Groq API
- **AI model:** Configured through the `GROQ_MODEL` environment variable
- **Weather data:** Open-Meteo geocoding and forecast services
- **HTTP requests:** HTTPX
- **Configuration:** Environment variables and Python dotenv

### 4. Project Structure

The project is organized into separate frontend and backend directories.

```text
construction-intelligence/
├── backend/
│   ├── main.py
│   ├── ai_service.py
│   ├── ai_routes.py
│   ├── safety_routes.py
│   ├── crack_routes.py
│   ├── planning_routes.py
│   ├── valuation_routes.py
│   ├── site_assistant_routes.py
│   ├── weather_routes.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   └── App.jsx
│   ├── package.json
│   └── ...
└── README.md
```

*Note: This structure documents the main files used by the project. Other supporting files may also be present.*

### 5. Setup and Execution

#### Prerequisites

- Python 3.11
- Node.js and npm
- A valid Groq API key
- Internet connectivity for AI requests and weather data

#### Backend Setup

Open a terminal in the project root:

```powershell
cd C:\Users\91999\construction-intelligence
.\backend\.venv\Scripts\Activate.ps1
cd backend
python -m uvicorn main:app --reload
```

The backend API runs at:

`http://localhost:8000`

API documentation:

`http://localhost:8000/docs`

Health check:

`http://localhost:8000/health`

Expected health response:

```json
{
  "status": "healthy"
}
```

#### Frontend Setup

Open a second terminal:

```powershell
cd C:\Users\91999\construction-intelligence\frontend
npm run dev
```

Open the frontend at:

`http://localhost:5173`

Keep both terminals running while using the application.

#### Production Build Verification

Run:

```powershell
cd C:\Users\91999\construction-intelligence\frontend
npm run build
```

The production build completed successfully during project verification.

### 6. Configuration and Security

The backend uses environment variables for configuration. The `.env` file should contain the required Groq API key and model setting.

Example configuration format:

```text
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=your_supported_model_id
```

Replace the example values locally with valid configuration. Never commit real API keys or other secrets to version control. Keep `.env` excluded through `.gitignore`.

### 7. API Endpoints

| Feature | Method | Endpoint |
|---|---|---|
| Health check | GET | `/health` |
| Construction chatbot | POST | `/api/ai/chat` |
| Safety analysis | POST | `/api/safety/analyze` |
| Crack analysis | POST | `/api/cracks/analyze` |
| Project planning | POST | `/api/planning/estimate` |
| Property valuation | POST | `/api/valuation/estimate` |
| Daily site assistant | POST | `/api/site-assistant/plan` |
| Weather advisory | POST | `/api/weather/advisory` |

### 8. Testing and Verification

The following basic functional checks were reported as successful during development:

- Construction Safety Analyzer returned analysis results for an uploaded image.
- Crack Detection returned analysis results for an uploaded image.
- Project Planning generated an estimate.
- Property Valuation returned valuation results.
- Construction Chatbot generated a construction-related response.
- Daily Site Assistant generated a daily work plan.
- Weather Advisory returned weather and safety advisory results.
- An invalid weather location produced a location-not-found error.
- The Project Planning working-hours field accepted `6` and generated an estimate after an input adjustment.
- The backend health endpoint returned a healthy status.
- The frontend production build completed successfully.
- The website loaded and all seven features were accessible.

These results represent basic functional verification, not exhaustive testing of every input, AI response, or deployment environment.

### 9. Limitations and Responsible Use

- AI-generated safety and crack assessments are preliminary observations, not certified engineering inspections.
- Structural concerns require assessment by a qualified structural engineer.
- Material quantities, construction costs, schedules, and property valuations are estimates that depend on input quality, assumptions, and local conditions.
- Rental returns and appreciation estimates are not guarantees of future performance.
- Weather forecasts can change and should be checked before site operations.
- GO/NO-GO advisories are decision-support guidance and must not replace site-specific safety procedures or professional judgment.
- AI responses may be incomplete or inaccurate and should be independently verified.
- Availability and reliability depend on external AI and weather services, network connectivity, and valid configuration.

### 10. Deployment Readiness

The project has been prepared for local demonstration and evaluation. The backend startup procedure has been verified, the frontend production build has succeeded, and the seven features have passed reported basic functional checks.

Before public deployment, additional work should include production server configuration, secure secret management, production CORS settings, HTTPS, monitoring, and testing in the intended hosting environment.

A successful local production build does not by itself confirm that the application has been deployed to a public server.

### 11. Future Enhancements

Potential future improvements within the platform's existing scope include:

- More comprehensive automated and edge-case testing.
- Improved validation and clearer error messages.
- Better accuracy evaluation using verified construction datasets.
- More robust AI response validation and fallback handling.
- Production deployment and monitoring.
- Improved documentation and reproducible setup instructions.
- Performance and reliability testing under concurrent use.

### 12. Conclusion

BuildWise AI brings seven construction-focused AI capabilities into a single web platform. The reported functional checks, backend health verification, and successful frontend production build provide a foundation for demonstration and evaluation. Further accuracy testing, security review, and deployment validation remain important before real-world production use.
