import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig'; // Adjust the path if necessary to point to your firebaseConfig

const ComplainsData = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const complaintsRef = ref(database, 'Complains'); // Ensure this matches your structure in Firebase
    onValue(complaintsRef, (snapshot) => {
      const data = snapshot.val();
      const complaintsList = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setComplaints(complaintsList);
    }, {
      onlyOnce: true // Fetch data only once; remove if you want real-time updates
    });
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl shadow-lg">
      {/* Header component removed for brevity */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Image</th>
              <th className="py-2 px-4 border-b">Location</th>
              <th className="py-2 px-4 border-b">Type</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{complaint.id}</td>
                <td className="py-2 px-4 border-b">{complaint.date}</td>
                <td className="py-2 px-4 border-b">{complaint.description}</td>
                <td className="py-2 px-4 border-b">
                  {complaint.imageUrl ? (
                    <img
                      src={complaint.imageUrl}
                      alt="Complaint"
                      style={{ width: '100px', height: 'auto' }}
                      onClick={() => window.open(complaint.imageUrl, '_blank')}
                      onError={(e) => { e.target.style.display = 'none'; }} // Hide the image if there's an error
                    />
                  ) : 'No image'}
                </td>
                <td className="py-2 px-4 border-b">{complaint.location}</td>
                <td className="py-2 px-4 border-b">{complaint.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplainsData;
