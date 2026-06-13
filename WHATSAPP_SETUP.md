# WhatsApp Number Setup

This app opens WhatsApp using links like:

```text
https://wa.me/YOUR_NUMBER?text=YOUR_MESSAGE
```

## Correct Number Format

Use your WhatsApp number in international format:

```text
country_code + phone_number
```

Do not include:

- `+`
- spaces
- dashes
- parentheses

Examples:

```text
237612345678
14155552671
33612345678
```

## 1. Update the Floating WhatsApp Button

Open:

```text
client/src/App.tsx
```

Find:

```tsx
<WhatsAppButton 
  phoneNumber="1234567890"
  message="Hello! I'm interested in FIFA World Cup tickets. Could you please provide availability and pricing information?"
/>
```

Replace `1234567890` with your real WhatsApp number.

Example:

```tsx
<WhatsAppButton 
  phoneNumber="237612345678"
  message="Hello! I'm interested in FIFA World Cup tickets. Could you please provide availability and pricing information?"
/>
```

## 2. Update WhatsApp Links in Other Pages

Some pages also open WhatsApp directly with:

```tsx
https://wa.me/1234567890
```

Search the project for:

```text
1234567890
```

Replace every occurrence with your real number.

Important files may include:

```text
client/src/pages/Contact.tsx
client/src/pages/Packages.tsx
client/src/pages/MatchDetail.tsx
client/src/components/WhatsAppButton.tsx
client/src/App.tsx
```

## 3. Test the Link

After updating the number, restart the app and click the WhatsApp button.

The browser should open:

```text
https://wa.me/YOUR_NUMBER?text=...
```

If WhatsApp says the number is invalid, check that:

- the number includes the country code
- there is no `+`
- there are no spaces
- the number is active on WhatsApp

## Example for Cameroon

If your number is:

```text
+237 6 12 34 56 78
```

Use:

```text
237612345678
```
