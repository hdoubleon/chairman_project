import React, { useState } from 'react';
import { NavigationHeader } from './NavigationHeader';
import { HomeScreen } from './HomeScreen';
import { MapScreen } from './MapScreen';
import { ReservationScreen } from './ReservationScreen';
import { ProfileScreen } from './ProfileScreen';
import { BuildingDetailScreen } from './BuildingDetailScreen';

type Screen = 'home' | 'map' | 'reservation' | 'profile' | 'building';

export function MobileApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);

  const handleNavigate = (screen: Screen, buildingId?: string) => {
    setCurrentScreen(screen);
    if (buildingId) {
      setSelectedBuildingId(buildingId);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} />;
      case 'map':
        return <MapScreen onNavigate={handleNavigate} />;
      case 'reservation':
        return <ReservationScreen onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfileScreen onNavigate={handleNavigate} />;
      case 'building':
        return selectedBuildingId ? (
          <BuildingDetailScreen 
            onNavigate={handleNavigate} 
            buildingId={selectedBuildingId}
          />
        ) : (
          <HomeScreen onNavigate={handleNavigate} />
        );
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <NavigationHeader 
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
      />
      
      <div className="flex-1 overflow-hidden">
        {renderScreen()}
      </div>
    </div>
  );
}