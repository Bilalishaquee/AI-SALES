import React, { useState } from 'react';
import { Video } from 'lucide-react';
import { Dropdown } from '../ui/Dropdown';
import { Zoom, VideoIcon } from 'lucide-react';

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
      icon: <Video className="h-5 w-5 text-blue-500" />
    },
    {
      value: 'meet',
      label: 'Google Meet',
      icon: <Video className="h-5 w-5 text-green-500" />
    },
    {
      value: 'teams',
      label: 'Microsoft Teams',
      icon: <Video className="h-5 w-5 text-purple-500" />
    }
  ];

  return (
    <Dropdown
      options={integrationOptions}
      value={selectedIntegration}
      onChange={handleIntegrationChange}
      placeholder="Select platform"
      className={`${className}`}
      buttonClassName="text-xs py-1.5 px-4 bg-blue-500 hover:bg-blue-600 border-blue-600 text-white shadow-sm transition-all duration-200 font-medium rounded-full"
      menuClassName="w-48 right-0 mt-2 border border-gray-100"
    />
  );
};