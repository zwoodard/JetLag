# JetLag Planner

A web app to help travelers beat jet lag by planning their sleep, caffeine intake, light exposure, and melatonin around their flight schedule.

## Features

- **Multi-flight support**: Plan around connecting flights and layovers
- **Personalized schedule**: Based on your usual sleep times
- **Pre-departure adjustment**: Start shifting your circadian rhythm days before travel
- **Comprehensive recommendations**:
  - Sleep timing
  - Light seeking/avoidance windows
  - Caffeine cutoff times
  - Melatonin timing
  - Strategic nap suggestions
- **Two view modes**: Timeline visualization and daily breakdown
- **PWA support**: Install on your device for easy access
- **Offline-capable**: Works without internet once loaded
- **Airport code lookup**: Auto-fills timezone when entering airport codes

## Scientific Basis

The algorithm is based on circadian rhythm science:

- **Core Body Temperature minimum (CBTmin)** occurs ~2-3 hours before natural wake time
- **Light exposure after CBTmin** advances the circadian clock (for eastward travel)
- **Light exposure before CBTmin** delays the circadian clock (for westward travel)
- The body can naturally shift approximately **1-1.5 hours per day**
- **Melatonin** taken 5 hours before bedtime can help advance the clock
- **Caffeine** should be avoided 6+ hours before desired sleep time

## Usage

1. **Set your sleep profile**: Enter your home timezone and usual sleep/wake times
2. **Add your flights**: Enter departure and arrival times with timezones
3. **Choose when to start adjusting**: Select how many days before departure to begin
4. **Generate your plan**: Get a personalized day-by-day schedule

## Deployment

This is a static web app that can be hosted on any static file server, including GitHub Pages.

### GitHub Pages

1. Push to a GitHub repository
2. Go to Settings > Pages
3. Select the branch and root folder
4. Your app will be available at `https://username.github.io/repository-name/`

### Local Development

Simply open `index.html` in a web browser, or use a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve
```

## Project Structure

```
├── index.html          # Main HTML file
├── manifest.json       # PWA manifest
├── sw.js              # Service worker (no caching for simplicity)
├── css/
│   └── styles.css     # Main stylesheet
├── js/
│   ├── app.js         # Main application logic
│   ├── jet-lag-algorithm.js  # Core jet lag calculation
│   └── timezones.js   # Timezone and airport data
└── icons/
    ├── icon-192.svg   # App icon (192x192)
    └── icon-512.svg   # App icon (512x512)
```

## Notes

- This is not medical advice. Consult a healthcare provider for personalized recommendations.
- The algorithm provides general guidance based on circadian rhythm science.
- Individual responses to jet lag interventions may vary.
- For production use, consider converting SVG icons to PNG for broader compatibility.

## License

MIT
