import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import dbConnect from '../../../../../../lib/mongodb';
import Certificate from '../../../../../../models/Certificate';

// Cache loaded font base64 string in memory
let cachedFontBase64 = null;
function getFontBase64() {
    if (!cachedFontBase64) {
        let fontPath = path.join(process.cwd(), 'public', 'assets', 'fonts', 'BricolageGrotesque-Bold.ttf');
        if (!fs.existsSync(fontPath)) {
            fontPath = path.join(process.cwd(), 'public', 'assets', 'fonts', 'BricolageGrotesque-Regular.ttf');
        }
        if (fs.existsSync(fontPath)) {
            cachedFontBase64 = fs.readFileSync(fontPath).toString('base64');
        }
    }
    return cachedFontBase64;
}

/**
 * GET /api/certificates/[certNo]/png?download=true
 * 
 * Generate a certificate PNG by compositing the candidate name and cert number
 * onto the template image using Bricolage Grotesque font.
 */
export async function GET(req, { params }) {
    try {
        const { certNo } = await params;

        if (!certNo) {
            return NextResponse.json(
                { success: false, error: 'Certificate number is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const certificate = await Certificate.findOne({
            certificateNo: certNo.toUpperCase(),
        });

        if (!certificate) {
            return NextResponse.json(
                { success: false, error: 'Certificate not found' },
                { status: 404 }
            );
        }

        // Load the certificate template
        let templatePath = path.join(process.cwd(), 'public', 'assets', 'template.png');
        if (!fs.existsSync(templatePath)) {
            templatePath = path.join(process.cwd(), 'public', 'assets', 'certificate-template.png');
        }
        if (!fs.existsSync(templatePath)) {
            return NextResponse.json(
                { success: false, error: 'Certificate template not found' },
                { status: 500 }
            );
        }

        const fontBase64 = getFontBase64();
        const fontFaceStyle = fontBase64 ? `
            @font-face {
                font-family: 'Bricolage Grotesque';
                src: url('data:font/ttf;charset=utf-8;base64,${fontBase64}') format('truetype');
                font-weight: 700;
                font-style: normal;
            }
        ` : '';

        // Get template dimensions
        const templateMetadata = await sharp(templatePath).metadata();
        const width = templateMetadata.width || 2000;
        const height = templateMetadata.height || 1414;

        // Coordinates aligned with template layout
        const nameX = 135;
        const nameY = 282;
        const certNoX = 1747;
        const certNoY = 1264;

        // Escape XML entities for safety
        const safeName = (certificate.candidateName || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');

        const safeCertNo = (certificate.certificateNo || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');

        // Create SVG overlay with text
        const svgOverlay = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      ${fontFaceStyle}
      .name-text {
        font-family: 'Bricolage Grotesque', sans-serif;
        font-size: 71px;
        font-weight: 500;
        fill: #ffc537;
      }
      .cert-text {
        font-family: 'Bricolage Grotesque', sans-serif;
        font-size: 29.5px;
        font-weight: 300;
        fill: #ebebebff;
      }
    </style>
  </defs>

  <!-- Dynamic Candidate Name (top-left) -->
  <text x="${nameX}" y="${nameY}" class="name-text" text-anchor="start" dominant-baseline="hanging">${safeName}</text>

  <!-- Dynamic Certificate Number (bottom-right) -->
  <text x="${certNoX}" y="${certNoY}" class="cert-text" text-anchor="start" dominant-baseline="hanging">${safeCertNo}</text>
</svg>`;

        // Composite SVG overlay onto template image
        const pngBuffer = await sharp(templatePath)
            .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
            .png()
            .toBuffer();

        // Build response with download headers
        const filename = `CyberX_Certificate_${certificate.certificateNo}.png`;
        const headers = new Headers();
        headers.set('Content-Type', 'image/png');
        headers.set('Content-Disposition', `attachment; filename="${filename}"`);
        headers.set('Content-Length', pngBuffer.length.toString());
        headers.set('Cache-Control', 'public, max-age=86400');

        return new Response(pngBuffer, { status: 200, headers });
    } catch (error) {
        console.error('Certificate PNG generation error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate certificate image' },
            { status: 500 }
        );
    }
}
