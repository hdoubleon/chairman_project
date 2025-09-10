import React, { createContext, useContext, useReducer } from 'react';

// 미래관 1층 자리
const miraeB1Seats = Array.from({ length: 48 }, (_, i) => ({
  id: `mirae-b1-seat-${i + 1}`,
  position: { x: (i % 8) + 1, y: Math.floor(i / 8) + 1 },
  isAvailable: Math.random() > 0.3,
  isReserved: Math.random() > 0.8,
  seatNumber: i + 1,
  buildingId: 'mirae',
  floor: 1
}));

// 미래관 2층 자리
const miraeB2Seats = Array.from({ length: 36 }, (_, i) => ({
  id: `mirae-b2-seat-${i + 1}`,
  position: { x: (i % 6) + 1, y: Math.floor(i / 6) + 1 },
  isAvailable: Math.random() > 0.2,
  isReserved: Math.random() > 0.7,
  seatNumber: i + 1,
  buildingId: 'mirae',
  floor: 2
}));

// 별관도서관 1층 자리
const libraryB1Seats = Array.from({ length: 60 }, (_, i) => ({
  id: `library-b1-seat-${i + 1}`,
  position: { x: (i % 10) + 1, y: Math.floor(i / 10) + 1 },
  isAvailable: Math.random() > 0.4,
  isReserved: Math.random() > 0.85,
  seatNumber: i + 1,
  buildingId: 'library',
  floor: 1
}));

// 별관도서관 2층 자리
const libraryB2Seats = Array.from({ length: 45 }, (_, i) => ({
  id: `library-b2-seat-${i + 1}`,
  position: { x: (i % 9) + 1, y: Math.floor(i / 9) + 1 },
  isAvailable: Math.random() > 0.3,
  isReserved: Math.random() > 0.9,
  seatNumber: i + 1,
  buildingId: 'library',
  floor: 2
}));

// 상상관 1층 자리
const sangsangB1Seats = Array.from({ length: 24 }, (_, i) => ({
  id: `sangsang-b1-seat-${i + 1}`,
  position: { x: (i % 6) + 1, y: Math.floor(i / 6) + 1 },
  isAvailable: Math.random() > 0.25,
  isReserved: Math.random() > 0.8,
  seatNumber: i + 1,
  buildingId: 'sangsang',
  floor: 1
}));

const allSeats = [...miraeB1Seats, ...miraeB2Seats, ...libraryB1Seats, ...libraryB2Seats, ...sangsangB1Seats];

const initialBuildings = [
  {
    id: 'mirae',
    name: '미래관',
    code: 'MR',
    floors: [
      {
        id: 'mirae-b1',
        number: 1,
        name: '1층 자습실',
        seats: miraeB1Seats,
        layout: 'study-room'
      },
      {
        id: 'mirae-b2',
        number: 2,
        name: '2층 멀티미디어실',
        seats: miraeB2Seats,
        layout: 'classroom'
      }
    ],
    totalSeats: miraeB1Seats.length + miraeB2Seats.length,
    availableSeats: [...miraeB1Seats, ...miraeB2Seats].filter(seat => seat.isAvailable && !seat.isReserved).length,
    operatingHours: '08:00 - 22:00'
  },
  {
    id: 'library',
    name: '별관도서관',
    code: 'LB',
    floors: [
      {
        id: 'library-b1',
        number: 1,
        name: '1층 열람실',
        seats: libraryB1Seats,
        layout: 'library'
      },
      {
        id: 'library-b2',
        number: 2,
        name: '2층 조용한 열람실',
        seats: libraryB2Seats,
        layout: 'library'
      }
    ],
    totalSeats: libraryB1Seats.length + libraryB2Seats.length,
    availableSeats: [...libraryB1Seats, ...libraryB2Seats].filter(seat => seat.isAvailable && !seat.isReserved).length,
    operatingHours: '09:00 - 21:00'
  },
  {
    id: 'sangsang',
    name: '상상관',
    code: 'SS',
    floors: [
      {
        id: 'sangsang-b1',
        number: 1,
        name: '1층 스터디룸',
        seats: sangsangB1Seats,
        layout: 'study-room'
      }
    ],
    totalSeats: sangsangB1Seats.length,
    availableSeats: sangsangB1Seats.filter(seat => seat.isAvailable && !seat.isReserved).length,
    operatingHours: '10:00 - 20:00'
  }
];

const initialState = {
  seats: allSeats,
  buildings: initialBuildings,
  currentUser: null,
  selectedSeat: null,
  selectedBuilding: null,
  selectedFloor: null,
  reservations: {},
};

function studyRoomReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    
    case 'SELECT_SEAT':
      return { ...state, selectedSeat: action.payload };
    
    case 'SELECT_BUILDING':
      return { ...state, selectedBuilding: action.payload, selectedFloor: null, selectedSeat: null };
    
    case 'SELECT_FLOOR':
      return { ...state, selectedFloor: action.payload, selectedSeat: null };
    
    case 'RESERVE_SEAT':
      const { seatId, user, startTime, endTime } = action.payload;
      return {
        ...state,
        seats: state.seats.map(seat =>
          seat.id === seatId
            ? { ...seat, isReserved: true, reservedBy: user.name, reservationTime: startTime }
            : seat
        ),
        reservations: {
          ...state.reservations,
          [seatId]: { user, startTime, endTime }
        },
        selectedSeat: null,
      };
    
    case 'CANCEL_RESERVATION':
      const { [action.payload]: removed, ...remainingReservations } = state.reservations;
      return {
        ...state,
        seats: state.seats.map(seat =>
          seat.id === action.payload
            ? { ...seat, isReserved: false, reservedBy: undefined, reservationTime: undefined }
            : seat
        ),
        reservations: remainingReservations,
      };
    
    case 'UPDATE_SEAT_STATUS':
      return {
        ...state,
        seats: state.seats.map(seat =>
          seat.id === action.payload.seatId
            ? { ...seat, isAvailable: action.payload.isAvailable }
            : seat
        ),
      };
    
    default:
      return state;
  }
}

const StudyRoomContext = createContext(null);

export function StudyRoomProvider({ children }) {
  const [state, dispatch] = useReducer(studyRoomReducer, initialState);

  return (
    <StudyRoomContext.Provider value={{ state, dispatch }}>
      {children}
    </StudyRoomContext.Provider>
  );
}

export function useStudyRoom() {
  const context = useContext(StudyRoomContext);
  if (!context) {
    throw new Error('useStudyRoom must be used within a StudyRoomProvider');
  }
  return context;
}