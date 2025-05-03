/**
 * Represents the data needed to generate a QR code.
 */
export interface QrCodeData {
  /**
   * The URL or text to be encoded in the QR code. Max length 500 chars.
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

  if (data.length > 500) {
    throw new Error("QR code data exceeds maximum length of 500 characters.");
  }
  if (size > 1000) {
      throw new Error("QR code size cannot exceed 1000 pixels.");
  }

  const encodedData = encodeURIComponent(data);
  const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodedData}&size=${size}x${size}&color=${foregroundColor}&bgcolor=${backgroundColor}&format=png&qzone=1`; // qzone for quiet zone border

  try {
    // In a browser environment, the URL itself can be used directly as the image source.
    // No need to fetch and convert to base64 unless specifically required for embedding or other processing.
    // If base64 is truly needed:
    // const response = await fetch(apiUrl);
    // if (!response.ok) {
    //   throw new Error(`QR code generation failed with status: ${response.status}`);
    // }
    // const blob = await response.blob();
    // const reader = new FileReader();
    // const dataUrl = await new Promise<string>((resolve, reject) => {
    //   reader.onloadend = () => resolve(reader.result as string);
    //   reader.onerror = reject;
    //   reader.readAsDataURL(blob);
    // });
    // return { imageUrl: dataUrl };

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
