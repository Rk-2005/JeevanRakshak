import React, { useState } from 'react';
import './WaterQuality.css';
import { FaUpload, FaSpinner } from 'react-icons/fa';
// import { BsFillBarChartFill } from 'react-icons/bs';

function WaterQuality() {
  const [file, setFile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selected = event.target.files[0];
    setFile(selected);
  };

  const handlePredict = () => {
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      fetch('http://127.0.0.1:5200/predict', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setPredictions(data.potability_prediction);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error:', error);
          setLoading(false);
        });
    }
  };

  return (
    <div className="WaterQuality">
      <header className="header">
        <h1><FaUpload /> Water Quality Prediction</h1>
      </header>
      <main className="main-content">
        <div className="file-upload">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="fileInput" className="file-input-label">Choose CSV File</label>
          <input type="file" id="fileInput" onChange={handleFileChange} aria-label="Upload CSV file" />
          <button type="button" className="predict-button" onClick={handlePredict}>
            {loading ? <FaSpinner className="spinner" /> : 'Predict Water Quality'}
          </button>
        </div>
        <div className="prediction">
          {predictions.length > 0 && (
            <div className="prediction-results">
              <h2>Prediction Results</h2>
              <table className="prediction-table">
                <thead>
                  <tr>
                    <th>Sample</th>
                    <th>Potability</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((potability, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{potability.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

    </div>
  );
}

export default WaterQuality;
