import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  currentPanel: number;
  totalPanels?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentPanel, 
  totalPanels = 6 
}) => {
  const progress = (currentPanel / (totalPanels - 1)) * 100;

  return (
    <div className="progress-bar-container">
      <div 
        className="progress-bar-fill" 
        style={{ width: `${progress}%` }} 
      />
    </div>
  );
};
