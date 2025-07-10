import React, { useState, useEffect } from "react";
import "./App.css";

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY

function App() {
  const [catData, setCatData] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [bannedAttributes, setBannedAttributes] = useState([]);
  const [catHistory, setCatHistory] = useState([]);

  const catNames = [
    "Buddy",
    "Max",
    "Bailey",
    "Charlie",
    "Lucy",
    "Cooper",
    "Lola",
    "Daisy",
    "Rocky",
    "Molly",
    "Stella",
    "Coco",
    "Ruby",
    "Bear",
    "Lily",
    "Zoe",
    "Milo",
    "Leo",
    "Oliver",
    "Luna",
  ];

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://api.thecatapi.com/v1/breeds?api_key=live_wQmCscUhr1yHW0I9X1ovKXfXnEfKYDoKkm6GcvD1ar3TZJZZqXHg4wk1VPH8N8VH",
        {
          headers: {
            "x-api-key": "ACCESS_KEY",
          },
        }
      );
      const data = await response.json();
      console.log(response);
      
      while (true) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const { reference_image_id, name, life_span, origin, weight } = data[randomIndex];
        const randomCatName = catNames[Math.floor(Math.random() * catNames.length)];

        const attributes = [name, life_span, origin, weight.imperial];
        if (attributes.some((attribute) => bannedAttributes.includes(attribute))) {
          // Skip this cat and find another
          continue;
        }

        // Attempt to load the cat
        const image = new Image();
        image.src = `https://cdn2.thecatapi.com/images/${reference_image_id}.jpg`;

        image.onload = () => {
          const catInfo = {
            reference_image_id,
            name,
            life_span,
            weight: weight.imperial,
            origin,
            randomName: randomCatName,
            timestamp: new Date().toLocaleString(),
          };
          
          setCatData(catInfo);
          
          // Add to history when a new cat is successfully loaded
          setCatHistory(prevHistory => [catInfo, ...prevHistory]);
        };

        image.onerror = () => {
          // Handle image error here
          console.error("Error loading image. Finding another cat.");
          // Find another cat
        };

        // Exit the loop once a cat with image is found
        break;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleBanAttribute = (attribute) => {
    if (!bannedAttributes.includes(attribute)) {
      setBannedAttributes([...bannedAttributes, attribute]);
    }
  };

  const handleRemoveBannedAttribute = (attribute) => {
    const updatedAttributes = bannedAttributes.filter((attr) => attr !== attribute);
    setBannedAttributes(updatedAttributes);
  };

  const clearHistory = () => {
    setCatHistory([]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="center-page">
        <h1>Veni Vici!</h1>
        <h3>Discover cats from your wildest dreams!</h3>
        <p id="cat-icon">🐱🐈😺</p>
        <br></br>
        <br></br>
        <div className="discover-container">
          {buttonClicked && catData !== null && (
            <div className="listening-container">
              <h2 className="cat-name">{catData.randomName}</h2>
              <div className="buttons">
                <button type="attribute" className="attribute-buttons" onClick={() => handleBanAttribute(catData.life_span)}>
                  {catData.life_span}
                </button>
                <button type="attribute" className="attribute-buttons" onClick={() => handleBanAttribute(catData.name)}>
                  {catData.name}
                </button>
                <button type="attribute" className="attribute-buttons" onClick={() => handleBanAttribute(catData.weight)}>
                  {catData.weight}
                </button>
                <button type="attribute" className="attribute-buttons" onClick={() => handleBanAttribute(catData.origin)}>
                  {catData.origin}
                </button>
                <br></br>
              </div>

              <img
                className="cat-pic"
                src={`https://cdn2.thecatapi.com/images/${catData.reference_image_id}.jpg`}
                alt="random image from Cat API"
                height="250px"
                width="250px"
              />
            </div>
          )}
          <br></br>
          <button
            type="discover"
            className="discover-btn"
            onClick={() => {
              fetchData();
              setButtonClicked(true);
            }}
          >
            🔀 Discover!
          </button>
        </div>
      </div>

      {/* History Section */}
      <div className="left-section">
        <div className="history-header">
          <h2>Who have we seen so far?</h2>
          {catHistory.length > 0 && (
            <button className="clear-history-btn" onClick={clearHistory}>
              Clear History
            </button>
          )}
        </div>
        <div className="history-container">
          {catHistory.length === 0 ? (
            <p className="no-history">No cats discovered yet! Click "Discover!" to start.</p>
          ) : (
            catHistory.map((cat, index) => (
              <div key={`${cat.reference_image_id}-${index}`} className="history-item">
                <img
                  src={`https://cdn2.thecatapi.com/images/${cat.reference_image_id}.jpg`}
                  alt={`${cat.randomName} - ${cat.name}`}
                  className="history-image"
                />
                <div className="history-info">
                  <h4>{cat.randomName}</h4>
                  <p className="history-breed">{cat.name} from {cat.origin}</p>
                  <p className="history-details">
                    {cat.life_span} • {cat.weight} lbs
                  </p>
                  <p className="history-time">{cat.timestamp}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="right-section">
        <h2>Ban List</h2>
        <p className="ban-list-description">
          Select an attribute in your listing to ban it
        </p>
        <div className="banned-attributes-container">
          {bannedAttributes.map((attribute) => (
            <button key={attribute} className="banned-attribute-buttons" onClick={() => handleRemoveBannedAttribute(attribute)}>
              {attribute}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
