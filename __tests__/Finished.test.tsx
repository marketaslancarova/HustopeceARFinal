import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import FinishedScreen from '../screens/game/components/steps/FinishStep';

// variable for translations
let mockedTranslation = '';

// mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: () => mockedTranslation,
  }),
}));

// mock expo-av
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

describe.each([
  ['cs', 'Dokončeno'],
  ['en', 'Finish'],
  ])('FinishedScreen in language %s', (lang, expectedText) => {
  it(`shows "${expectedText}" and triggers nextStep`, async () => {
    mockedTranslation = expectedText;

    const mockNext = jest.fn();

    const { getByText } = render(
      <FinishedScreen data={mockData} nextStep={mockNext} />
    );

    await act(async () => Promise.resolve());

    fireEvent.press(getByText(expectedText));
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});
