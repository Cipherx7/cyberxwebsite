/**
 * Client-side certificate image generator using HTML5 Canvas.
 *
 * Loads the certificate template and Bricolage Grotesque font in the browser,
 * draws the candidate name + cert number at precise coordinates, and returns
 * a downloadable PNG blob. This avoids the tofu-box issue caused by limited
 * font support in Vercel's serverless Sharp/librsvg runtime.
 */

// Coordinate constants — must match the template layout
const NAME_X = 135;
const NAME_Y = 282;
const CERT_NO_X = 1747;
const CERT_NO_Y = 1264;

const NAME_FONT_SIZE = 71;
const CERT_FONT_SIZE = 29.5;

const NAME_COLOR = '#ffc537';
const CERT_COLOR = '#ebebeb';

const FONT_FAMILY = 'Bricolage Grotesque';
const FONT_URL_REGULAR = '/assets/fonts/BricolageGrotesque-Regular.ttf';
const TEMPLATE_URL = '/assets/template.jpg';

let fontsLoaded = false;

/**
 * Load both Regular and Bold weights of Bricolage Grotesque into the browser.
 * Canvas doesn't synthesize font weights — each weight needs its own FontFace.
 */
async function ensureFonts() {
    if (fontsLoaded) return;

    try {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const fontUrl = `${origin}${FONT_URL_REGULAR}`;

        const regular = new FontFace(FONT_FAMILY, `url("${fontUrl}")`, {
            weight: '400',
            style: 'normal',
        });

        const loadedRegular = await regular.load();
        document.fonts.add(loadedRegular);

        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }

        if (document.fonts && document.fonts.load) {
            await Promise.allSettled([
                document.fonts.load(`400 ${NAME_FONT_SIZE}px "${FONT_FAMILY}"`),
                document.fonts.load(`400 ${CERT_FONT_SIZE}px "${FONT_FAMILY}"`),
            ]);
        }

        fontsLoaded = true;
    } catch (err) {
        console.warn('Failed to load Bricolage Grotesque font, falling back to sans-serif:', err);
    }
}

/**
 * Load an image from a URL and return an HTMLImageElement.
 */
function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
    });
}

/**
 * Generate a certificate PNG as a Blob using the HTML5 Canvas API.
 *
 * @param {Object} opts
 * @param {string} opts.candidateName  — Name to render on the certificate
 * @param {string} opts.certificateNo  — Certificate number (e.g. CX1234)
 * @returns {Promise<Blob>} PNG blob ready for download
 */
export async function generateCertificateBlob({ candidateName, certificateNo }) {
    // 1. Load font + template in parallel
    const [, templateImg] = await Promise.all([
        ensureFonts(),
        loadImage(TEMPLATE_URL),
    ]);

    // 2. Create canvas matching template dimensions
    const canvas = document.createElement('canvas');
    canvas.width = templateImg.naturalWidth;
    canvas.height = templateImg.naturalHeight;
    const ctx = canvas.getContext('2d');

    // 3. Draw the template
    ctx.drawImage(templateImg, 0, 0);

    // 4. Draw candidate name
    ctx.fillStyle = NAME_COLOR;
    ctx.font = `400 ${NAME_FONT_SIZE}px "${FONT_FAMILY}", sans-serif`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'start';
    ctx.fillText(candidateName || '', NAME_X, NAME_Y);

    // 5. Draw certificate number
    ctx.fillStyle = CERT_COLOR;
    ctx.font = `400 ${CERT_FONT_SIZE}px "${FONT_FAMILY}", sans-serif`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'start';
    ctx.fillText(certificateNo || '', CERT_NO_X, CERT_NO_Y);

    // 6. Export as PNG blob
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) resolve(blob);
                else reject(new Error('Canvas toBlob returned null'));
            },
            'image/png',
            1.0
        );
    });
}

/**
 * Generate and trigger a download of the certificate PNG.
 *
 * @param {Object} opts
 * @param {string} opts.candidateName
 * @param {string} opts.certificateNo
 */
export async function downloadCertificate({ candidateName, certificateNo }) {
    const blob = await generateCertificateBlob({ candidateName, certificateNo });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CyberX_Certificate_${certificateNo}.png`;
    document.body.appendChild(a);
    a.click();

    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}
