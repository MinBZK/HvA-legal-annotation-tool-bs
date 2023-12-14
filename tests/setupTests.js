// setupTests.js
import '@testing-library/svelte/cleanup-after-each';
import '@testing-library/jest-dom/extend-expect';
import { configure } from '@testing-library/svelte';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;

configure({
  testIdAttribute: 'data-test',
});
