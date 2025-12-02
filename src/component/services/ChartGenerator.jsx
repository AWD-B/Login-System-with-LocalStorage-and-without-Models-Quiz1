// components/services/ChartGenerator.jsx - Printable Pet Care Charts
import React, { useState, useRef } from 'react';
import { serviceAPI } from "../../services/serviceAPI";
import "../../styles/Services.css";

// Icons
import { Download, Printer, Calendar, Syringe, Utensils, Activity } from 'lucide-react';

const ChartGenerator = () => {
  const [chartType, setChartType] = useState('feeding');
  const [chartData, setChartData] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const chartRef = useRef();

  const chartTypes = [
    { 
      value: 'feeding', 
      label: 'Feeding Schedule', 
      icon: '🍽️',
      description: 'Daily feeding times and portions',
      color: '#10B981'
    },
    { 
      value: 'vaccination', 
      label: 'Vaccination Chart', 
      icon: '💉',
      description: 'Vaccination dates and reminders',
      color: '#3B82F6'
    },
    { 
      value: 'medication', 
      label: 'Medication Tracker', 
      icon: '💊',
      description: 'Daily medication schedule',
      color: '#8B5CF6'
    },
    { 
      value: 'training', 
      label: 'Training Progress', 
      icon: '🎓',
      description: 'Training milestones and goals',
      color: '#F59E0B'
    },
    { 
      value: 'weight', 
      label: 'Weight Tracker', 
      icon: '⚖️',
      description: 'Monthly weight monitoring',
      color: '#EC4899'
    },
    { 
      value: 'grooming', 
      label: 'Grooming Schedule', 
      icon: '✨',
      description: 'Regular grooming activities',
      color: '#6366F1'
    }
  ];

  const sampleFeedingData = {
    petName: 'Buddy',
    petType: 'Dog',
    age: '3 years',
    weight: '15 kg',
    schedule: [
      { time: '7:00 AM', meal: 'Breakfast', portion: '1 cup dry food', notes: 'With fish oil' },
      { time: '12:00 PM', meal: 'Lunch', portion: '1/2 cup wet food', notes: 'Mixed with veggies' },
      { time: '6:00 PM', meal: 'Dinner', portion: '1 cup dry food', notes: 'Evening walk after' },
      { time: '9:00 PM', meal: 'Treat', portion: 'Dental chew', notes: 'Before bedtime' }
    ],
    dailyCalories: '850 kcal',
    water: 'Fresh water always available',
    specialInstructions: 'No human food. Monitor weight weekly.'
  };

  const sampleVaccinationData = {
    petName: 'Whiskers',
    petType: 'Cat',
    birthDate: 'March 15, 2022',
    vaccinations: [
      { vaccine: 'FVRCP', date: '2022-04-15', nextDue: '2023-04-15', status: 'Completed' },
      { vaccine: 'Rabies', date: '2022-05-01', nextDue: '2024-05-01', status: 'Completed' },
      { vaccine: 'FeLV', date: '2022-06-01', nextDue: '2023-06-01', status: 'Upcoming' },
      { vaccine: 'FVRCP Booster', date: '', nextDue: '2023-04-15', status: 'Scheduled' }
    ],
    vetInfo: 'Dr. Smith - Paws & Claws Clinic (555-0123)',
    notes: 'Mild lethargy after last vaccination. Monitor next time.'
  };

  const generateChart = async () => {
    setIsGenerating(true);
    try {
      // Simulate chart generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const data = chartType === 'feeding' ? sampleFeedingData : sampleVaccinationData;
      setChartData(data);
      
    } catch (error) {
      console.error('Chart generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const printChart = () => {
    window.print();
  };

  const downloadChart = () => {
    alert('Chart download functionality would be implemented here!');
    // In real implementation, this would generate a PDF
  };

  const renderFeedingChart = () => (
    <div className="chart-content feeding-chart">
      <div className="chart-header">
        <h3>Feeding Schedule for {chartData.petName}</h3>
        <div className="pet-info">
          <span>{chartData.petType} • {chartData.age} • {chartData.weight}</span>
        </div>
      </div>

      <div className="schedule-table">
        <div className="table-header">
          <span>Time</span>
          <span>Meal</span>
          <span>Portion</span>
          <span>Notes</span>
        </div>
        {chartData.schedule?.map((meal, index) => (
          <div key={index} className="table-row">
            <span className="time">{meal.time}</span>
            <span className="meal">{meal.meal}</span>
            <span className="portion">{meal.portion}</span>
            <span className="notes">{meal.notes}</span>
          </div>
        ))}
      </div>

      <div className="chart-footer">
        <div className="footer-section">
          <h4>Daily Nutrition</h4>
          <p>Calories: <strong>{chartData.dailyCalories}</strong></p>
          <p>Water: {chartData.water}</p>
        </div>
        <div className="footer-section">
          <h4>Special Instructions</h4>
          <p>{chartData.specialInstructions}</p>
        </div>
      </div>
    </div>
  );

  const renderVaccinationChart = () => (
    <div className="chart-content vaccination-chart">
      <div className="chart-header">
        <h3>Vaccination Record for {chartData.petName}</h3>
        <div className="pet-info">
          <span>{chartData.petType} • Born: {chartData.birthDate}</span>
        </div>
      </div>

      <div className="vaccination-table">
        <div className="table-header">
          <span>Vaccine</span>
          <span>Last Date</span>
          <span>Next Due</span>
          <span>Status</span>
        </div>
        {chartData.vaccinations?.map((vaccine, index) => (
          <div key={index} className={`table-row status-${vaccine.status.toLowerCase()}`}>
            <span className="vaccine">{vaccine.vaccine}</span>
            <span className="date">{vaccine.date || 'N/A'}</span>
            <span className="next-due">{vaccine.nextDue}</span>
            <span className={`status ${vaccine.status.toLowerCase()}`}>
              {vaccine.status}
            </span>
          </div>
        ))}
      </div>

      <div className="chart-footer">
        <div className="footer-section">
          <h4>Veterinarian Information</h4>
          <p>{chartData.vetInfo}</p>
        </div>
        <div className="footer-section">
          <h4>Notes</h4>
          <p>{chartData.notes}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="service-page chart-generator">
      <div className="service-header">
        <div className="header-icon">
          <Calendar size={32} />
        </div>
        <h1>Printable Pet Care Charts</h1>
        <p>Organize and track your pet's care routine! 📊</p>
      </div>

      <div className="chart-container">
        {/* Chart Type Selection */}
        <div className="chart-selection">
          <h3>Select Chart Type</h3>
          <div className="chart-type-grid">
            {chartTypes.map(chart => (
              <button
                key={chart.value}
                className={`chart-type-btn ${chartType === chart.value ? 'active' : ''}`}
                onClick={() => setChartType(chart.value)}
                style={{ borderColor: chart.color }}
              >
                <span className="chart-emoji">{chart.icon}</span>
                <span className="chart-name">{chart.label}</span>
                <span className="chart-desc">{chart.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chart Customization */}
        <div className="customization-section">
          <h3>Customize Your Chart</h3>
          <div className="customization-form">
            <div className="form-row">
              <div className="form-group">
                <label>Pet's Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Buddy"
                  onChange={(e) => setChartData(prev => ({ ...prev, petName: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Pet Type</label>
                <select>
                  <option>Dog</option>
                  <option>Cat</option>
                  <option>Rabbit</option>
                  <option>Bird</option>
                </select>
              </div>
            </div>
            
            <button 
              onClick={generateChart}
              className="generate-chart-btn"
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Chart'}
            </button>
          </div>
        </div>

        {/* Chart Preview */}
        {chartData.petName && (
          <div className="chart-preview-section" ref={chartRef}>
            <div className="preview-header">
              <h3>Chart Preview</h3>
              <div className="preview-actions">
                <button onClick={printChart} className="action-btn">
                  <Printer size={16} />
                  Print
                </button>
                <button onClick={downloadChart} className="action-btn primary">
                  <Download size={16} />
                  Download PDF
                </button>
              </div>
            </div>

            <div className="chart-preview">
              {chartType === 'feeding' && renderFeedingChart()}
              {chartType === 'vaccination' && renderVaccinationChart()}
              {/* Add other chart types here */}
              
              <div className="print-watermark">
                Generated by PetCare Pro • {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        )}

        {/* Chart Templates */}
        <div className="templates-section">
          <h3>Popular Chart Templates</h3>
          <div className="templates-grid">
            <div className="template-card">
              <div className="template-icon">🐕</div>
              <h4>Puppy Training Schedule</h4>
              <p>Perfect for new puppy owners</p>
              <button className="template-btn">Use Template</button>
            </div>
            <div className="template-card">
              <div className="template-icon">🐈</div>
              <h4>Senior Cat Care</h4>
              <p>Specialized for older cats</p>
              <button className="template-btn">Use Template</button>
            </div>
            <div className="template-card">
              <div className="template-icon">🐇</div>
              <h4>Rabbit Diet Plan</h4>
              <p>Balanced nutrition for bunnies</p>
              <button className="template-btn">Use Template</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartGenerator;