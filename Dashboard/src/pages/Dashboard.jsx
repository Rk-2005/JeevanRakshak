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
  const [fraudsDetected, setFraudsDetected] = useState('6');
  const [leaksDetected, setLeaksDetected] = useState('3');
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
    <div className="mt-24">
      <div className="flex flex-wrap lg:flex-nowrap justify-center ">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-400">Water Saved</p>
              <p className="text-2xl">{waterSavedValue} liters</p>
            </div>
            <button
              type="button"
              style={{ backgroundColor: currentColor }}
              className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full  p-4"
            >
              
            </button>
          </div>
          <div className="mt-6">
            <Button
              color="white"
              bgColor={currentColor}
              text="Download"
              borderRadius="10px"
            />
          </div>
        </div>

        <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
          <div className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl ">
            <p className="mt-3">
              <span className="text-lg font-semibold">{leaksDetected}</span>
            </p>
            <p className="text-sm text-gray-400 mt-1">Leak Detects</p>
          </div>

          <div className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl ">
            <p className="mt-3">
              <span className="text-lg font-semibold">{fraudsDetected}</span>
            </p>
            <p className="text-sm text-gray-400 mt-1">Fraud Detects</p>
          </div>

          <div className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl ">
            <p className="mt-3">
              <span className="text-lg font-semibold">{reportedComplaints}</span>
            </p>
            <p className="text-sm text-gray-400 mt-1">Reported Complaints</p>
          </div>

          <div className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl ">
            <p className="mt-3">
              <span className="text-lg font-semibold">{activeSensors}</span>
            </p>
            <p className="text-sm text-gray-400 mt-1">Active Sensors</p>
          </div>
        </div>
      </div>

      <div className="flex gap-10 flex-wrap justify-center">
        <div>
          <div className="bottom-text-container">
            Live Detections are on !! For help in any technical issue, please contact us at 7387026440
          </div>
          <iframe
            title="Report Section"
            width="100%"
            height="800"
            src="https://app.powerbi.com/view?r=eyJrIjoiNjI0NDViMTgtM2QzMS00YzYzLTk4MDYtZWQyZmQzY2Y3ODg2IiwidCI6IjNmMzFkNjNkLWVkYzMtNDEzZS04N2U0LTQyMGU1M2ZkZDYyZiJ9"
            frameBorder="0"
            allowFullScreen="true"
          ></iframe>

          <div
            className="rounded-2xl md:w-1200 p-4 m-3"
            style={{ backgroundColor: currentColor }}
          >
            <div className="flex justify-between items-center ">
              <p className="font-semibold text-white text-2xl">Leakage Detections</p>

              <div>
                <p className="text-2xl text-white font-semibold mt-8">930 liters</p>
                <p className="text-gray-200">Monthly Detects</p>
              </div>
            </div>

            <div className="mt-4">
              <SparkLine
                currentColor={currentColor}
                id="column-sparkLine"
                height="100px"
                type="Column"
                data={SparklineAreaData}
                width="320"
                color="rgb(242, 252, 253)"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center">
        <div className="w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
          <div className="mt-10">
            <img className="md:w-96 h-50 " src={product9} alt="" />
            <div className="mt-8">
              <p className="font-semibold text-lg">Download Our App Today !!</p>
              <p className="text-gray-400 ">By Team Sigma</p>
              <p className="mt-8 text-sm text-gray-400">
                A go-to solution for all your problems. Get the app today.
              </p>
              <div className="mt-3">
  <a href="https://github.com/Makarand-Tighare/Hack-it-Sapiens/tree/main/JalRakshak" target="_blank" rel="noopener noreferrer">
    <Button
      color="white"
      bgColor={currentColor}
      text="Read More"
      borderRadius="10px"
    />
  </a>
</div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
