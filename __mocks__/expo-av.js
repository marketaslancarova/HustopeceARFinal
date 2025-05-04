export const Audio = {
  Sound: class {
    static async createAsync() {
      return {
        sound: new Audio.Sound(),
      };
    }

    setOnPlaybackStatusUpdate = jest.fn();
    playAsync = jest.fn();
    pauseAsync = jest.fn();
    unloadAsync = jest.fn();
  },
};
