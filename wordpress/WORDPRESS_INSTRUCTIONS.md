# Adding JetLag Planner to WordPress

This guide walks you through embedding the JetLag Planner on any WordPress page or post using the free [WPCode](https://wordpress.org/plugins/insert-headers-and-footers/) plugin.

---

## Prerequisites

- A self-hosted WordPress site (WordPress.org, not WordPress.com free tier)
- Admin access to install plugins and add snippets

---

## Step 1: Install WPCode

1. In your WordPress dashboard, go to **Plugins → Add New**
2. Search for **"WPCode"** (full name: *WPCode – Insert Headers and Footers + Custom Code Snippets*)
3. Click **Install Now**, then **Activate**

> Already have WPCode installed? Skip to Step 2.

---

## Step 2: Create the Snippet

1. Go to **Code Snippets → + Add Snippet** in the left sidebar
2. Click **"Add Your Custom Code (New Snippet)"** and then **Use Snippet**
3. Configure the snippet:
   - **Title**: `JetLag Planner`
   - **Code Type**: Select **HTML Snippet**
   - **Code Preview**: Open `wordpress/jetlag-wpcode.html` from this repository and **copy its entire contents** into the code box
4. Under **Insertion**, select **Shortcode**
   - WPCode will show you a shortcode like `[wpcode id="123"]` — copy it for the next step
5. Toggle the snippet to **Active**
6. Click **Save Snippet**

---

## Step 3: Add to a Page

1. Create a new page (or edit an existing one): **Pages → Add New**
2. Add a **Shortcode** block and paste the shortcode from Step 2:

   ```
   [wpcode id="123"]
   ```

   (Use the actual ID that WPCode assigned to your snippet.)

3. **Publish** or **Update** the page
4. Visit the page — you should see the JetLag Planner embedded in your site

---

## Options

### Theme-Adaptive Mode (Default)

The planner inherits your theme's fonts and adapts its surfaces to blend with light or neutral backgrounds. Activity colors (sleep, caffeine, light, melatonin) stay fixed for clarity. This is the default — no changes needed.

### Dark Mode

To force the original dark appearance, edit the snippet in WPCode and find this line near the top of the HTML:

```html
<div class="jetlag-planner">
```

Change it to:

```html
<div class="jetlag-planner jetlag-planner--dark">
```

Save the snippet. Use this if your site has a dark background or if you prefer the standalone look.

---

## Updating

The WordPress snippet (`jetlag-wpcode.html`) is auto-generated from the shared source files. When the app's CSS or JS is updated:

1. From the project root, run:
   ```bash
   ./wordpress/build-wp.sh
   ```
2. Copy the new contents of `wordpress/jetlag-wpcode.html`
3. In WordPress, go to **Code Snippets → JetLag Planner** and replace the code with the updated version
4. Save the snippet — changes are live immediately

---

## Troubleshooting

### The planner doesn't appear

- Confirm the WPCode snippet is toggled **Active**
- Make sure the insertion method is set to **Shortcode** (not Auto Insert)
- Double-check you're using the correct shortcode ID (e.g., `[wpcode id="123"]`)

### Styles look broken or conflict with my theme

- Try dark mode (add `jetlag-planner--dark` class as described above) to use self-contained colors
- If your theme uses aggressive global styles, you may need to add a CSS rule to your theme's customizer:
  ```css
  .jetlag-planner * { box-sizing: border-box; }
  ```

### The planner appears but inputs don't work

- Check your browser console for JavaScript errors
- Ensure no caching plugin is serving a stale version — clear your site cache after updating the snippet

### Airport search or timezone dropdowns are empty

- This is typically a JavaScript loading issue. Make sure the full contents of `jetlag-wpcode.html` were pasted (the file is ~160KB — some editors may truncate on paste)
