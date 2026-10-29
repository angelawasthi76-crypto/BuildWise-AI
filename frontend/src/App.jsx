
import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Construction Safety Analyzer
  const [image, setImage] = useState(null);
  const [safetyResult, setSafetyResult] = useState(null);
  const [safetyLoading, setSafetyLoading] = useState(false);
  const [safetyError, setSafetyError] = useState("");

  // Crack Detection
  const [crackImage, setCrackImage] = useState(null);
  const [crackResult, setCrackResult] = useState(null);
  const [crackLoading, setCrackLoading] = useState(false);
  const [crackError, setCrackError] = useState("");

  
  // Project Planning
  const [planningForm, setPlanningForm] = useState({
    project_type: "Residential house",
    area_sqft: "1200",
    floors: "1",
    finish_quality: "Standard",
    location: "Indore, Madhya Pradesh, India",
  });

  const [planningResult, setPlanningResult] = useState(null);
  const [planningLoading, setPlanningLoading] = useState(false);
  const [planningError, setPlanningError] = useState("");

  
  // Property Valuation
  const [valuationForm, setValuationForm] = useState({
    property_type: "Residential apartment",
    area_sqft: "1200",
    location: "Indore, Madhya Pradesh, India",
    property_age_years: "5",
    condition: "Good",
    purchase_price_inr: "4500000",
  });

  const [valuationResult, setValuationResult] = useState(null);
  const [valuationLoading, setValuationLoading] = useState(false);
  const [valuationError, setValuationError] = useState("");


  // Daily Site Assistant
  const [siteAssistantForm, setSiteAssistantForm] = useState({
    project_name: "Residential Building",
    location: "Indore, Madhya Pradesh",
    construction_stage: "Brickwork",
    planned_activities: "Complete brickwork on the ground floor and prepare mortar.",
    workforce_count: "8",
    working_hours: "8",
  });
  const [siteAssistantResult, setSiteAssistantResult] = useState(null);
  const [siteAssistantLoading, setSiteAssistantLoading] = useState(false);
  const [siteAssistantError, setSiteAssistantError] = useState("");

  // Weather-Aware Construction Advisory
  const [weatherForm, setWeatherForm] = useState({
    location: "Indore",
    activity: "Working on scaffolding and concrete pouring",
  });
  const [weatherResult, setWeatherResult] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");




  async function sendMessage(event) {
    event.preventDefault();

    const question = message.trim();
    if (!question || loading) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", text: question },
    ]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/ai/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: question }),
        }
      );

      if (!response.ok) {
        throw new Error("The server could not answer your question.");
      }

      const data = await response.json();

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: data.answer,
          safetyNote: data.safety_note,
        },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: error.message || "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function analyzeSafety(event) {
    event.preventDefault();

    if (!image || safetyLoading) return;

    setSafetyLoading(true);
    setSafetyError("");
    setSafetyResult(null);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch(
        "http://127.0.0.1:8000/api/safety/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Safety analysis failed. Please try again."
        );
      }

      setSafetyResult(data);
    } catch (error) {
      setSafetyError(
        error.message || "Could not connect to the safety analysis API."
      );
    } finally {
      setSafetyLoading(false);
    }
  }

  function handleImageChange(event) {
    const selected = event.target.files?.[0] || null;

    setImage(selected);
    setSafetyResult(null);
    setSafetyError("");
  }

  async function analyzeCracks(event) {
    event.preventDefault();

    if (!crackImage || crackLoading) return;

    setCrackLoading(true);
    setCrackError("");
    setCrackResult(null);

    try {
      const formData = new FormData();
      formData.append("image", crackImage);

      const response = await fetch(
        "http://127.0.0.1:8000/api/cracks/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Crack analysis failed. Please try again."
        );
      }

      setCrackResult(data);
    } catch (error) {
      setCrackError(
        error.message || "Could not connect to the crack detection API."
      );
    } finally {
      setCrackLoading(false);
    }
  }

  function handleCrackImageChange(event) {
    const selected = event.target.files?.[0] || null;

    setCrackImage(selected);
    setCrackResult(null);
    setCrackError("");
  }
  
  async function generatePlan(event) {
    event.preventDefault();

    if (planningLoading) return;

    setPlanningLoading(true);
    setPlanningError("");
    setPlanningResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/planning/estimate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...planningForm,
            area_sqft: Number(planningForm.area_sqft),
            floors: Number(planningForm.floors),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Project planning failed. Please try again."
        );
      }

      setPlanningResult(data);
    } catch (error) {
      setPlanningError(
        error.message || "Could not connect to the Project Planning API."
      );
    } finally {
      setPlanningLoading(false);
    }
  }
  
  async function estimateProperty(event) {
    event.preventDefault();

    if (valuationLoading) return;

    setValuationLoading(true);
    setValuationError("");
    setValuationResult(null);

    try {
      const purchasePrice = valuationForm.purchase_price_inr.trim();

      const response = await fetch(
        "http://127.0.0.1:8000/api/valuation/estimate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...valuationForm,
            area_sqft: Number(valuationForm.area_sqft),
            property_age_years: Number(
              valuationForm.property_age_years
            ),
            purchase_price_inr: purchasePrice
              ? Number(purchasePrice)
              : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Property valuation failed. Please try again."
        );
      }

      setValuationResult(data);
    } catch (error) {
      setValuationError(
        error.message || "Could not connect to the Property Valuation API."
      );
    } finally {
      setValuationLoading(false);
    }
  }



  async function generateSitePlan(event) {
    event.preventDefault();

    if (siteAssistantLoading) return;

    setSiteAssistantLoading(true);
    setSiteAssistantError("");
    setSiteAssistantResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/site-assistant/plan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...siteAssistantForm,
            workforce_count: Number(siteAssistantForm.workforce_count),
            working_hours: Number(siteAssistantForm.working_hours),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Daily site plan generation failed. Please check your inputs and try again."
        );
      }

      setSiteAssistantResult(data);
    } catch (error) {
      setSiteAssistantError(
        error.message || "Could not connect to the Daily Site Assistant API."
      );
    } finally {
      setSiteAssistantLoading(false);
    }
  }

  async function checkWeatherAdvisory(event) {
    event.preventDefault();

    if (weatherLoading) return;

    setWeatherLoading(true);
    setWeatherError("");
    setWeatherResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/weather/advisory",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: weatherForm.location.trim(),
            activity: weatherForm.activity.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Weather advisory failed. Please try again."
        );
      }

      setWeatherResult(data);
    } catch (error) {
      setWeatherError(
        error.message || "Could not connect to the Weather Advisory API."
      );
    } finally {
      setWeatherLoading(false);
    }
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>🏗️ BuildWise AI</h1>
        <p>Your AI-powered construction intelligence platform</p>
      </header>

      {/* Construction Chatbot */}
      <section className="chat-panel">
        <div className="messages">
          {messages.length === 0 && (
            <div className="welcome">
              <h2>Construction Chatbot</h2>
              <p>
                Ask about construction materials, methods, or site safety.
              </p>
            </div>
          )}

          {messages.map((item, index) => (
            <div
              className={`message ${item.role}`}
              key={`${item.role}-${index}`}
            >
              <strong>
                {item.role === "user" ? "You" : "BuildWise AI"}
              </strong>
              <p>{item.text}</p>

              {item.safetyNote && (
                <div className="safety-note">
                  <strong>Safety note</strong>
                  <p>{item.safetyNote}</p>
                </div>
              )}
            </div>
          ))}

          {loading && <p className="loading">Thinking...</p>}
        </div>

        <form className="chat-form" onSubmit={sendMessage}>
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Ask a construction question..."
            maxLength={2000}
            aria-label="Your construction question"
          />
          <button type="submit" disabled={loading || !message.trim()}>
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </section>

      {/* Construction Safety Analyzer */}
      <section className="safety-panel">
        <div className="section-heading">
          <h2>Construction Safety Analysis</h2>
          <p>
            Upload a construction-site image to identify visible hazards,
            PPE observations, and recommended corrective actions.
          </p>
        </div>

        <form className="upload-form" onSubmit={analyzeSafety}>
          <label htmlFor="safety-image">Construction-site image</label>
          <input
            id="safety-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
          />

          {image && <p className="file-name">Selected: {image.name}</p>}

          <button
            className="analyze-button"
            type="submit"
            disabled={!image || safetyLoading}
          >
            {safetyLoading ? "Analyzing image..." : "Analyze Safety"}
          </button>
        </form>

        {safetyError && (
          <div className="error-message" role="alert">
            {safetyError}
          </div>
        )}

        {safetyResult && (
          <div className="safety-results">
            <h3>Analysis Results</h3>

            <div className="risk-summary">
              <strong>Overall risk:</strong>{" "}
              <span>{safetyResult.overall_risk}</span>
            </div>

            <h4>Visible Hazards</h4>
            {safetyResult.hazards?.length ? (
              <ul>
                {safetyResult.hazards.map((item, index) => (
                  <li key={index}>
                    <strong>{item.hazard}</strong>
                    <span className="severity">
                      Severity: {item.severity}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hazards were identified in the returned analysis.</p>
            )}

            <h4>PPE Observations</h4>
            <ul>
              {safetyResult.ppe_observations?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h4>Corrective Actions</h4>
            <ul>
              {safetyResult.corrective_actions?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h4>Limitations</h4>
            <ul>
              {safetyResult.limitations?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <p className="disclaimer">
              This is a preliminary AI-assisted assessment, not a certified
              safety inspection. Have a qualified safety professional verify
              findings before making safety-critical decisions.
            </p>
          </div>
        )}
      </section>

      {/* Crack Detection */}
      <section className="safety-panel crack-panel">
        <div className="section-heading">
          <h2>Concrete Crack Detection</h2>
          <p>
            Upload a clear, close-up image of a suspected crack in a wall,
            beam, slab, or other structural element.
          </p>
        </div>

        <form className="upload-form" onSubmit={analyzeCracks}>
          <label htmlFor="crack-image">Crack image</label>
          <input
            id="crack-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleCrackImageChange}
          />

          {crackImage && (
            <p className="file-name">
              Selected: {crackImage.name}
            </p>
          )}

          <button
            className="analyze-button"
            type="submit"
            disabled={!crackImage || crackLoading}
          >
            {crackLoading ? "Analyzing crack..." : "Analyze Cracks"}
          </button>
        </form>

        {crackError && (
          <div className="error-message" role="alert">
            {crackError}
          </div>
        )}

        {crackResult && (
          <div className="safety-results crack-results">
            <h3>Crack Analysis Results</h3>

            <p>
              <strong>Crack type:</strong>{" "}
              {crackResult.crack_type || "Uncertain"}
            </p>

            <p>
              <strong>Apparent severity:</strong>{" "}
              {crackResult.apparent_severity || "Uncertain"}
            </p>

            <h4>Observations</h4>
            {crackResult.observations?.length ? (
              <ul>
                {crackResult.observations.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No observations were returned.</p>
            )}

            <h4>Possible Causes</h4>
            {crackResult.possible_causes?.length ? (
              <ul>
                {crackResult.possible_causes.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No possible causes were returned.</p>
            )}

            <h4>Recommended Actions</h4>
            {crackResult.recommended_actions?.length ? (
              <ul>
                {crackResult.recommended_actions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No recommended actions were returned.</p>
            )}

            <div className="risk-summary">
              <strong>Professional inspection:</strong>{" "}
              <span>
                {crackResult.professional_inspection_required === true
                  ? "Recommended / required"
                  : "Not flagged by the AI assessment"}
              </span>
            </div>

            <h4>Assessment Limitations</h4>
            {crackResult.limitations?.length ? (
              <ul>
                {crackResult.limitations.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>
                Image-based analysis cannot confirm structural integrity.
              </p>
            )}

            <p className="disclaimer">
              This is a preliminary visual AI assessment, not a structural
              engineering diagnosis. A result that does not flag professional
              inspection does not establish that a structure is safe. If a
              crack is widening, deep, recurring, or associated with movement
              or deformation, seek assessment by a qualified structural
              engineer.
            </p>
          </div>
        )}
      </section>

      
      {/* Project Planning */}
      <section className="safety-panel planning-panel">
        <div className="section-heading">
          <h2>Project Planning & Cost Estimation</h2>
          <p>
            Enter your project details to estimate materials, construction
            costs in INR, project duration, and a conceptual building design.
          </p>
        </div>

        <form className="upload-form" onSubmit={generatePlan}>
          <label htmlFor="project-type">Project type</label>
          <select
            id="project-type"
            value={planningForm.project_type}
            onChange={(event) =>
              setPlanningForm({
                ...planningForm,
                project_type: event.target.value,
              })
            }
            required
          >
            <option value="Residential house">Residential house</option>
            <option value="Apartment building">Apartment building</option>
            <option value="Commercial building">Commercial building</option>
            <option value="Warehouse">Warehouse</option>
          </select>

          <label htmlFor="area-sqft">Total built-up area (sq ft)</label>
          <input
            id="area-sqft"
            type="number"
            min="100"
            max="1000000"
            step="1"
            value={planningForm.area_sqft}
            onChange={(event) =>
              setPlanningForm({
                ...planningForm,
                area_sqft: event.target.value,
              })
            }
            required
          />

          <label htmlFor="floors">Number of floors</label>
          <input
            id="floors"
            type="number"
            min="1"
            max="100"
            step="1"
            value={planningForm.floors}
            onChange={(event) =>
              setPlanningForm({
                ...planningForm,
                floors: event.target.value,
              })
            }
            required
          />

          <label htmlFor="finish-quality">Finish quality</label>
          <select
            id="finish-quality"
            value={planningForm.finish_quality}
            onChange={(event) =>
              setPlanningForm({
                ...planningForm,
                finish_quality: event.target.value,
              })
            }
            required
          >
            <option value="Basic">Basic</option>
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
          </select>

          <label htmlFor="project-location">Project location</label>
          <input
            id="project-location"
            type="text"
            maxLength={150}
            value={planningForm.location}
            onChange={(event) =>
              setPlanningForm({
                ...planningForm,
                location: event.target.value,
              })
            }
            required
          />

          <button
            className="analyze-button"
            type="submit"
            disabled={planningLoading}
          >
            {planningLoading ? "Generating plan..." : "Generate Project Plan"}
          </button>
        </form>

        {planningError && (
          <div className="error-message" role="alert">
            {planningError}
          </div>
        )}

        {planningResult && (
          <div className="safety-results">
            <h3>Project Planning Results</h3>

            <p>{planningResult.project_summary}</p>

            <h4>Estimated Materials</h4>
            {planningResult.estimated_materials?.length ? (
              <ul>
                {planningResult.estimated_materials.map((item, index) => (
                  <li key={index}>
                    <strong>{item.material}</strong>: {item.quantity}{" "}
                    {item.unit}
                    {item.notes && <p>{item.notes}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No material estimates were returned.</p>
            )}

            <h4>Estimated Costs</h4>
            <ul>
              <li>
                Materials: ₹
                {Number(
                  planningResult.estimated_costs?.materials_inr || 0
                ).toLocaleString("en-IN")}
              </li>
              <li>
                Labour: ₹
                {Number(
                  planningResult.estimated_costs?.labour_inr || 0
                ).toLocaleString("en-IN")}
              </li>
              <li>
                Other costs: ₹
                {Number(
                  planningResult.estimated_costs?.other_costs_inr || 0
                ).toLocaleString("en-IN")}
              </li>
              <li>
                <strong>
                  Total estimated cost: ₹
                  {Number(
                    planningResult.estimated_costs?.total_estimated_inr || 0
                  ).toLocaleString("en-IN")}
                </strong>
              </li>
            </ul>

            {planningResult.estimated_costs?.cost_assumptions?.length > 0 && (
              <>
                <h4>Cost Assumptions</h4>
                <ul>
                  {planningResult.estimated_costs.cost_assumptions.map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    )
                  )}
                </ul>
              </>
            )}

            <h4>Project Schedule</h4>
            {planningResult.project_schedule?.length ? (
              <ul>
                {planningResult.project_schedule.map((item, index) => (
                  <li key={index}>
                    <strong>{item.phase}</strong> —{" "}
                    {item.estimated_duration_days} days
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No schedule was returned.</p>
            )}

            <h4>Conceptual Building Description</h4>
            <p>{planningResult.conceptual_visualization}</p>

            <h4>Assumptions and Limitations</h4>
            <ul>
              {planningResult.assumptions_and_limitations?.map(
                (item, index) => (
                  <li key={index}>{item}</li>
                )
              )}
            </ul>

            <p className="disclaimer">
              These are preliminary AI-generated estimates, not verified
              quotations or construction drawings. Have qualified
              professionals verify quantities, local prices, structural
              design, and the project schedule before construction.
            </p>
          </div>
        )}
      </section>

      
      {/* Property Valuation */}
      <section className="safety-panel valuation-panel">
        <div className="section-heading">
          <h2>Property Valuation</h2>
          <p>
            Estimate property value, rental potential, rental yield,
            ROI, and potential five-year appreciation.
          </p>
        </div>

        <form className="upload-form" onSubmit={estimateProperty}>
          <label htmlFor="valuation-type">Property type</label>
          <select
            id="valuation-type"
            value={valuationForm.property_type}
            onChange={(event) =>
              setValuationForm({
                ...valuationForm,
                property_type: event.target.value,
              })
            }
            required
          >
            <option value="Residential apartment">Residential apartment</option>
            <option value="Independent house">Independent house</option>
            <option value="Residential plot">Residential plot</option>
            <option value="Commercial property">Commercial property</option>
          </select>

          <label htmlFor="valuation-area">Property area (sq ft)</label>
          <input
            id="valuation-area"
            type="number"
            min="1"
            max="1000000"
            step="any"
            value={valuationForm.area_sqft}
            onChange={(event) =>
              setValuationForm({
                ...valuationForm,
                area_sqft: event.target.value,
              })
            }
            required
          />

          <label htmlFor="valuation-location">Property location</label>
          <input
            id="valuation-location"
            type="text"
            maxLength={150}
            value={valuationForm.location}
            onChange={(event) =>
              setValuationForm({
                ...valuationForm,
                location: event.target.value,
              })
            }
            required
          />

          <label htmlFor="valuation-age">Property age (years)</label>
          <input
            id="valuation-age"
            type="number"
            min="0"
            max="300"
            step="1"
            value={valuationForm.property_age_years}
            onChange={(event) =>
              setValuationForm({
                ...valuationForm,
                property_age_years: event.target.value,
              })
            }
            required
          />

          <label htmlFor="valuation-condition">Property condition</label>
          <select
            id="valuation-condition"
            value={valuationForm.condition}
            onChange={(event) =>
              setValuationForm({
                ...valuationForm,
                condition: event.target.value,
              })
            }
            required
          >
            <option value="Poor">Poor</option>
            <option value="Average">Average</option>
            <option value="Good">Good</option>
            <option value="Excellent">Excellent</option>
          </select>

          <label htmlFor="purchase-price">
            Purchase price in INR (optional)
          </label>
          <input
            id="purchase-price"
            type="number"
            min="0.01"
            max="100000000000"
            step="any"
            value={valuationForm.purchase_price_inr}
            onChange={(event) =>
              setValuationForm({
                ...valuationForm,
                purchase_price_inr: event.target.value,
              })
            }
            placeholder="Enter purchase price to estimate ROI"
          />

          <button
            className="analyze-button"
            type="submit"
            disabled={valuationLoading}
          >
            {valuationLoading
              ? "Estimating property..."
              : "Estimate Property Value"}
          </button>
        </form>

        {valuationError && (
          <div className="error-message" role="alert">
            {valuationError}
          </div>
        )}

        {valuationResult && (
          <div className="safety-results">
            <h3>Property Valuation Results</h3>

            <p>{valuationResult.property_summary}</p>

            <div className="risk-summary">
              <strong>Estimated property value:</strong>{" "}
              <span>
                ₹
                {Number(
                  valuationResult.estimated_property_value_inr
                ).toLocaleString("en-IN")}
              </span>
            </div>

            <h4>Property Price</h4>
            <p>
              <strong>Estimated price per sq ft:</strong>{" "}
              ₹
              {Number(
                valuationResult.estimated_price_per_sqft_inr
              ).toLocaleString("en-IN")}
            </p>

            <h4>Rental Potential</h4>
            <p>
              <strong>Monthly rent:</strong>{" "}
              ₹
              {Number(
                valuationResult.estimated_monthly_rent_inr
              ).toLocaleString("en-IN")}
            </p>
            <p>
              <strong>Annual rent:</strong>{" "}
              ₹
              {Number(
                valuationResult.estimated_annual_rent_inr
              ).toLocaleString("en-IN")}
            </p>
            <p>
              <strong>Gross rental yield:</strong>{" "}
              {valuationResult.estimated_gross_rental_yield_percent}%
            </p>

            <h4>Return on Investment (ROI)</h4>
            <p>
              <strong>Estimated rental-based ROI:</strong>{" "}
              {valuationResult.estimated_roi_percent == null
                ? "Not available — enter a purchase price to estimate ROI."
                : `${valuationResult.estimated_roi_percent}%`}
            </p>
            {valuationResult.roi_basis && (
              <p>{valuationResult.roi_basis}</p>
            )}

            <h4>Potential Appreciation</h4>
            <p>
              <strong>Annual appreciation assumption:</strong>{" "}
              {valuationResult.appreciation
                ?.annual_appreciation_percent ?? "Not provided"}%
            </p>
            <p>
              <strong>Estimated value after five years:</strong>{" "}
              {valuationResult.appreciation
                ?.estimated_value_after_5_years_inr == null
                ? "Not available"
                : `₹${Number(
                    valuationResult.appreciation
                      .estimated_value_after_5_years_inr
                  ).toLocaleString("en-IN")}`}
            </p>
            {valuationResult.appreciation?.assumptions && (
              <p>{valuationResult.appreciation.assumptions}</p>
            )}

            <h4>Valuation Assumptions</h4>
            <ul>
              {valuationResult.valuation_assumptions?.map(
                (item, index) => (
                  <li key={index}>{item}</li>
                )
              )}
            </ul>

            <p className="disclaimer">
              This is a preliminary AI-generated estimate, not a certified
              property valuation or a guaranteed investment return. Market
              prices and rents have not been independently verified.
              Consult a qualified valuation professional and check recent
              local comparable sales before making financial decisions.
            </p>
          </div>
        )}
      </section>

      {/* Daily Site Assistant */}
      <section className="safety-panel site-assistant-panel">
        <div className="section-heading">
          <h2>Daily Site Assistant</h2>
          <p>
            Create a preliminary daily site plan with tasks, materials,
            equipment, safety checks, potential risks, and an end-of-day checklist.
          </p>
        </div>

        <form className="upload-form" onSubmit={generateSitePlan}>
          <label htmlFor="site-project-name">Project name</label>
          <input
            id="site-project-name"
            type="text"
            minLength={2}
            maxLength={150}
            value={siteAssistantForm.project_name}
            onChange={(event) =>
              setSiteAssistantForm({
                ...siteAssistantForm,
                project_name: event.target.value,
              })
            }
            required
          />

          <label htmlFor="site-location">Site location</label>
          <input
            id="site-location"
            type="text"
            minLength={2}
            maxLength={150}
            value={siteAssistantForm.location}
            onChange={(event) =>
              setSiteAssistantForm({
                ...siteAssistantForm,
                location: event.target.value,
              })
            }
            required
          />

          <label htmlFor="site-stage">Construction stage</label>
          <input
            id="site-stage"
            type="text"
            minLength={2}
            maxLength={150}
            value={siteAssistantForm.construction_stage}
            onChange={(event) =>
              setSiteAssistantForm({
                ...siteAssistantForm,
                construction_stage: event.target.value,
              })
            }
            required
          />

          <label htmlFor="site-activities">Planned activities</label>
          <textarea
            id="site-activities"
            rows={4}
            minLength={5}
            maxLength={3000}
            value={siteAssistantForm.planned_activities}
            onChange={(event) =>
              setSiteAssistantForm({
                ...siteAssistantForm,
                planned_activities: event.target.value,
              })
            }
            required
          />

          <label htmlFor="site-workforce">Workforce count</label>
          <input
            id="site-workforce"
            type="number"
            min="1"
            max="10000"
            step="1"
            value={siteAssistantForm.workforce_count}
            onChange={(event) =>
              setSiteAssistantForm({
                ...siteAssistantForm,
                workforce_count: event.target.value,
              })
            }
            required
          />

          <label htmlFor="site-working-hours">Working hours per day</label>
          <input
            id="site-working-hours"
            type="number"
            min="1"
            max="24"
            step="1"
            value={siteAssistantForm.working_hours}
            onChange={(event) =>
              setSiteAssistantForm({
                ...siteAssistantForm,
                working_hours: event.target.value,
              })
            }
            required
          />

          <button
            className="analyze-button"
            type="submit"
            disabled={siteAssistantLoading}
          >
            {siteAssistantLoading ? "Generating daily plan..." : "Generate Daily Site Plan"}
          </button>
        </form>

        {siteAssistantError && (
          <div className="error-message" role="alert">
            {siteAssistantError}
          </div>
        )}

        {siteAssistantResult && (
          <div className="safety-results site-assistant-results">
            <h3>Daily Site Plan</h3>
            <p>{siteAssistantResult.daily_summary}</p>

            <h4>Tasks</h4>
            {siteAssistantResult.tasks?.length ? (
              <ul>
                {siteAssistantResult.tasks.map((item, index) => (
                  <li key={index}>
                    <strong>{item.task}</strong> — Priority: {item.priority}
                    <p>Suggested duration: {item.suggested_duration_hours} hours</p>
                    <p>{item.instructions}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tasks were returned.</p>
            )}

            <h4>Required Materials</h4>
            {siteAssistantResult.required_materials?.length ? (
              <ul>
                {siteAssistantResult.required_materials.map((item, index) => (
                  <li key={index}>
                    <strong>{item.material}</strong>: {item.estimated_quantity}
                    <p>{item.purpose}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No materials were returned.</p>
            )}

            <h4>Required Equipment</h4>
            {siteAssistantResult.required_equipment?.length ? (
              <ul>
                {siteAssistantResult.required_equipment.map((item, index) => (
                  <li key={index}>
                    <strong>{item.equipment}</strong>: {item.purpose}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No equipment was returned.</p>
            )}

            <h4>Safety Checks</h4>
            {siteAssistantResult.safety_checks?.length ? (
              <ul>
                {siteAssistantResult.safety_checks.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No safety checks were returned.</p>
            )}

            <h4>Potential Risks</h4>
            {siteAssistantResult.potential_risks?.length ? (
              <ul>
                {siteAssistantResult.potential_risks.map((item, index) => (
                  <li key={index}>
                    <strong>{item.risk}</strong> — Severity: {item.severity}
                    <p>Preventive action: {item.preventive_action}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No risks were returned.</p>
            )}

            <h4>End-of-Day Checklist</h4>
            {siteAssistantResult.end_of_day_checklist?.length ? (
              <ul>
                {siteAssistantResult.end_of_day_checklist.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No checklist items were returned.</p>
            )}

            <p className="disclaimer">
              This is a preliminary AI-generated plan. Verify quantities and
              activities against approved drawings, actual site conditions,
              professional supervision, and applicable site safety procedures.
            </p>
          </div>
        )}
      </section>

      {/* Weather-Aware Construction Advisory */}
      <section className="safety-panel weather-panel">
        <div className="section-heading">
          <h2>Weather-Aware GO / NO-GO Advisory</h2>
          <p>
            Check current weather conditions and get a preliminary risk advisory
            for your planned outdoor construction activity.
          </p>
        </div>

        <form className="upload-form" onSubmit={checkWeatherAdvisory}>
          <label htmlFor="weather-location">Site location (city or town)</label>
          <input
            id="weather-location"
            type="text"
            minLength={2}
            maxLength={120}
            value={weatherForm.location}
            onChange={(event) =>
              setWeatherForm({ ...weatherForm, location: event.target.value })
            }
            placeholder="e.g. Indore"
            required
          />

          <label htmlFor="weather-activity">Planned construction activity</label>
          <textarea
            id="weather-activity"
            rows={3}
            minLength={3}
            maxLength={300}
            value={weatherForm.activity}
            onChange={(event) =>
              setWeatherForm({ ...weatherForm, activity: event.target.value })
            }
            placeholder="e.g. Roof work, scaffolding, concrete pouring"
            required
          />

          <button
            className="analyze-button"
            type="submit"
            disabled={weatherLoading}
          >
            {weatherLoading ? "Checking weather and risks..." : "Check Weather & Safety"}
          </button>
        </form>

        {weatherError && (
          <div className="error-message" role="alert">
            {weatherError}
          </div>
        )}

        {weatherResult && (
          <div className="safety-results weather-results">
            <h3>Weather Advisory Results</h3>
            <div className="risk-summary">
              <strong>Decision:</strong>{" "}
              <span>{String(weatherResult.decision || "CAUTION").toUpperCase()}</span>
            </div>
            <p>
              <strong>Location:</strong> {weatherResult.location || weatherForm.location}
            </p>
            {weatherResult.summary && <p>{weatherResult.summary}</p>}

            <h4>Weather Conditions</h4>
            {weatherResult.weather_conditions?.length ? (
              <ul>
                {weatherResult.weather_conditions.map((item, index) => (
                  <li key={index}>
                    <strong>{item.condition}</strong>
                    {item.observed_value && <> — {item.observed_value}</>}
                    {item.construction_risk && <p>{item.construction_risk}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No detailed weather conditions were returned.</p>
            )}

            <h4>Reasons</h4>
            {weatherResult.reasons?.length ? (
              <ul>
                {weatherResult.reasons.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            ) : (
              <p>No specific reasons were returned.</p>
            )}

            <h4>Safety Recommendations</h4>
            {weatherResult.safety_recommendations?.length ? (
              <ul>
                {weatherResult.safety_recommendations.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            ) : (
              <p>No safety recommendations were returned.</p>
            )}

            <h4>Limitations</h4>
            {weatherResult.limitations?.length ? (
              <ul>
                {weatherResult.limitations.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            ) : (
              <p>Forecast conditions and local site requirements may not be fully represented.</p>
            )}

            <p className="disclaimer">
              Weather source: {weatherResult.weather_source || "Open-Meteo"}.
              This is a preliminary AI advisory, not an official weather warning
              or a substitute for site-specific procedures and the responsible
              safety officer's decision. Check official alerts and actual
              conditions before starting work.
            </p>
          </div>
        )}
      </section>


    </main>
  );
}

export default App;
