#!/usr/bin/env node

/**
 * Export specific frames from Remotion composition for design review
 * Usage: node export-frames.mjs
 */

import { bundle } from '@remotion/bundler';
import { renderFrames, getCompositions } from '@remotion/renderer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Key frames to export for each scene (start frames + mid-point)
const FRAMES_TO_EXPORT = [
  { name: 'Scene0_Start', frame: 0 },
  { name: 'Scene0_Mid', frame: 145 },
  { name: 'Scene1_Start', frame: 291 },
  { name: 'Scene1_Mid', frame: 436 },
  { name: 'Scene2_Start', frame: 582 },
  { name: 'Scene2_Mid', frame: 727 },
  { name: 'Scene3_Start', frame: 873 },
  { name: 'Scene3_Mid', frame: 1018 },
  { name: 'Scene4_Start', frame: 1164 },
  { name: 'Scene4_Mid', frame: 1309 },
  { name: 'Scene5_Start', frame: 1455 },
  { name: 'Scene5_Mid', frame: 1600 },
  { name: 'Scene6_Start', frame: 1746 },
  { name: 'Scene6_Mid', frame: 1891 },
  { name: 'Scene7_Start', frame: 2037 },
  { name: 'Scene7_Mid', frame: 2182 },
  { name: 'Scene8_Start', frame: 2328 },
  { name: 'Scene8_Mid', frame: 2473 },
  { name: 'Scene9_Start', frame: 2619 },
  { name: 'Scene9_Mid', frame: 2764 },
];

async function exportFrames() {
  console.log('🎬 Starting frame export...');

  const outputDir = path.join(__dirname, 'design-review');
  await fs.mkdir(outputDir, { recursive: true });

  console.log('📦 Bundling project...');
  const bundleLocation = await bundle({
    entryPoint: path.join(__dirname, 'src/index.ts'),
    webpackOverride: (config) => config,
  });

  console.log('🔍 Getting compositions...');
  const compositions = await getCompositions(bundleLocation);
  const composition = compositions.find((c) => c.id === 'final');

  if (!composition) {
    throw new Error('Composition "final" not found');
  }

  console.log(`✅ Found composition: ${composition.id} (${composition.durationInFrames} frames)`);
  console.log(`📸 Exporting ${FRAMES_TO_EXPORT.length} frames...\n`);

  for (const { name, frame } of FRAMES_TO_EXPORT) {
    try {
      console.log(`  Rendering ${name} (frame ${frame})...`);

      const { assetsInfo } = await renderFrames({
        config: composition,
        composition,
        bundleLocation,
        onFrameUpdate: () => undefined,
        outputDir,
        onStart: () => undefined,
        onBrowserLog: () => undefined,
        inputProps: composition.defaultProps,
        imageFormat: 'png',
        frameRange: [frame, frame],
      });

      // Rename the output file
      const outputFile = path.join(outputDir, `${name}.png`);
      const tempFile = path.join(outputDir, `element-${frame}.png`);

      await fs.rename(tempFile, outputFile);
      console.log(`  ✓ Saved: ${name}.png`);
    } catch (error) {
      console.error(`  ✗ Failed to render ${name}:`, error.message);
    }
  }

  console.log(`\n✅ Frame export complete! Check the design-review/ folder`);
  console.log(`📁 Location: ${outputDir}`);
}

exportFrames().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
