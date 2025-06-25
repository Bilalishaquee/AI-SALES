import React, { useState } from 'react';
import { Video } from 'lucide-react';
import { Dropdown } from '../ui/Dropdown';

interface IntegrationDropdownProps {
  onSelect?: (integration: string) => void;
  className?: string;
}

export const IntegrationDropdown: React.FC<IntegrationDropdownProps> = ({
  onSelect,
  className = ''
}) => {
  const [selectedIntegration, setSelectedIntegration] = useState<string | undefined>();

  const handleIntegrationChange = (value: string) => {
    setSelectedIntegration(value);
    if (onSelect) {
      onSelect(value);
    }
  };

  const integrationOptions = [
    {
      value: 'zoom',
      label: 'Zoom',
      icon: <Video className="h-4 w-4 text-blue-500" />
    },
    {
      value: 'meet',
      label: 'Google Meet',
      icon: <Video className="h-4 w-4 text-green-500" />
    },
    {
      value: 'teams',
      label: 'Microsoft Teams',
      icon: <Video className="h-4 w-4 text-purple-500" />
    }
  ];

  return (
    <Dropdown
      options={integrationOptions}
      value={selectedIntegration}
      onChange={handleIntegrationChange}
      placeholder="Select platform"
      className={`${className}`}
      buttonClassName="text-xs py-1 px-3 bg-blue-600 hover:bg-blue-700 border-blue-700 text-white shadow-sm transition-all duration-200 font-medium rounded-full"
      menuClassName="w-40 right-0"
    />
  );
};