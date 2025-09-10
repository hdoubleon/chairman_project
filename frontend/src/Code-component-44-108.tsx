import React, { useEffect, useState } from 'react';
import { StudyRoomProvider } from './contexts/StudyRoomContext';
import { MobileApp } from './components/MobileApp';
import { Button } from './components/ui/button';
import { Download } from 'lucide-react';

export default function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  return (
    <StudyRoomProvider>
      <div className="max-w-sm mx-auto min-h-screen bg-background relative overflow-hidden">
        {/* PWA 설치 프롬프트 */}
        {showInstallPrompt && (
          <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground p-3 z-50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium">앱으로 설치하기</p>
                <p className="text-xs opacity-90">홈 화면에 추가하여 더 편리하게 이용하세요</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setShowInstallPrompt(false)}
                  className="text-xs"
                >
                  나중에
                </Button>
                <Button
                  size="sm"
                  onClick={handleInstall}
                  className="text-xs bg-white text-primary hover:bg-gray-100"
                >
                  <Download className="w-3 h-3 mr-1" />
                  설치
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* iOS 스타일 안전 영역 시뮬레이션 */}
        <div className={`h-screen flex flex-col ${showInstallPrompt ? 'pt-20 pb-8' : 'pt-12 pb-8'}`}>
          <MobileApp />
        </div>
      </div>
    </StudyRoomProvider>
  );
}