import React, { useState } from 'react';

const Pilferage = () => {
  const [file, setFile] = useState(null);
  const [pilferageData, setPilferageData] = useState({
    warning: [],
    high_risk: [],
    pilferage: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/pilferage', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setPilferageData(data);
    } catch (error) {
      alert('An error occurred while processing the file');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-8 p-4 border rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Upload CSV File:</h3>
      <form onSubmit={handleSubmit} className="mb-4">
        <input type="file" accept=".csv" onChange={handleFileChange} className="mr-2" />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Check Pilferage
        </button>
      </form>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="data-container">
          <div className="mb-4">
            <h4 className="text-md font-semibold">Warning Sensors:</h4>
            <ul className="list-disc ml-4">
              {pilferageData.warning.map((sensor, index) => (
                <li key={index}>{sensor}</li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <h4 className="text-md font-semibold">High Risk Sensors:</h4>
            <ul className="list-disc ml-4">
              {pilferageData.high_risk.map((sensor, index) => (
                <li key={index}>{sensor}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold">Pilferage Sensors:</h4>
            <ul className="list-disc ml-4">
              {pilferageData.pilferage.map((sensor, index) => (
                <li key={index}>{sensor}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pilferage;
