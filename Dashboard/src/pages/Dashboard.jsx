import React, { useEffect, useState } from 'react';
import { get, ref } from 'firebase/database';
import { IoIosMore } from 'react-icons/io';
import { Button, SparkLine } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import product9 from '../data/JR3.png';
import { SparklineAreaData } from '../data/dummy';
import { database } from '../firebaseConfig';

const Dashboard = () => {
  const { currentColor } = useStateContext();
  const [waterSavedValue, setWaterSavedValue] = useState('');
  const [activeSensors, setActiveSensors] = useState('38');
  const [fraudsDetected, setFraudsDetected] = useState('1');
  const [leaksDetected, setLeaksDetected] = useState('7');
  const [reportedComplaints, setReportedComplaints] = useState('4');

  useEffect(() => {
    const fetchValues = async () => {
      try {
        const waterSavedRef = ref(database, 'WaterSaved');
        const activeSensorsRef = ref(database, 'activeSensors');
        const fraudsDetectedRef = ref(database, 'fraudsDetected');
        const leaksDetectedRef = ref(database, 'leaksDetected');
        const reportedComplaintsRef = ref(database, 'reportedComplaints');

        const snapshot1 = await get(waterSavedRef);
        const snapshot2 = await get(activeSensorsRef);
        const snapshot3 = await get(fraudsDetectedRef);
        const snapshot4 = await get(leaksDetectedRef);
        const snapshot5 = await get(reportedComplaintsRef);

        if (snapshot1.exists()) {
          setWaterSavedValue(snapshot1.val());
        }
        if (snapshot2.exists()) {
          setActiveSensors(snapshot2.val());
        }
        if (snapshot3.exists()) {
          setFraudsDetected(snapshot3.val());
        }
        if (snapshot4.exists()) {
          setLeaksDetected(snapshot4.val());
        }
        if (snapshot5.exists()) {
          setReportedComplaints(snapshot5.val());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchValues();
  }, []);

  return (
    <div className="mt-24 px-4 md:px-6">
      {/* Hero Card and Stats */}
      <div className="flex flex-col lg:flex-row gap-4 justify-center">
        {/* Hero Card */}
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl w-full lg:w-80 p-6 md:p-8 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-500">Water Saved</p>
              <p className="text-2xl font-semibold">{waterSavedValue} liters</p>
            </div>
            <button
              type="button"
              style={{ backgroundColor: currentColor }}
              className="text-2xl opacity-90 text-white hover:shadow-lg rounded-full p-3 transition-all duration-200"
            >
              💧
            </button>
          </div>
          <div className="mt-6">
            <Button
              color="white"
              bgColor={currentColor}
              text="Download Report"
              borderRadius="10px"
              size="md"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <p className="text-2xl font-semibold">{leaksDetected}</p>
            <p className="text-sm text-gray-500 mt-1">Unsafe Water Sources</p>
          </div>

          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <p className="text-2xl font-semibold">{fraudsDetected}</p>
            <p className="text-sm text-gray-500 mt-1">Detected Outbreak Risks</p>
          </div>

          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <p className="text-2xl font-semibold">{reportedComplaints}</p>
            <p className="text-sm text-gray-500 mt-1">Reported Complaints</p>
          </div>

          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <p className="text-2xl font-semibold">{activeSensors}</p>
            <p className="text-sm text-gray-500 mt-1">Active Sensors</p>
          </div>
        </div>
      </div>

      {/* Power BI Section */}
      <div className="mt-8">
        <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-lg mb-4 border-l-4 border-blue-500 font-medium text-center">
          Live Detections are on! For help with any technical issue, please contact us at 7387026440
        </div>
        <div className="rounded-xl overflow-hidden shadow-lg">
          <iframe
            title="Report Section"
            className="w-full h-[500px] md:h-[800px]"
            src="https://app.powerbi.com/view?r=eyJrIjoiNjI0NDViMTgtM2QzMS00YzYzLTk4MDYtZWQyZmQzY2Y3ODg2IiwidCI6IjNmMzFkNjNkLWVkYzMtNDEzZS04N2U0LTQyMGU1M2ZkZDYyZiJ9"
            frameBorder="0"
            allowFullScreen={true}
          ></iframe>
        </div>
      </div>

      {/* Sparkline and App Card Section */}
      <div className="mt-8 flex flex-col lg:flex-row gap-6">
        {/* Sparkline Card */}
        <div 
          className="rounded-xl p-6 w-full lg:w-2/3 shadow-lg"
          style={{ backgroundColor: currentColor }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <p className="font-semibold text-white text-2xl">Leakage Detections</p>
              <p className="text-gray-200 mt-2">Monthly statistics</p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-2xl text-white font-semibold">930 liters</p>
              <p className="text-gray-200">Monthly Detects</p>
            </div>
          </div>
          <div className="mt-6">
            <SparkLine
              currentColor={currentColor}
              id="column-sparkLine"
              height="100px"
              type="Column"
              data={SparklineAreaData}
              width="100%"
              color="rgb(242, 252, 253)"
            />
          </div>
        </div>

        {/* App Download Card */}
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl p-6 w-full lg:w-1/3 shadow-lg flex flex-col">
          <img 
            className="w-full h-auto rounded-lg object-cover" 
            src={product9} 
            alt="App Screenshot" 
          />
          <div className="mt-6 flex-1 flex flex-col">
            <p className="font-semibold text-lg">Download Our App Today!</p>
            <p className="text-gray-500 text-sm">By Team Sirius3</p>
            <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm flex-1">
              A go-to solution for all your water management problems. Get real-time alerts and reports directly on your phone.
            </p>
            <Button
              color="white"
              bgColor={currentColor}
              text="Download App"
              borderRadius="8px"
              size="md"
              className="mt-6 w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;