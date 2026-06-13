# EmailJS Setup Guide

This app uses EmailJS to send ticket verification confirmation emails from the `/verify-ticket` page.

## 1. Create or Open Your EmailJS Account

Go to:

```text
https://www.emailjs.com/
```

Sign in or create an account.

## 2. Add an Email Service

1. Open the EmailJS dashboard.
2. Go to **Email Services**.
3. Click **Add New Service**.
4. Choose your email provider, for example Gmail, Outlook, or another supported service.
5. Connect and test the service.
6. Copy the **Service ID**.

You will use it as:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
```

## 3. Create an Email Template

1. Go to **Email Templates**.
2. Click **Create New Template**.
3. Set the template recipient email field to:

```text
{{to_email}}
```

4. Add this subject:

```text
{{subject}}
```

5. Add this message body:

```text
Hello,

Your FIFA ticket verification request has been received.

Ticket code: {{ticket_code}}
Verification reference: {{verification_reference}}

{{message}}
```

6. Save the template.
7. Copy the **Template ID**.

You will use it as:

```env
VITE_EMAILJS_TEMPLATE_ID=your_template_id
```

## 4. Get Your Public Key

1. In EmailJS, go to **Account**.
2. Find your **Public Key**.
3. Copy it.

You will use it as:

```env
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

## 5. Create Your Local `.env` File

In the project root, create a file named:

```text
.env
```

Add your real EmailJS values:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Do not commit `.env` to Git.

## 6. Restart the App

After editing `.env`, restart the dev server:

```powershell
$env:NODE_ENV="development"
npx tsx watch server/_core/index.ts
```

Then open:

```text
http://localhost:3000/
```

If port `3000` is busy, use the port printed by the terminal, such as `3001`.

## 7. Test the Verify Ticket Page

Go to:

```text
http://localhost:3000/verify-ticket
```

Enter:

- a ticket code
- an email address

Submit the form. EmailJS should send the confirmation email to the entered address.

## Template Variables Used by the App

The app sends these variables to EmailJS:

```text
to_email
email
ticket_code
verification_reference
subject
message
```

Make sure your EmailJS template uses the same names.
