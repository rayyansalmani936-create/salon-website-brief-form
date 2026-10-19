# Salon Client Intake Form

A responsive, four-step salon website enquiry form for Vercel. The page is `index.html`; the optional email handler is `api/submit.js`.

## Publish the website

1. Upload the files in this folder to the root of the GitHub repository.
2. Import that repository in Vercel.
3. Set **Root Directory** to `./` and **Framework Preset** to **Other**.
4. Leave **Build Command** and **Output Directory** blank, then deploy.

The page can load without email credentials. To send enquiries by email, set these in Vercel under **Project Settings → Environment Variables**, then redeploy:

- `GMAIL_USER`: the Gmail account that will send the notification
- `GMAIL_APP_PASSWORD`: that account's Google App Password; keep it in Vercel only, never in GitHub or website code
- `OWNER_EMAIL`: the inbox that should receive salon enquiries

The form submits to `/api/submit`. Without the environment variables, the page displays an email setup message instead of reporting a false success.
