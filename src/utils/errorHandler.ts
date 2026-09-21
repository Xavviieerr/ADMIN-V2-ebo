/**
 * Extracts the error message from an API error response.
 * The error response format is:
 * {
 *   "message": ["Error message here"],
 *   "error": "Bad Request",
 *   "statusCode": 400
 * }
 * 
 * @param error - The error object from RTK Query or other API calls
 * @param defaultMessage - A fallback message if error extraction fails
 * @returns The first element from the message array, or a default message
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getErrorMessage(error: any, defaultMessage: string = "An error occurred"): string {
  // Check if error has a data property (RTK Query format)
  if (error?.data?.message) {
    const message = error.data.message;
    
    // If message is an array, return the first element
    if (Array.isArray(message) && message.length > 0) {
      return message[0];
    }
    
    // If message is a string, return it
    if (typeof message === "string") {
      return message;
    }
  }
  
  // Check if error has a direct message property
  if (error?.message) {
    if (Array.isArray(error.message) && error.message.length > 0) {
      return error.message[0];
    }
    if (typeof error.message === "string") {
      return error.message;
    }
  }
  
  // If error is a string, return it
  if (typeof error === "string") {
    return error;
  }
  
  // If error is an Error instance, return its message
  if (error instanceof Error) {
    return error.message;
  }
  
  // Fallback to default message
  return defaultMessage;
}

