import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import FinishedScreen from '../screens/game/components/steps/FinishStep';

jest.mock('expo-av', () => {
  const playAsync = jest.fn();
  const pauseAsync = jest.fn();
  const setOnPlaybackStatusUpdate = jest.fn();

  const mockSound = {
    playAsync,
    pauseAsync,
    setOnPlaybackStatusUpdate,
    unloadAsync: jest.fn(),
  };

  return {
    Audio: {
      Sound: {
        createAsync: jest.fn(() => Promise.resolve({ sound: mockSound })),
      },
    },
  };
});

const mockData = {
  title: 'Well Done!',
  text: 'Thank you for saving.',
  guideUrl: 'owl.png',
  audioUrl: 'audio.mp3',
};

describe('FinishedScreen', () => {
  it('displays the correct text and calls nextStep when clicked.', async () => {
    const mockNext = jest.fn();

    const { getByText } = render(
      <FinishedScreen data={mockData} nextStep={mockNext} />
    );

   
    await act(async () => {
      await Promise.resolve();
    });

    fireEvent.press(getByText('End Game'));

    expect(mockNext).toHaveBeenCalled();
  });
});
