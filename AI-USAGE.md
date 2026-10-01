# AI usage

This project was built with AI assistance. This file is the record of how I used AI while developing Pick & Sip. I used AI mainly as a development guide, especially when I needed help understanding how to structure features, troubleshoot issues, and implement parts of the application. I reviewed and modified the suggestions to fit my project, wireframes, and requirements.

## 1. How I used AI

### 2026-09-23 - Started frontend development

- **Tool:** ChatGPT
- **What I asked for:**  I asked how I should start developing the frontend of Pick & Sip, particularly the homepage. I wanted to start with the homepage first instead of immediately building the entire application.
- **What it gave back:** ChatGPT explained how I could start the homepage in React and break the interface into smaller reusable components. It also helped me understand how I could translate the high-fidelity wireframe into React components.
- **What I kept, what I changed, and why:** I used the suggested approach as a starting point, but I implemented the homepage based on my own wireframe and design. I changed the structure, content, styling, and components when they did not match the design I wanted for Pick & Sip.
- **Commit:** https://github.com/cinemaseven/PickAndSip/commit/d1db2e7791f13aa0f5d4ccb6e6acee714cfc9c35

### 2026-09-26 - Set up routing

- **Tool:** ChatGPT
- **What I asked for:**  I asked how to set up routing for the different pages of my Pick & Sip React application and how I could organize the application around those routes.
- **What it gave back:** ChatGPT explained how to use React Router and how `App.jsx` could be used as the main router for the application. It also explained how the different pages could be connected through routes.
- **What I kept, what I changed, and why:**  I kept the React Router approach because it fit the structure of my application. I created and adjusted the routes according to the actual pages of Pick & Sip, including the dashboard, My Cafés, Add Café, and Profile pages. I also organized the files based on my project's structure.
- **Commit:** https://github.com/cinemaseven/PickAndSip/commit/fff540320c86b98250fc0e5d2fc0c33d6e7e3b5f

### 2026-09-27 - Implemented the frontend UI

- **Tool:** ChatGPT
- **What I asked for:** I asked for help implementing the frontend UI based on my high-fidelity Pick & Sip wireframes. I also needed temporary mock data so I could see the results of the different pages before connecting everything to the actual database. 
- **What it gave back:** ChatGPT helped me translate the wireframes into React pages and reusable components.
- **What I kept, what I changed, and why:**  I kept parts of the suggested React structure and temporary-data approach, but I changed the layout, styling, content, and behavior to match my wireframes and project requirements. I tested the pages and made additional changes whenever the result did not match my intended design.
- **Commit:** https://github.com/cinemaseven/PickAndSip/commit/fe386033f4aec5e555eee9c35d6326c2d24abedb

### 2026-09-27 - Implemented the maps feature

- **Tool:** ChatGPT
- **What I asked for:**  I asked how to implement a map in Pick & Sip using Leaflet so that users could use a map when adding a café and selecting its location.
- **What it gave back:** The first implementation suggested by ChatGPT used the Google Maps API instead of the Leaflet approach I had asked for.
- **What I kept, what I changed, and why:** I did not keep the Google Maps implementation because I specifically wanted to use Leaflet. I changed the implementation to use Leaflet and adjusted the map to fit the Add Café and Add Visit interfaces. I also tested the map to make sure it worked with the location features of the application.
- **Commit:** https://github.com/cinemaseven/PickAndSip/commit/3151422e9033caabdffc65497f2277919ce24c2a

### 2026-09-27 - Fixed the hamburger menu for mobile

- **Tool:** ChatGPT
- **What I asked for:**  I asked for help fixing the hamburger menu for the mobile version of Pick & Sip. I wanted the menu to open correctly and match the mobile design I had prepared.
- **What it gave back:** ChatGPT suggested changes to the mobile navigation structure, menu behavior, and styling.
- **What I kept, what I changed, and why:** The initial behavior did not match what I wanted because opening the hamburger menu affected the position of the content instead of making the menu appear as an overlay. I changed the behavior so that the menu would hover over the page rather than push the welcome content downward. I also adjusted the menu's color, positioning, and appearance to match my design.
- **Commit:** https://github.com/cinemaseven/PickAndSip/commit/6c383e0c59df44cb0261ba1808d6a6c99e57a550

### 2026-09-30 - Implemented autocomplete search in cafe search

- **Tool:** ChatGPT
- **What I asked for:** I asked ChatGPT how to implement autocomplete in the Add Café search so that when a user types a café name or location, suggestions can appear. I also wanted the selected result to automatically fill in the café name and location fields.
- **What it gave back:** ChatGPT explained how autocomplete and search suggestions could be implemented and how the selected result could be used to automatically fill the form fields.
- **What I kept, what I changed, and why:** I kept the autocomplete approach and the ability to autofill the café name and location. I adjusted the implementation to fit my Add Café form and the way I wanted users to search for cafés. I also reviewed the search results because multiple branches of the same café could appear, which could make the results confusing for users.
- **Commit:** https://github.com/cinemaseven/PickAndSip/commit/4d485e8ae1bb842c9a31cb72130088b3834c9790

## 2. Where the AI got it wrong

### Case 1 - Used Google Maps instead of Leaflet

- **What it gave me:** I asked specifically how to implement the map using Leaflet, but the suggested implementation used the Google Maps API.
- **What was wrong with it:** It did not follow the technology I specifically requested. I wanted to use Leaflet for the map feature, so the Google Maps implementation did not fit the approach I had decided to use for the project.
- **What I did instead:** I rejected the Google Maps implementation and changed the map implementation to Leaflet. I then integrated the Leaflet map into the café location features of Pick & Sip.
- **Commit:** https://github.com/cinemaseven/PickAndSip/commit/3151422e9033caabdffc65497f2277919ce24c2a

### Case 2 - Incorrect hamburger menu behavior

- **What it gave me:** ChatGPT provided an implementation for the mobile hamburger menu and its behavior.
- **What was wrong with it:** The menu did not behave the way I wanted. Opening the menu caused the content of the page, including the welcome section, to move downward. My intended design was for the hamburger menu to appear as an overlay on top of the page instead of pushing the page content down.
- **What I did instead:** I changed the mobile navigation so that the hamburger menu would overlay the page. I also adjusted its positioning, background color, and styling to match my mobile wireframe.
- **Commit:** https://github.com/cinemaseven/PickAndSip/commit/6c383e0c59df44cb0261ba1808d6a6c99e57a550

### Case 3 - short title

- **What it gave me:** 
- **What was wrong with it:** 
- **What I did instead:** 
- **Commit:** 
  
## 3. Who wrote what

At least a fifth of this project is code you wrote yourself. Name it, and explain
it in your own words.

> Group projects: give each member their own heading below, and use your GitHub
> handle as the heading. You are graded on your own section.

### Written by me

- **File:**
- **Commit:**
- **What it does and why it is built this way:**

### The AI-written part I understand best

- **File:**
- **Commit:**
- **What it does and why we kept it:**
