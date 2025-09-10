import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  playKick, playSnare, playHiHat, 
  playSynth, playBass, playDrop, playStrings, getAudioContext, getMasterGain
} from '../utils/audioUtils';

// Define the step sequence types
export type StepSequence = boolean[];
export type DrumSequence = {
  kick: StepSequence;
  snare: StepSequence;
  hihat: StepSequence;
};
export type InstrumentSequence = {
  drums: DrumSequence;
  bass: StepSequence[];
  synth: StepSequence[];
  drop: StepSequence[];
  strings: StepSequence[];
};

export type Instrument = 'drums' | 'bass' | 'synth' | 'drop' | 'strings';

export type GrooveBoxContextType = {
  activeInstrument: Instrument;
  setActiveInstrument: (instrument: Instrument) => void;
  sequence: InstrumentSequence;
  toggleStep: (
    instrument: Instrument,
    row: number | keyof DrumSequence,
    step: number
  ) => void;
  isPlaying: boolean;
  togglePlayback: () => void;
  currentStep: number;
  tempo: number;
  setTempo: (tempo: number) => void;
  playDemo: () => void;
  clearSequence: () => void;
  volume: number;
  setVolume: (volume: number) => void;
};

// Create the context
const GrooveBoxContext = createContext<GrooveBoxContextType | undefined>(undefined);

// Number of steps in a pattern
const STEP_COUNT = 16;

// Create empty sequences
const createEmptyStepSequence = (): StepSequence => 
  Array(STEP_COUNT).fill(false);

const createEmptyDrumSequence = (): DrumSequence => ({
  kick: createEmptyStepSequence(),
  snare: createEmptyStepSequence(),
  hihat: createEmptyStepSequence(),
});

// Create 6 empty sequences for bass and synth
const createEmptyMelodicSequence = (): StepSequence[] => 
  Array(6).fill(null).map(() => createEmptyStepSequence());

// Create 4 empty sequences for drop effect
const createEmptyDropSequence = (): StepSequence[] => 
  Array(4).fill(null).map(() => createEmptyStepSequence());

// Set up demo patterns
const createDemoSequence = (): InstrumentSequence => {
  const demo: InstrumentSequence = {
    drums: {
      kick: Array(STEP_COUNT).fill(false),
      snare: Array(STEP_COUNT).fill(false),
      hihat: Array(STEP_COUNT).fill(false),
    },
    bass: createEmptyMelodicSequence(),
    synth: createEmptyMelodicSequence(),
    drop: createEmptyDropSequence(),
    strings: createEmptyMelodicSequence(),
  };
  
  // Set up kick drum pattern (on beats 0, 4, 8, 12)
  demo.drums.kick[0] = true;
  demo.drums.kick[4] = true;
  demo.drums.kick[8] = true;
  demo.drums.kick[12] = true;
  
  // Set up snare pattern (on beats 4, 12)
  demo.drums.snare[4] = true;
  demo.drums.snare[12] = true;
  
  // Set up hi-hat pattern (on every other beat)
  for (let i = 0; i < STEP_COUNT; i += 2) {
    demo.drums.hihat[i] = true;
  }
  
  // Set up bass pattern
  demo.bass[0][0] = true;  // First bass note on first beat
  demo.bass[0][8] = true;  // First bass note repeat
  demo.bass[1][4] = true;  // Second bass note
  demo.bass[2][12] = true; // Third bass note
  
  // Set up synth pattern
  demo.synth[4][2] = true;  // Fifth synth note
  demo.synth[3][6] = true;  // Fourth synth note
  demo.synth[2][10] = true; // Third synth note
  demo.synth[1][14] = true; // Second synth note
  
  // Set up drop pattern with EDM-style drops at strategic points
  demo.drop[0][0] = true;  // Short drop at the beginning
  demo.drop[1][4] = true;  // Medium drop on beat 5
  demo.drop[2][8] = true;  // Long drop on beat 9 
  demo.drop[3][12] = true; // Epic drop on beat 13 (climax)
  
  // Set up strings pattern (sustained orchestral feel)
  demo.strings[5][0] = true;  // Highest note on the first beat
  demo.strings[3][4] = true;  // Mid note on beat 5
  demo.strings[4][8] = true;  // High note on beat 9
  demo.strings[2][12] = true; // Lower note on beat 13
  
  return demo;
};

// Provider component
export const GrooveBoxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeInstrument, setActiveInstrument] = useState<Instrument>('synth');
  const [sequence, setSequence] = useState<InstrumentSequence>({
    drums: createEmptyDrumSequence(),
    bass: createEmptyMelodicSequence(),
    synth: createEmptyMelodicSequence(),
    drop: createEmptyDropSequence(),
    strings: createEmptyMelodicSequence(),
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [tempo, setTempo] = useState<number>(120);
  const [volume, setVolume] = useState<number>(0.7);
  
  // Custom volume setter that also updates the master gain
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    // Update the master gain even when not playing
    getMasterGain(newVolume);
  };
  
  // Timer reference
  const timerRef = useRef<number | null>(null);
  
  // Store current audio parameters in refs to avoid recreating interval
  const tempoRef = useRef(tempo);
  const sequenceRef = useRef(sequence);
  const volumeRef = useRef(volume);
  
  // Update refs when values change
  useEffect(() => {
    tempoRef.current = tempo;
  }, [tempo]);
  
  useEffect(() => {
    sequenceRef.current = sequence;
  }, [sequence]);
  
  useEffect(() => {
    volumeRef.current = volume;
    // Update master gain immediately
    getMasterGain(volume);
  }, [volume]);
  
  // Calculate interval based on tempo (BPM)
  const getStepInterval = () => (60 * 1000) / (tempoRef.current * 4);
  
  // Play sounds for the current step
  const playCurrentStepSounds = (step: number) => {
    // Initialize AudioContext if needed (must be triggered by user gesture)
    getAudioContext();
    
    // Get master gain node with current volume from ref
    const masterGain = getMasterGain(volumeRef.current);
    
    // Always read the most current sequence state from ref
    const currentSequence = sequenceRef.current;
    
    // Play drum sounds
    if (currentSequence.drums.kick[step]) playKick(masterGain);
    if (currentSequence.drums.snare[step]) playSnare(masterGain);
    if (currentSequence.drums.hihat[step]) playHiHat(masterGain);
    
    // Play bass notes
    currentSequence.bass.forEach((row, noteIndex) => {
      if (row[step]) playBass(noteIndex, masterGain);
    });
    
    // Play synth notes
    currentSequence.synth.forEach((row, noteIndex) => {
      if (row[step]) playSynth(noteIndex, masterGain);
    });
    
    // Play string notes
    currentSequence.strings.forEach((row, noteIndex) => {
      if (row[step]) playStrings(noteIndex, masterGain);
    });
    
    // Play drop sounds with different durations based on row
    currentSequence.drop.forEach((row, noteIndex) => {
      if (row[step]) {
        // Duration increases for better impact as you go from row 0 (short) to row 3 (epic)
        // Each drop type has a different character and length:
        // noteIndex 0: Short/tight drop - 0.3s
        // noteIndex 1: Medium drop - 0.6s
        // noteIndex 2: Long drop - 1.0s
        // noteIndex 3: Epic drop - 1.5s (full impact)
        const durations = [0.3, 0.6, 1.0, 1.5];
        const duration = durations[noteIndex];
        playDrop(duration, masterGain);
      }
    });
  };
  
  // Toggle a step in the sequence
  const toggleStep = (
    instrument: Instrument,
    row: number | keyof DrumSequence,
    step: number
  ) => {
    setSequence((prev) => {
      const newSequence = { ...prev };
      
      if (instrument === 'drums') {
        const drumRow = row as keyof DrumSequence;
        newSequence.drums[drumRow] = [...prev.drums[drumRow]];
        newSequence.drums[drumRow][step] = !prev.drums[drumRow][step];
      } else {
        const melodicRow = row as number;
        newSequence[instrument] = [...prev[instrument]];
        newSequence[instrument][melodicRow] = [...prev[instrument][melodicRow]];
        newSequence[instrument][melodicRow][step] = !prev[instrument][melodicRow][step];
      }
      
      // Update the sequence ref immediately to ensure current sounds play correctly
      sequenceRef.current = newSequence;
      
      // If we're currently playing the toggled step, play it immediately
      if (isPlaying && currentStep === step) {
        // No need for setTimeout since we're using the ref
        playCurrentStepSounds(step);
      }
      
      return newSequence;
    });
  };
  
  // Start or stop the sequencer
  const togglePlayback = () => {
    if (isPlaying) {
      // Stop playback
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setCurrentStep(0);
      setIsPlaying(false);
    } else {
      // Start playback
      setCurrentStep(0);
      setIsPlaying(true);
      
      // Schedule the first step immediately
      playCurrentStepSounds(0);
      
      // Schedule subsequent steps using current tempo from ref
      timerRef.current = window.setInterval(() => {
        setCurrentStep((prev) => {
          const nextStep = (prev + 1) % STEP_COUNT;
          playCurrentStepSounds(nextStep);
          return nextStep;
        });
      }, (60 * 1000) / (tempoRef.current * 4));
    }
  };
  
  // Load demo pattern
  const playDemo = () => {
    const demoSequence = createDemoSequence();
    
    // Update ref immediately for current playback
    sequenceRef.current = demoSequence;
    setSequence(demoSequence);
    
    // No need to stop playback anymore - keep it running if it's already playing
  };
  
  // Clear all patterns
  const clearSequence = () => {
    const emptySequence = {
      drums: createEmptyDrumSequence(),
      bass: createEmptyMelodicSequence(),
      synth: createEmptyMelodicSequence(),
      drop: createEmptyDropSequence(),
      strings: createEmptyMelodicSequence(),
    };
    
    // Update ref immediately to ensure playback uses the new sequence
    sequenceRef.current = emptySequence;
    setSequence(emptySequence);
  };
  
  // Only update interval when tempo changes
  useEffect(() => {
    if (isPlaying && timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setCurrentStep((prev) => {
          const nextStep = (prev + 1) % STEP_COUNT;
          playCurrentStepSounds(nextStep);
          return nextStep;
        });
      }, getStepInterval());
    }
  }, [tempo, isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const value: GrooveBoxContextType = {
    activeInstrument,
    setActiveInstrument,
    sequence,
    toggleStep,
    isPlaying,
    togglePlayback,
    currentStep,
    tempo,
    setTempo,
    playDemo,
    clearSequence,
    volume,
    setVolume: handleVolumeChange,
  };
  
  return (
    <GrooveBoxContext.Provider value={value}>
      {children}
    </GrooveBoxContext.Provider>
  );
};

// Hook for using the context
export const useGrooveBox = () => {
  const context = useContext(GrooveBoxContext);
  if (context === undefined) {
    throw new Error('useGrooveBox must be used within a GrooveBoxProvider');
  }
  return context;
};