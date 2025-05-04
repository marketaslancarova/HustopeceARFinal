// __tests__/GameScreen.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import GameScreen from '../screens/game/GameScreen';
import { Button, Text } from 'react-native';

// Helper function to create mock steps
const createMockStep = (label: string) => {
  return ({ nextStep }: { nextStep: () => void }) => (
    <>
      <Text>{label}</Text>
      <Button title="Next" onPress={nextStep} />
    </>
  );
};

// 🧪 Steps mocks 
jest.mock('../screens/game/components/steps/IntroStep', () => createMockStep('Intro Step'));
jest.mock('../screens/game/components/steps/StoryStep', () => createMockStep('Story Step'));
jest.mock('../screens/game/components/steps/ResultStep', () => createMockStep('Result Step'));
jest.mock('../screens/game/components/steps/TaskStep', () => createMockStep('Task Step'));
jest.mock('../screens/game/components/steps/MapStep', () => createMockStep('Map Step'));
jest.mock('../screens/game/components/steps/VideoStep', () => createMockStep('Video Step'));
jest.mock('../screens/game/components/steps/FinishStep', () => createMockStep('Finish Step'));

//  Navigation mock
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
    useRoute: () => ({
      params: {
        gameFlow: [
          {type: 'intro'},
          {type: 'story'},
          {type: 'result'},
          {type: 'task'},
          {type: 'map'},
          {type: 'video'},
          {type: 'finished'},
        ],
      },
    }),
  };
});

describe('GameScreen', () => {
  it("goes through all the steps using the 'Next' button and calls navigate('Home') at the end.", () => {
    const { getByText } = render(<GameScreen />);

    // Step 1: Intro
    expect(getByText('Intro Step')).toBeTruthy();
    fireEvent.press(getByText('Next'));

    // Step 2: Story
    expect(getByText('Story Step')).toBeTruthy();
    fireEvent.press(getByText('Next'));

    // Step 3: Result
    expect(getByText('Result Step')).toBeTruthy();
    fireEvent.press(getByText('Next'));

    // Step 4: Task
    expect(getByText('Task Step')).toBeTruthy();
    fireEvent.press(getByText('Next'));

    // Step 5: Map
    expect(getByText('Map Step')).toBeTruthy();
    fireEvent.press(getByText('Next'));

    // Step 6: Video
    expect(getByText('Video Step')).toBeTruthy();
    fireEvent.press(getByText('Next'));

    // Step 7: Finish
    expect(getByText('Finish Step')).toBeTruthy();
    fireEvent.press(getByText('Next'));

    // Check if navigate was called with "Home"
    expect(mockNavigate).toHaveBeenCalledWith('Home');
  });
});
