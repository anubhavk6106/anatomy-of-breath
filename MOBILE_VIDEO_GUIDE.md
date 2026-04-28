# Mobile Video Implementation Guide

## ✅ Status: Mobile Video Enabled

The VideoBackground component has been updated to **show video on mobile devices** with optimized settings for better performance and compatibility.

## What Changed

### Previous Behavior
- Mobile devices (width < 768px) showed only a static poster image
- Video was completely disabled on mobile for performance reasons

### Current Behavior
- Mobile devices now show video using MP4 format (better mobile compatibility)
- Desktop devices use WebM format with MP4 fallback (better compression)
- Video is still skipped for:
  - Users with `prefers-reduced-motion` enabled (accessibility)
  - Slow connections (2G or slow-2G)

## Technical Implementation

### VideoBackground Component
```jsx
<VideoBackground
  src="/videos/creation.webm"        // Desktop: WebM (best compression)
  srcMp4="/videos/creation.mp4"      // Desktop fallback & Mobile primary
  srcMobile="/videos/creation.mp4"   // Optional: mobile-optimized version
  poster="/images/creation-poster.jpg" // Fallback image
  onEnded={handleVideoEnded}
/>
```

### Video Format Strategy
- **Desktop**: WebM → MP4 fallback
- **Mobile**: MP4 (or `srcMobile` if provided)
- **Accessibility**: Poster image for reduced motion
- **Performance**: Poster image for slow connections

## Current Video Files

### ✅ Available
- `/public/videos/creation.mp4` - Main video file

### ⚠️ Missing (Optional)
- `/public/videos/creation.webm` - Desktop optimized (WebM format)
- `/public/images/creation-poster.jpg` - Fallback poster image

## Recommendations

### 1. Add Poster Image (Recommended)
Create a poster image for better UX during video loading and as fallback:

```bash
# Create images directory
mkdir public/images

# Extract a frame from your video as poster (using FFmpeg)
ffmpeg -i public/videos/creation.mp4 -ss 00:00:01 -vframes 1 -q:v 2 public/images/creation-poster.jpg
```

### 2. Create WebM Version (Optional - Better Desktop Performance)
WebM provides better compression than MP4 for desktop browsers:

```bash
# Convert MP4 to WebM with good quality
ffmpeg -i public/videos/creation.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus public/videos/creation.webm
```

### 3. Create Mobile-Optimized Video (Optional - Better Mobile Performance)
For large videos, create a smaller version for mobile:

```bash
# Create mobile-optimized version (lower resolution, smaller file size)
ffmpeg -i public/videos/creation.mp4 \
  -vf "scale=720:-2" \
  -c:v libx264 \
  -crf 28 \
  -preset fast \
  -c:a aac \
  -b:a 96k \
  public/videos/creation-mobile.mp4
```

Then update PortalPage.jsx:
```jsx
<VideoBackground
  src="/videos/creation.webm"
  srcMp4="/videos/creation.mp4"
  srcMobile="/videos/creation-mobile.mp4"  // Add this line
  poster="/images/creation-poster.jpg"
  onEnded={handleVideoEnded}
/>
```

## Testing on Mobile

### How to Test
1. Open the dev server on your mobile device: `http://[your-ip]:5174/`
2. Navigate to the Portal page
3. Video should autoplay (muted) on mobile

### Troubleshooting

**Video not playing on mobile?**
- Ensure the video file exists at `/public/videos/creation.mp4`
- Check browser console for errors
- Verify the video is encoded properly (H.264 codec for MP4)
- Some browsers require user interaction before autoplay - the `playsInline` attribute helps

**Video loads slowly on mobile?**
- Create a mobile-optimized version (see recommendation #3 above)
- Reduce video resolution to 720p or lower
- Increase compression (higher CRF value = smaller file)

**Video doesn't show but poster does?**
- This is expected for users with:
  - `prefers-reduced-motion` enabled in their device settings
  - Slow network connections (2G/slow-2G)
- This is intentional for accessibility and performance

## Performance Metrics

### Current Setup
- **Desktop**: WebM (if available) or MP4
- **Mobile**: MP4 format
- **Attributes**: `autoPlay`, `muted`, `loop`, `playsInline`

### Best Practices Applied
✅ `playsInline` - Prevents fullscreen on iOS  
✅ `muted` - Required for autoplay on mobile  
✅ `autoPlay` - Starts video automatically  
✅ Adaptive format selection based on device  
✅ Accessibility support (reduced motion)  
✅ Performance optimization (slow connection detection)

## All Tests Passing ✅

67/67 tests passing, including:
- Property 9: VideoBackground skip conditions
- Property 10: Appropriate video sources for device type
- Mobile video rendering with MP4 format
- Desktop video rendering with WebM + MP4 fallback

## Next Steps

1. **Test on your mobile device** - Visit the Portal page and verify video plays
2. **Add poster image** (recommended) - Improves loading experience
3. **Optimize video file** (optional) - Create WebM and mobile versions if needed
4. **Monitor performance** - Check video load times on different devices

---

**Need help?** Check the browser console for any video loading errors.
