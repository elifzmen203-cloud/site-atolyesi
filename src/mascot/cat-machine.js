export const CAT_STATES = [
  'sit',
  'walk',
  'groom',
  'purr',
  'aim',
  'jump',
  'sleep',
  'stretch',
  'laptop',
  'eat'
];

export const VALID_TRANSITIONS = {
  sit: ['walk', 'groom', 'purr', 'sleep', 'aim', 'laptop', 'eat', 'jump', 'stretch'],
  walk: ['sit', 'groom', 'aim', 'jump'],
  groom: ['sit', 'purr'],
  purr: ['sit', 'sleep'],
  aim: ['jump', 'sit'],
  jump: ['sit'],
  sleep: ['stretch', 'sit'],
  stretch: ['sit', 'walk'],
  laptop: ['sit'],
  eat: ['sit', 'purr', 'groom']
};

/**
 * Creates a pure state machine for Tatlım the cat mascot.
 * @param {Object} options
 * @param {Function} [options.rng] - Custom random number generator returning [0, 1)
 * @param {string} [options.initialState] - Initial state (defaults to 'sit')
 */
export function createCatMachine(options = {}) {
  const rng = options.rng || Math.random;
  let currentState = options.initialState || 'sit';
  const listeners = new Set();

  function setState(newState) {
    if (newState === currentState) return;
    const oldState = currentState;
    currentState = newState;
    listeners.forEach(fn => fn(newState, oldState));
  }

  return {
    getState() {
      return currentState;
    },

    setState,

    canTransitionTo(nextState) {
      const allowed = VALID_TRANSITIONS[currentState] || [];
      return allowed.includes(nextState);
    },

    transition(nextState) {
      if (this.canTransitionTo(nextState)) {
        setState(nextState);
        return true;
      }
      return false;
    },

    /**
     * Advances to a naturally randomized next state.
     */
    tickNatural() {
      const choices = VALID_TRANSITIONS[currentState] || ['sit'];
      const index = Math.floor(rng() * choices.length);
      const next = choices[index];
      setState(next);
      return next;
    },

    onStateChange(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    }
  };
}
