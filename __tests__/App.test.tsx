/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('renders the whole provider tree and navigator without throwing', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<App />);
  });

  expect(tree).toBeDefined();

  // Unmount so the shimmer loops and listing timers are torn down with it.
  await ReactTestRenderer.act(() => {
    tree?.unmount();
  });
});
