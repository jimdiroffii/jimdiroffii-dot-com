+++
date = '2026-01-28T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 008'
summary = 'What The FOUC: Building a Smarter Loading Screen'
+++

A "flash of unstyled content" or FOUC can be particularly jarring for users. I noticed when I was building out this new Hugo site, that when I throttled the connection to GPRS, the FOUC from the stylesheet not loading was particularly nasty.

I fixed this first by adding some in-line styles directly to the `<head>` tag that kept the background black, so at least there wasn't this big flash of white on every page load. However, that got me thinking of a different solution.

I think we have all seen websites that have a loading screen while we wait for the content to be rendered. This is popular on big and heavy web applications. But, can we do something similar on a completely static site without any JavaScript? I think so. The idea is to create a "loading" screen `<div>` that sits above all the main content of the site, but inside of the `<body>`. We give it a particular `id` property, and then wrap our main content in another `<div>`. Now we can target these with some basic styling in the `<head>` so that our loading screen is presented while the main CSS styles load.

## The New Problem: It Was Too Fast

It worked perfectly on slow connections. The screen stayed black, the spinner spun, and then the content faded in. But then I tested it without throttling.

The site is fast. It loads in about 200ms. The problem was that my "loading" screen was visible immediately via those inline styles. So, on every single page click, I’d see a flash of the spinner for a fraction of a second before the main CSS kicked in to hide it. It felt glitchy. It was distracting. I solved the FOUC, but I introduced a "Flash of Unnecessary Spinner."

I needed a way to keep the screen black (to hide the unstyled content) but keep the spinner invisible unless the page was actually taking a while to load.

## The Solution: CSS Animation Delays

To stick with my goal of reducing JavaScript as much as possible, used CSS keyframes.

The logic is simple: Set the spinner's opacity to `0` by default. Then, create an animation that fades it in, but add a delay to that animation. I settled on a `0.5s` delay.

If the page loads in 200ms, the main CSS loads, hits the `opacity-0` class on the container, and removes the loading screen before the spinner ever gets a chance to fade in. If the connection is slow and takes 2 seconds, the spinner waits half a second, then fades in to let the user know something is happening.

Here is what the CSS looked like in my `css.html` partial:

```css
.spinner {
  opacity: 0;
  animation: spin 1s linear infinite, fadeIn 0.4s ease-out 0.5s forwards;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  to { opacity: 1; }
}
```

Now, on fast loads, users just see a clean transition. On slow loads, they get the feedback they need.

## Accessibility

I thought I was done, but then I realized I was creating a bit of a mess for accessibility. I was putting a spinning visual element on the screen that meant nothing to screen readers, and potentially causing issues for people with vestibular disorders who get dizzy from motion.

First, I updated the HTML in `baseof.html`. I added `aria-hidden="true"` to the loading container. This tells screen readers to completely ignore the loading screen and focus on the actual content, which is already in the DOM underneath.

I also added some text so it wasn't just a mysterious floating circle.

```html
<div id="loading-screen" aria-hidden="true" class="...">
    <div class="spinner"></div>
    <div class="loading-text">Loading...</div>
</div>
```

Next, I had to respect the user. If someone has their operating system set to "Reduce Motion," my site shouldn't be spinning things in their face. I added a media query to stop the animation and ensure the element is static.

I also noticed the contrast on the "track" of the spinner was too faint against the black background, so I bumped that up a bit.

```css
@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
    border-color: #fff;
    opacity: 1; 
  }
  .loading-text {
    animation: none;
    opacity: 1;
  }
}
```

Now, the site is fast for fast connections, helpful for slow connections, and respectful of all users. It’s a small detail, but it makes the site feel much more polished.

## Final Output

HTML within the `<body>` tag:

```html
<!-- Note that the class is using TailwindCSS -->
<div id="loading-screen" aria-hidden="true" class="opacity-0 pointer-events-none transition-opacity duration-300 ease-out">
  <div class="spinner"></div>
  <div class="loading-text">Loading...</div>
</div>
```

HTML within the `<head>` tag:

```html
<style>
  #loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
    justify-content: center;
    background: #000;
    z-index: 9999;
    pointer-events: none;
  }
  
  .spinner {
    width: clamp(30px, 8vmin, 80px);
    height: clamp(30px, 8vmin, 80px);
    border: clamp(3px, 0.6vmin, 6px) solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    opacity: 0;
    animation: spin 1s linear infinite, fadeIn 0.4s ease-out 0.5s forwards;
  }

  .loading-text {
    color: #e2e8f0;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    opacity: 0;
    animation: fadeIn 0.4s ease-out 0.5s forwards;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes fadeIn {
    to { opacity: 1; }
  }

  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation: none;
      border-color: #fff;
      opacity: 1;
    }

    .loading-text {
      animation: none;
      opacity: 1;
    }
  }
</style>
```
