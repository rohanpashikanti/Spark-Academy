# Spark Academy website

A lightweight, responsive static website built for the supplied Spark Academy logo kit. Open `index.html` directly or serve this directory with any static web server.

## Brand assets and imagery

- `assets/spark-academy-logo.png` is the original horizontal logo from the supplied kit.
- `assets/03_Dark_Background_Logo.png` is used on the footer's navy background.
- `assets/students.jpg`, `assets/classroom.jpg`, and `assets/contact-students.jpg` are AI-generated illustrative photographs. The contact image uses the supplied Spark Academy mark as a small chest badge on each uniform. Replace these with approved academy photography when available.
- Brand colors and typography follow `Spark_Academy_Logo_Kit/README.txt`: #1565FF, #3B82F6, #0F1E4D, #FF7A00 and Montserrat.

## Academy information to confirm before launch

The 12 courses and two branch locations use the information supplied by Spark Academy. The Student journeys section uses images already included in this project; add approved student names and examination results only when verified. Confirm faculty details and review ratings before publishing them. The Sign in button leads to the supplied Tutorly sign-in page.

## Enquiry form integration

The form validates required fields and Indian mobile numbers in the browser. Without a backend it opens a prepared WhatsApp message to the supplied branch number; the visitor must review and send it. No success is claimed before sending. To connect a backend, add this tag in `index.html`'s `<head>` with the academy's real HTTPS endpoint:

```html
<meta name="enquiry-endpoint" content="https://your-domain.example/api/enquiries">
```

The endpoint must accept a JSON `POST` with `name`, `phone`, `course`, and `branch`, return a 2xx response only after accepting the enquiry, and handle consent, retention, abuse protection, and server-side validation. When configured, the site will send directly to that endpoint instead of opening WhatsApp. Update the contact copy and button text at the same time.

## Gallery updates

Add new gallery images to `assets/Gallery/SA` or `assets/Gallery/SN` and create a dated record in `gallery-data.js`. The homepage automatically displays the six most recent records, and the gallery page displays all records. Use descriptive alt text for each new photo.

## SEO and deployment

The page includes descriptive title/description, Open Graph basics, semantic headings, alt text, and generic EducationalOrganization structured data. Add the verified production domain as canonical URL and in `sitemap.xml` when the domain is known; no domain was provided, so neither is fabricated here. Configure privacy and terms content and the approved social profiles before launch.
