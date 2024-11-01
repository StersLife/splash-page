'use client'
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MonthlyBreakpointsChart = ({
  monthlySummary
}) => {
  const monthly_summary = monthlySummary || {};

  const data = Object.entries(monthly_summary)
    .map(([date, values]) => {
      const [year, month] = date.split('-');
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthIndex = parseInt(month) - 1;
      const revenue = values.average_revenue;
      
      const averageAmount = Math.round(revenue * 0.4);
      const professionalAmount = Math.round(revenue * 0.6);
      
      return {
        monthIndex,
        monthKey: `month-${monthIndex}`,
        month: monthNames[monthIndex].charAt(0),
        fullMonth: monthNames[monthIndex],
        average: averageAmount,
        professional: professionalAmount - averageAmount,
        averageTotal: averageAmount,
        professionalTotal: professionalAmount,
        total: professionalAmount
      };
    })
    .sort((a, b) => a.monthIndex - b.monthIndex);

  const CustomHeader = () => {
    return (
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium">Rate Comparison</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Average</span>
          <div className="w-2 h-2 rounded-full bg-[#B4E1E2]"></div>
          <div className="w-2 h-2 rounded-full bg-[#008489] ml-2"></div>
          <span className="text-xs text-gray-600">Professional</span>
        </div>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload[0]) return null;

    const originalData = payload[0].payload;
    
    return (
      <div className="bg-white shadow-lg rounded-lg p-3 text-sm border border-gray-100">
        <div className="font-medium text-gray-800 mb-2">
          {originalData.fullMonth}
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-gray-600">Average Rate</span>
          <span className="font-medium text-gray-800 ml-8">
            ${originalData.averageTotal.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-gray-600">Professional Rate</span>
          <span className="font-medium text-gray-800 ml-8">
            ${originalData.professionalTotal.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between py-1 border-t mt-1 pt-2">
          <span className="text-gray-600">Difference</span>
          <span className="font-medium text-gray-800 ml-8">
            ${originalData.professional.toLocaleString()}
          </span>
        </div>
      </div>
    );
  };

  const maxValue = Math.max(...data.map(item => item.total));
  
  // Calculate optimal y-axis max and step size
  const DESIRED_STEPS = 4; // We want about 4 steps (0, 1k, 2k, 3k) in this case
  const BUFFER = 1.1; // Add 10% buffer to prevent bars from touching the top
  
  // Round up to the nearest thousand
  const effectiveMax = Math.ceil(maxValue * BUFFER / 1000) * 1000;
  const stepSize = Math.ceil(effectiveMax / DESIRED_STEPS / 1000) * 1000;
  
  // Generate ticks
  const yAxisTicks = Array.from(
    { length: Math.ceil(effectiveMax / stepSize) + 1 },
    (_, i) => i * stepSize
  );

  return (
    <div className="w-full h-96 p-4 rounded-lg">
      <CustomHeader />
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
          barSize={40}
          minHeight={200}
        >
          <XAxis 
            dataKey="month" 
            tickLine={false}
            axisLine={false}
            fontSize={12}
            stroke="#666"
          />
          <YAxis 
            tickFormatter={(value) => `${(value/1000)}k`}
            tickLine={false}
            axisLine={false}
            fontSize={12}
            stroke="#666"
            domain={[0, yAxisTicks[yAxisTicks.length - 1]]}
            ticks={yAxisTicks}
            interval={0}
            width={35}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={false}
          />
          <Bar 
            dataKey="average" 
            stackId="a" 
            fill="#B4E1E2" 
            name="Average Rate"
            radius={[0, 0, 4, 4]}
          />
          <Bar 
            dataKey="professional" 
            stackId="a" 
            fill="#008489" 
            name="Additional for Professional"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyBreakpointsChart;