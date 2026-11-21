# Spark Academy website

A lightweight, responsive static website built for the supplied Spark Academy logo kit. Open `index.html` directly or serve this directory with any static web server.

## Brand assets and imagery

- `assets/spark-academy-logo.png` is the original horizontal logo from the supplied kit.
- `assets/03_Dark_Background_Logo.png` is used on the footer's navy background.
- `assets/students.jpg`, `assets/classroom.jpg`, and `assets/contact-students.jpg` are AI-generated illustrative photographs. The contact image uses the supplied Spark Academy mark as a small chest badge on each uniform. Replace these with approved academy photography when available.
- Brand colors and typography follow `Spark_Academy_Logo_Kit/README.txt`: #1565FF, #3B82F6, #0F1E4D, #FF7A00 and Montserrat.

## Academy information to confirm before launch

The learning areas and descriptions in the course cards are explicitly labeled examples. Replace their copy with the academy's actual current offerings. Achievement cards intentionally contain no invented names, photos, or results. Branch names, addresses, phones, hours, and facilities remain placeholders in `script.js` and `index.html`; add confirmed map locations before enabling the directions link. Footer contact and social links also need the academy's approved information.

## Enquiry form integration

The form validates required fields and Indian mobile numbers in the browser. It does not claim success or send data while no backend is configured. To connect it, add this tag in `index.html`'s `<head>` with the academy's real HTTPS endpoint:

```html
<meta name="enquiry-endpoint" content="https://your-domain.example/api/enquiries">
```

The endpoint must accept a JSON `POST` with `name`, `phone`, `course`, and `branch`, return a 2xx response only after accepting the enquiry, and handle consent, retention, abuse protection, and server-side validation. Until then, the form reports that no details were sent.

## SEO and deployment

The page includes descriptive title/description, Open Graph basics, semantic headings, alt text, and generic EducationalOrganization structured data. Add the verified production domain as canonical URL and in `sitemap.xml` when the domain is known; no domain was provided, so neither is fabricated here. Configure privacy and terms content and the approved social profiles before launch.
