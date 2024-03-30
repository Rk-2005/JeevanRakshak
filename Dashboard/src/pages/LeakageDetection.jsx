import React, { useState } from 'react';

const LeakageDetection = () => {
  const [file, setFile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPredictions(data);
      if (data.some(prediction => prediction.leak_detected)) {
        setShowModal(true);
      }
    } catch (error) {
      alert('An error occurred while processing the file');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-8 p-4 border rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Upload Pressure Data CSV File:</h3>
      <form onSubmit={handleSubmit} className="mb-4">
        <input type="file" accept=".csv" onChange={handleFileChange} className="mr-2" />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Check Leak
        </button>
      </form>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full mx-auto">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Sensor Node</th>
              <th className="py-2 px-4 border-b">Leak Detected</th>
            </tr>
          </thead>
          <tbody>
            {predictions.sort((a, b) => b.leak_detected - a.leak_detected).map((prediction, index) => (
              <tr key={index} className={prediction.leak_detected ? 'bg-red-500 text-white' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-200')}>
                <td className="py-2 px-4 border-b">{prediction.sensor_node}</td>
                <td className="py-2 px-4 border-b">{prediction.leak_detected ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

{showModal && (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-4 rounded shadow-lg">
      <h2 className="text-lg font-bold">Leak Detected!</h2>
      <p>One or more sensor nodes have detected a leak.</p>
      <button onClick={() => setShowModal(false)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default LeakageDetection;
