import React, { useState } from 'react';
import { Header } from './Header';
import { SeatMap } from './SeatMap';
import { UserPanel } from './UserPanel';
import { ReservationPanel } from './ReservationPanel';
import { CollaborationPanel } from './CollaborationPanel';
import { useStudyRoom } from '../contexts/StudyRoomContext';

export function StudyRoomManager() {
  const { state } = useStudyRoom();
  const [activeTab, setActiveTab] = useState<'seats' | 'reservations' | 'collaboration'>('seats');

  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      <div className="flex-1 flex">
        {/* 왼쪽 사이드바 */}
        <div className="w-80 bg-card border-r border-border flex flex-col">
          <UserPanel />
          
          {/* 탭 네비게이션 */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('seats')}
              className={`flex-1 py-3 px-4 text-sm ${
                activeTab === 'seats'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              자리 현황
            </button>
            <button
              onClick={() => setActiveTab('reservations')}
              className={`flex-1 py-3 px-4 text-sm ${
                activeTab === 'reservations'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              예약 관리
            </button>
            <button
              onClick={() => setActiveTab('collaboration')}
              className={`flex-1 py-3 px-4 text-sm ${
                activeTab === 'collaboration'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              협업 도구
            </button>
          </div>
          
          {/* 탭 내용 */}
          <div className="flex-1 overflow-auto">
            {activeTab === 'seats' && (
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">전체 자리</span>
                    <span className="text-sm">{state.seats.length}석</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">사용 가능</span>
                    <span className="text-sm text-green-600">
                      {state.seats.filter(seat => seat.isAvailable && !seat.isReserved).length}석
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">예약됨</span>
                    <span className="text-sm text-blue-600">
                      {state.seats.filter(seat => seat.isReserved).length}석
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">사용 불가</span>
                    <span className="text-sm text-red-600">
                      {state.seats.filter(seat => !seat.isAvailable).length}석
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="mb-3">범례</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-sm">사용 가능</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-sm">예약됨</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-sm">사용 불가</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className="text-sm">선택됨</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'reservations' && <ReservationPanel />}
            {activeTab === 'collaboration' && <CollaborationPanel />}
          </div>
        </div>
        
        {/* 메인 영역 - 자리 배치도 */}
        <div className="flex-1 flex flex-col">
          <SeatMap />
        </div>
      </div>
    </div>
  );
}