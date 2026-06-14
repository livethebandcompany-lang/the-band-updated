# Deployment Guide for The Band Company

## Before Deploying

### 1. Update Environment Variables

Create a `.env.local` file (or configure in your hosting platform):

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

**Replace `yourdomain.com` with your actual domain name!**

### 2. Update Site Configuration

The site configuration is in `src/config/site.ts`. Update these values:
- `url`: Your production domain
- `phone`: Contact phone number (currently: 7779945379)
- `whatsapp.number`: WhatsApp contact number
- `social`: Your social media links

### 3. Verify All URLs

Before deploying, make sure all these features use the production URL:
- ✅ Blog share buttons
- ✅ WhatsApp links
- ✅ Phone call links
- ✅ Social media links

## Deployment Platforms

### Vercel (Recommended for Next.js)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Set environment variable in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add: `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com`

### Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variable: `NEXT_PUBLIC_SITE_URL`

### Custom Server

1. Build the project:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

3. Set environment variable before starting:
```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com npm start
```

## After Deployment

### Test These Features:
- [ ] Blog share button (copies correct production URL)
- [ ] WhatsApp button (opens with correct message)
- [ ] All call buttons work (7779945379)
- [ ] Search functionality works
- [ ] Category filters work
- [ ] Table of contents navigation
- [ ] Breadcrumbs navigation
- [ ] Mobile responsiveness

### SEO Checklist:
- [ ] Update `robots.txt` if needed
- [ ] Add sitemap.xml
- [ ] Verify meta tags
- [ ] Test Open Graph preview (Facebook/Twitter)
- [ ] Submit to Google Search Console

## Share URL Format

Once deployed, your blog share URLs will be:
```
https://yourdomain.com/blog/top-10-live-music-ideas-memorable-sangeet-night
https://yourdomain.com/blog/how-to-plan-perfect-wedding-music
```

The share button will automatically use your production domain! 🎉
