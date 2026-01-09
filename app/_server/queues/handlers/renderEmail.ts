/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Isolated email rendering module with React 19 compatibility shim
 * This module handles email rendering with workarounds for React-Email v5.x compatibility issues
 */

// React 19 compatibility shim
function setupReactCompatibility() {
  try {
    const React = require('react');

    // Ensure React.version exists and is accessible
    if (React && !React.version) {
      try {
        const reactPackage = require('react/package.json');
        if (reactPackage && reactPackage.version) {
          Object.defineProperty(React, 'version', {
            value: reactPackage.version,
            writable: false,
            enumerable: true,
            configurable: false,
          });
        }
      } catch {
        // Fallback: set a version that @react-email/render might accept
        Object.defineProperty(React, 'version', {
          value: '19.0.0',
          writable: false,
          enumerable: true,
          configurable: false,
        });
      }
    }

    return React;
  } catch (error) {
    throw new Error(`React is not available: ${error}`);
  }
}

function getRenderFunction() {
  try {
    // Set up React compatibility before loading @react-email/render
    setupReactCompatibility();

    // Use require() to prevent build-time analysis
    const renderModule = require('@react-email/render');
    return renderModule.render || renderModule.default || renderModule;
  } catch (error) {
    throw new Error(`Failed to load @react-email/render: ${error}`);
  }
}

export async function renderEmailComponent(component: any): Promise<string> {
  const render = getRenderFunction();
  return await render(component);
}
