// Static default avatar image - Female professional profile image
// This is a static profile image that will be used for all employees by default
// To use your own image:
// 1. Place your image file in the public folder (e.g., 'default-avatar.jpg')
// 2. Change the path below to: '/default-avatar.jpg'
const DEFAULT_AVATAR = 'https://files.idyllic.app/files/static/2894792?width=384&optimizer=image'; // Female professional profile image

// Helper function to generate avatar image URLs
export const getEmployeeAvatar = (employee) => {
  if (employee?.profileImage) {
    return employee.profileImage;
  }
  
  // Return static default image from public folder
  return DEFAULT_AVATAR;
};

// Generate avatar for small sizes (like in lists)
export const getSmallAvatar = (employee, size = 40) => {
  if (employee?.profileImage) {
    return employee.profileImage;
  }
  
  // Return static default image from public folder
  // Same image is used for all sizes, CSS will handle resizing
  return DEFAULT_AVATAR;
};

// Get initials as fallback
export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
