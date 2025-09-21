import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useStateContext } from '../contexts/ContextProvider';
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaTimes, FaBell } from 'react-icons/fa';

const AlertSystem = () => {

  const [alerts, setAlerts] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  // Mock alerts data
  const mockAlerts = [
    {
      id: 1,
      type: 'high_risk',
      title: 'High Outbreak Risk Detected',
      message: 'High outbreak risk detected in Village A. Unsafe water source found.',
      timestamp: new Date().toISOString(),
      priority: 'high',
      village: 'Village A',
      action: 'Immediate water testing required'
    },
    {
      id: 2,
      type: 'water_quality',
      title: 'Water Quality Alert',
      message: 'Bacterial count exceeds safe limits in Sensor Node C.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      priority: 'medium',
      village: 'Village C',
      action: 'Water treatment recommended'
    },
    {
      id: 3,
      type: 'sensor_offline',
      title: 'Sensor Offline',
      message: 'Sensor Node B has been offline for 2 hours.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      priority: 'low',
      village: 'Village B',
      action: 'Check sensor connectivity'
    },
    {
      id: 4,
      type: 'complaint_resolved',
      title: 'Complaint Resolved',
      message: 'Water supply issue in Village D has been resolved.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      priority: 'info',
      village: 'Village D',
      action: 'Issue closed'
    }
  ];

  useEffect(() => {
    // Simulate real-time alerts
    setAlerts(mockAlerts);
    setIsVisible(true);

    // Simulate new alerts coming in
    const interval = setInterval(() => {
      const newAlert = {
        id: Date.now(),
        type: 'water_quality',
        title: 'New Water Quality Alert',
        message: 'pH levels outside normal range detected.',
        timestamp: new Date().toISOString(),
        priority: 'medium',
        village: 'Village E',
        action: 'Monitor closely'
      };
      
      setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
    }, 300000); // New alert every 30 seconds for demo

    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'high_risk':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'water_quality':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'sensor_offline':
        return <FaInfoCircle className="text-blue-500" />;
      case 'complaint_resolved':
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const getAlertColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'info':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - alertTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return alertTime.toLocaleDateString();
  };

  if (!isVisible || alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full">
      <div className="space-y-3">
        {alerts.slice(0, 3).map((alert) => (
          <div
            key={alert.id}
            className={`border-l-4 p-4 rounded-lg shadow-lg ${getAlertColor(alert.priority)} animate-slide-in`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 mt-1">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {alert.title}
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    {alert.message}
                  </p>
                  <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>📍 {alert.village}</span>
                    <span>⏰ {formatTimestamp(alert.timestamp)}</span>
                  </div>
                  {alert.action && (
                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                      <strong>Action:</strong> {alert.action}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => dismissAlert(alert.id)}
                className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        
        {alerts.length > 3 && (
          <div className="text-center">
            <button
              onClick={() => setIsVisible(false)}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              View all {alerts.length} alerts
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertSystem;
