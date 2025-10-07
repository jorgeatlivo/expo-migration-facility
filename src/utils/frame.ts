/**
 * @fileoverview Utility functions for timing and animation frame handling.
 *
 * This file provides utility functions for creating promises that resolve after
 * specified time intervals or animation frames, facilitating controlled timing
 * in asynchronous operations.
 */

import { InteractionManager } from 'react-native';

/**
 * Creates a promise that resolves after the specified number of milliseconds.
 * @param ms - The number of milliseconds to wait before resolving the promise.
 * @returns A promise that resolves after the specified delay.
 */
export function wait(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * Creates a promise that resolves on the next animation frame.
 * @returns A promise that resolves when the browser is ready to perform the next animation.
 */
export function frame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

export function interact() {
  return new Promise((resolve) =>
    InteractionManager.runAfterInteractions(() => {
      resolve(true);
    })
  );
}
