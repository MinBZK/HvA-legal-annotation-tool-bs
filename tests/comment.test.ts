// Your test file, e.g., AnnotationComment.test.js
import { describe, expect, it } from 'vitest';
import { render, fireEvent, getByText } from '@testing-library/svelte';
import AnnotationComment from '../src/components/AnnotationComment.svelte';

describe('AnnotationComment', () => {
  it('renders without errors', async () => {
    const { container } = render(AnnotationComment);
    expect(container.textContent).toBe('Lorem Ipsum is simply dummy text of the printing and typesetting industry...');
  });

  it('opens and closes the popup on button click', async () => {
    const { container } = render(AnnotationComment);
    expect(container.querySelector('#popup-container')).toBe(null);

    await fireEvent.click(getByText(container, 'Save Comment'));
    expect(container.querySelector('#popup-container')).not.toBe(null);

    await fireEvent.click(getByText(container, 'Close'));
    expect(container.querySelector('#popup-container')).toBe(null);
  });

  // it('saves comment on button click', async () => {
  //   const { container } = render(AnnotationComment);
  //   await fireEvent.click(getByText(container, 'Save Comment'));

  //   const textarea = container.querySelector('textarea');
  //   if (textarea) {
  //     textarea.value = 'Test Comment';
  //     await fireEvent.input(textarea);

  //     await fireEvent.click(getByText(container, 'Save Comment'));

  //     const commentText = container.querySelector('.comment-text');
  //     if (commentText) {
  //       expect(commentText.textContent).toBe('Test Comment');
  //     } else {
  //       throw new Error('Comment text not found');
  //     }
  //   } else {
  //     throw new Error('Textarea not found');
  //   }
  // });
});
