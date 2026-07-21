'use client';

import Script from 'next/script';

export default function GoogleTranslate() {
  return (
    <>
      <Script
        id="google-translate-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              // Desktop widget
              if (document.getElementById('google_translate_element')) {
                new google.translate.TranslateElement(
                  { pageLanguage: 'en', autoDisplay: true, layout: google.translate.TranslateElement.InlineLayout.SIMPLE },
                  'google_translate_element'
                );
              }
              // Mobile widget
              if (document.getElementById('google_translate_element_mobile')) {
                new google.translate.TranslateElement(
                  { pageLanguage: 'en', autoDisplay: false, layout: google.translate.TranslateElement.InlineLayout.SIMPLE },
                  'google_translate_element_mobile'
                );
              }
            }
          `,
        }}
      />
      <Script
        id="google-translate-lib"
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <style>{`
        .goog-te-banner-frame { display: none !important; }
        body { top: 0 !important; }
        #google_translate_element,
        #google_translate_element_mobile { display: inline-flex; align-items: center; }
        .goog-te-gadget { font-family: inherit !important; font-size: 13px !important; }
        .goog-te-gadget-simple {
          background: transparent !important;
          border: 1px solid rgba(0,0,0,0.15) !important;
          border-radius: 6px !important;
          padding: 4px 10px !important;
          cursor: pointer;
        }
        .goog-te-gadget-simple span,
        .goog-te-menu-value { color: inherit !important; }
        .goog-logo-link { display: none !important; }
      `}</style>
    </>
  );
}
