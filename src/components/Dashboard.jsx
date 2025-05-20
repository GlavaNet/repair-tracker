import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Dashboard = () => {
  const { requests, divisions } = useContext(AppContext);

  // Get counts for dashboard
  const openRequestsCount = requests.filter(req => req.dateCompleted === null).length;
  const awaitingPartsCount = requests.filter(req => req.status === 'Awaiting Parts').length;
  const completedThisWeek = requests.filter(req => {
    if (!req.dateCompleted) return false;
    const completedDate = new Date(req.dateCompleted);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return completedDate >= oneWeekAgo;
  }).length;

  // Calculate requests by division
  const requestsByDivision = divisions.map(division => {
    const count = requests.filter(req => req.division === division).length;
    return { division, count };
  });

  return (
    <div className="p-6 dark:bg-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-300 text-sm font-medium mb-2">Open Requests</h3>
          <div className="flex items-end">
            <p className="text-3xl font-bold dark:text-white">{openRequestsCount}</p>
            <p className="text-sm text-gray-500 dark:text-gray-300 ml-2 mb-1">requests</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-300 text-sm font-medium mb-2">Awaiting Parts</h3>
          <div className="flex items-end">
            <p className="text-3xl font-bold dark:text-white">{awaitingPartsCount}</p>
            <p className="text-sm text-gray-500 dark:text-gray-300 ml-2 mb-1">requests</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-300 text-sm font-medium mb-2">Completed This Week</h3>
          <div className="flex items-end">
            <p className="text-3xl font-bold dark:text-white">{completedThisWeek}</p>
            <p className="text-sm text-gray-500 dark:text-gray-300 ml-2 mb-1">requests</p>
          </div>
        </div>
      </div>
      
      {/* Distribution by Division */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow mb-8">
        <h3 className="font-bold mb-4">Requests by Division</h3>
        <div className="space-y-4">
          {requestsByDivision.map(item => (
            <div key={item.division} className="flex items-center">
              <span className="w-32 text-sm">{item.division}</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${Math.max(5, (item.count / requests.length) * 100)}%` }}
                ></div>
              </div>
              <span className="ml-4 text-sm">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
        <h3 className="font-bold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {requests.slice(0, 5).map(request => (
            <div key={request.id} className="border-b pb-3 dark:border-gray-600">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{request.equipmentName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">{request.division} - {request.description}</p>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    request.status === 'Awaiting Parts' ? 'bg-yellow-100 text-yellow-800' : 
                    request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                    request.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {request.dateCompleted 
                  ? `Completed on ${request.dateCompleted}` 
                  : `Requested on ${request.dateRequested}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;