# Installer Assets

This directory contains assets for the installer and application.

## Required Files

### Application Icons
- `icon.ico` - Windows application icon (256x256, multi-size ICO)
- `icon.icns` - macOS application icon
- `icon.png` - Linux application icon (512x512)
- `tray-icon.png` - System tray icon (16x16 or 22x22)

### Installer Graphics (Windows NSIS)
- `installer-header.bmp` - Header image (150x57 pixels, 24-bit BMP)
- `installer-sidebar.bmp` - Sidebar image (164x314 pixels, 24-bit BMP)

### License
- `license.txt` - License agreement shown during installation

## Creating Icons

### Using an image editor:
1. Create a 512x512 PNG with your logo
2. Convert to ICO (multi-size: 16, 32, 48, 64, 128, 256)
3. Convert to ICNS for macOS
4. Create 150x57 and 164x314 BMP files for installer graphics

### Using online tools:
- https://icoconvert.com/ - PNG to ICO
- https://cloudconvert.com/ - Various conversions

### Recommended design:
- Use the CloakNet green (#10b981) as the primary color
- Include a shield or lock icon to convey security
- Keep the design simple and professional

## Placeholder Files

If you need to build without custom graphics, electron-builder will use default 
icons. The NSIS graphics are optional and will be skipped if not present.
