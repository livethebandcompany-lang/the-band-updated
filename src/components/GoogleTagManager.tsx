'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID; // GTM-KCGHQC7L
const GA_ID  = process.env.NEXT_PUBLIC_GA_ID;  // G-QRDB8X93ZR

export default function GoogleTagManager() {
  const pathname = usePathname();

  // Fire pageview on every SPA navigation
  useEffect(() => {
    if ((window as any).gtag && GA_ID) {
      (window as any).gtag('config', GA_ID, { page_path: pathname });
    }
  }, [pathname]);

  if (!GTM_ID && !GA_ID) return null;

  return (
    <>
      {/* GTM — handles everything including GA4 */}
      {GTM_ID && (
        <Script id="gtm" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html:
          `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`
        }} />
      )}

      {/* GA4 direct — used for SPA pageview tracking above */}
      {GA_ID && (
        <>
          <Script id="ga4" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html:
            `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:true});`
          }} />
        </>
      )}

      {/* Noscript fallback */}
      {GTM_ID && (
        <noscript>
          <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
        </noscript>
      )}
    </>
  );
}
