# Legal and content launch review

This is a technical audit and draft, not a determination of legal compliance. Do not launch the site until the business owner and qualified Turkish counsel complete the items below. GDPR applicability depends on the actual business, audience and processing; it cannot be established from source code alone.

## Required business decisions and evidence

- Supply and verify the full legal name and form of the data controller, registered address, applicable trade registration/MERSİS and tax details, and a valid contact method. The existing phone, address and email in `src/config.js` are unverified. Populate the legal pages and site footer with the confirmed details.
- Map actual processing, purposes, lawful bases, recipients, retention periods, access and deletion procedures, and complete the privacy notice accordingly. A notice and consent are separate concepts; a checkbox acknowledging WhatsApp navigation is not a legal basis for all processing or a marketing opt-in. Assess WhatsApp use and any international transfers and document the appropriate transfer mechanism. Confirm how users can exercise their rights.
- Establish and publish actual cancellation, deposit and refund terms. Determine whether any transaction concluded over WhatsApp is a distance contract and provide applicable pre-contractual disclosures and withdrawal rights. The current page does not assert an unverified fee or override statutory rights.
- Confirm rights to the supplied logo before publication. Gallery files were not present and the gallery is not displayed; obtain licensed photos and record permissions, attribution requirements and any releases before adding images. Example testimonials and unverified graphs and performance estimates are not displayed. Verify any future reviews and claims before publishing them.
- Review tuning services and copy against applicable vehicle emissions, safety, inspection, insurance and warranty rules. Determine which markets the site targets and whether GDPR, EU consumer law and local implementations of ePrivacy rules apply.
- Verify server, CDN, hosting and security logs, retention, processors, and cross-border transfers in the actual deployment. Monitor third-party scripts, embeds, and cookies after deployment and after every integration. Configure consent before optional trackers are loaded, with equally accessible acceptance and rejection and a way to withdraw where required.

## Current technical data flows

- No analytics, advertising scripts, third-party embeds, cookie writes or local-storage use are present in the active application source. Google Fonts network requests have been removed. No cookie banner is included for the current application; this conclusion depends on the final hosting/CDN configuration and must be reassessed if tracking is introduced.
- Forms prepare a WhatsApp URL in the browser and open it only after the user acts. The resulting text is sent to WhatsApp as part of the URL; the message is not sent until the user confirms it in WhatsApp. Form data is not submitted to an application backend. Name, vehicle and message are optional; duplicate phone collection was removed. The notice provides phone and email alternatives. Third-party services can process data under their own terms.
- Outbound links to WhatsApp, Instagram and Google Maps are user-initiated, not embedded content. The reverse proxy or hosting provider may collect IP addresses and request logs; inspect the deployed configuration before finalizing the notice.

## Primary references

- [Turkish Data Protection Authority: notice obligation](https://www.kvkk.gov.tr/Icerik/2033/Aydinlatma-Yukumlulugu-)
- [Turkish Data Protection Authority: notice guidance and accessibility](https://www.kvkk.gov.tr/Icerik/6765/AYDINLATMA-YUKUMLULUGUNUN-YERINE-GETIRILMESI-HAKKINDA-KAMUOYU-DUYURUSU)
- [Turkish Data Protection Authority: separate notices and consent](https://www.kvkk.gov.tr/Icerik/8710/veri-sorumlulari-tarafindan-acik-riza-ve-aydinlatma-metinlerinin-ayri-ayri-duzenlenmesi-gerektigi-hakkinda-kisisel-verileri-koruma-kurulunun-18-02-2026-tarihli-ve-2026-347-sayili-ilke-kararina-iliskin-kamuoyu-duyurusu)
- [Turkish Data Protection Authority: cookie guidance](https://www.kvkk.gov.tr/Icerik/7353/Cerez-Uygulamalari-Hakkinda-Rehber)
- [Turkish Data Protection Authority: cookie decision and opt-in](https://www.kvkk.gov.tr/Icerik/7595/2022-1358)
- [Turkish Data Protection Authority: international transfers](https://www.kvkk.gov.tr/Icerik/2053/Yurtdisina-Aktarim)
- [Turkish Ministry of Trade: distance contracts](https://tuketici.ticaret.gov.tr/yayinlar/tuketici-bilgi-rehberi/mesafeli-sozlesmeler-hakkinda-bilgilendirme)
- [GDPR, including Article 13](https://eur-lex.europa.eu/eli/reg/2016/679)
- [European Data Protection Board: GDPR territorial scope](https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-32018-territorial-scope-gdpr-article-3-version_en)
- [European Data Protection Board: ePrivacy technical scope](https://www.edpb.europa.eu/system/files/2023-11/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_en.pdf)
