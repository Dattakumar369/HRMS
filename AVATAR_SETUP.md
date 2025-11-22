# Employee Avatar Setup

## Static Image Configuration

The employee profile now uses a **single static image** for all employees by default.

### Current Setup

The system uses a static professional profile image from `pravatar.cc`. This same image will appear for all employees who haven't uploaded a custom profile picture.

### To Use Your Own Static Image

1. **Add your image file:**
   - Place your image in the `public` folder
   - Name it `default-avatar.jpg` (or any name you prefer)
   - Recommended size: 200x200px or larger (square format)
   - Supported formats: JPG, PNG, GIF, WebP

2. **Update the code:**
   - Open `src/utils/avatarHelper.js`
   - Change the `DEFAULT_AVATAR` constant:
   ```javascript
   const DEFAULT_AVATAR = '/default-avatar.jpg';
   ```

### How It Works

- **Default**: All employees see the same static image
- **Custom**: Employees can upload their own profile pictures
- **Fallback**: If image fails to load, initials are displayed

### Image Upload Locations

Employees can upload custom profile pictures:
- **Employee Profile page**: Click the camera icon on the profile picture
- **Admin Employee Management**: When adding/editing employees

Uploaded images are stored in sessionStorage as base64 data and override the default static image.

