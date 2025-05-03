
/**
 * Represents the data needed to generate a QR code.
 */
export interface QrCodeData {
  /**
   * The URL to be encoded in the QR code. Max length 500 chars.
   */
  data: string;
  /**
   * Size of the QR code image in pixels. Default 150. Max 1000.
   */
  size?: number;
  /**
   * Foreground color hex code (e.g., 000000 for black). Default 000000.
   */
  foregroundColor?: string;
  /**
   * Background color hex code (e.g., FFFFFF for white). Default FFFFFF.
   */
  backgroundColor?: string;
}

/**
 * Represents a QR code image.
 */
export interface QrCode {
  /**
   * The data url of the QR code image.
   */
  imageUrl: string;
}

/**
 * Asynchronously generates a QR code image for the given data using the goqr.me API.
 *
 * @param qrCodeData The data to encode in the QR code and optional styling.
 * @returns A promise that resolves to a QrCode object containing the image data url.
 * @throws {Error} If the data exceeds 500 characters or size exceeds 1000px.
 */
export async function generateQrCode(qrCodeData: QrCodeData): Promise<QrCode> {
  const { data, size = 150, foregroundColor = '000000', backgroundColor = 'FFFFFF' } = qrCodeData;

  // Basic validation for URL format - more robust validation happens via Zod in the form
  if (!data.startsWith('http://') && !data.startsWith('https://')) {
      // Note: This is a basic check. Zod schema handles the main validation.
      console.warn("QR code data does not appear to be a standard URL.");
  }

  if (data.length > 500) {
    // Keep this check as a safeguard, though URLs are unlikely to hit this often
    throw new Error("QR code data exceeds maximum length of 500 characters.");
  }
  if (size > 1000) {
      throw new Error("QR code size cannot exceed 1000 pixels.");
  }

  const encodedData = encodeURIComponent(data);
  const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodedData}&size=${size}x${size}&color=${foregroundColor}&bgcolor=${backgroundColor}&format=png&qzone=1`; // qzone for quiet zone border

  try {
    // Return the API URL directly for use in <img> src
    return { imageUrl: apiUrl };

  } catch (error) {
    console.error("Error generating QR code:", error);
    // Fallback to a simple placeholder or rethrow a more specific error
     return {
       imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkAQMAAABKLAcXAAAABlBMVEUAAAD///+l2Z/dAAAAM0lEQVR4nGP4/5+BgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYEBDAAAG5ES+Rk+GxoAAAAASUVORK5CYII=', // Simple error placeholder
     };
    // Or: throw new Error("Failed to generate QR code from external API.");
  }
}
