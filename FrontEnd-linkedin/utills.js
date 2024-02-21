export const checkImageURL = (url) => {
  if (!url) return false;

  const firebaseDomain = "https://firebasestorage.googleapis.com";

  if (url.includes(firebaseDomain)) {
    return true; // URL contains the firebase domain
  } else {
    // Check for a normal image URL using a regular expression
    const pattern = /\.(png|jpg|jpeg|bmp|gif|webp)$/i;
    return pattern.test(url);
  }
};

export const generateKey = () => {
  const timestamp = new Date().getTime();
  return `${timestamp}`;
};

export function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}
export function validatePassword(password) {
  // At least 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character
  const re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
}
