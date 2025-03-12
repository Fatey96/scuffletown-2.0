/**
 * Cloudinary configuration and utility functions
 */

// Check if Cloudinary is properly configured
export function isCloudinaryConfigured() {
  return (
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  );
}

// Get Cloudinary configuration
export function getCloudinaryConfig() {
  return {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  };
}

/**
 * Uploads a file to Cloudinary using our secure server API route
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} - The upload result or error
 */
export async function uploadToCloudinary(file) {
  try {
    if (!isCloudinaryConfigured()) {
      console.error('Cloudinary is not configured properly');
      throw new Error('Cloudinary configuration is missing. Please check your environment variables.');
    }

    const { cloudName } = getCloudinaryConfig();
    
    console.log('Starting Cloudinary upload via server API', {
      cloudName,
      fileSize: file.size,
      fileType: file.type
    });

    // Convert the file to base64
    const reader = new FileReader();
    const fileBase64Promise = new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
    reader.readAsDataURL(file);
    const fileBase64 = await fileBase64Promise;
    
    // Send to our server API
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: fileBase64 }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Upload failed:', errorData);
      throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorData.error || 'Unknown error'}`);
    }
    
    const data = await response.json();
    console.log('Upload successful:', data.secure_url);
    return data;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

/**
 * Helper function to extract the public ID from a Cloudinary URL
 * @param {string} url - The Cloudinary URL
 * @returns {string|null} - The public ID or null if not found
 */
export function getPublicIdFromUrl(url) {
  if (!url) return null;
  
  try {
    // Extract the public ID from a Cloudinary URL
    // URL format: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/public-id.jpg
    const urlParts = url.split('/');
    const filenamePart = urlParts[urlParts.length - 1];
    const publicId = filenamePart.split('.')[0]; // Remove file extension
    return publicId;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
} 