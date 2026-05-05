# PackFlow — Product Customization Flow

PackFlow is a polished one-page Bootstrap/Sass/Vanilla JavaScript prototype for a branded takeaway packaging e-commerce flow. It is inspired by companies like Limepack, where customers need to choose packaging, understand print options, see instant pricing, and continue toward checkout with confidence.

## Goal

The project focuses on reducing friction in product customization and checkout readiness. Instead of pushing users into a slow manual sales flow, PackFlow guides them through product selection, customization, live pricing, and a clear order summary.

## UX Problems Addressed

- Customers may not understand packaging options.
- Price uncertainty can block conversion.
- Long forms can feel overwhelming.
- Users need guidance before committing to checkout.

## Solution

- Product selection cards with active states and starting prices.
- Guided customization form with helpful helper text.
- Live price calculation based on product, quantity, print colors, and design help.
- Sticky order summary on desktop.
- Inline validation before continuing to checkout.
- Responsive Bootstrap layout that works from mobile to desktop.

## Tech Stack

- HTML5
- Sass
- Bootstrap 5
- Vanilla JavaScript
- Optional PHP mock handler

## Key Features

- Four customizable packaging products: coffee cups, burger boxes, paper bags, and salad bowls.
- Dynamic size options based on selected product.
- Quantity discounts and print color fees.
- DKK currency formatting.
- Checkout-oriented success state for the prototype.
- Accessible form labels, inline errors, and visible focus states.
- Mobile-first responsive behavior.
- AI-generated product photography.
- `quote-request.php` mock POST handler with basic sanitization, included only to show how submitted configuration data could be handled server-side.

## What I Would Improve Next

- Connect real product data from a backend.
- Track form drop-off.
- A/B test shorter vs longer forms.
- Save order configuration progress.
- Integrate with cart, checkout, and payment.
- Add real file upload validation.

## Running the Project

Open `index.html` directly in a browser, or serve the folder with any static server.

The project is suitable for GitHub Pages, Netlify, or another static hosting platform. The PHP file is optional and only demonstrates how submitted configuration data could be handled server-side in a PHP-based system.
