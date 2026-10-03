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

### 2026-10-02 - Asked for guide in security check and implementation

- **Tool:** ChatGPT
- **What I asked for:** I asked for guidance on securing my Pick & Sip application before deployment. I specifically needed help checking the project against the security requirements, including protecting database credentials, securing the API, validating inputs, configuring CORS, and checking repository and deployment settings.
- **What it gave back:** ChatGPT explained the security checks I needed to perform and guided me through implementing HTTP Basic Authentication for the API, keeping credentials in environment variables, checking `.gitignore` and `.env.example`, reviewing GitHub Actions, enabling GitHub security features, enabling Supabase network restrictions and Row Level Security, and testing protected API routes.
- **What I kept, what I changed, and why:** I kept the security approach and used HTTP Basic Authentication as the access-control layer for the API. I also followed the suggested checks and tested the API myself. I made the final configuration changes based on my actual Render, GitHub, and Supabase setup rather than blindly applying the suggestions.
- **Commit:** https://github.com/cinemaseven/PickAndSip/commit/857a089a6f098838a0d1320572bd79631e36388d


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

### Case 3 - Incorrect display of notes

- **What it gave me:** ChatGPT initially suggested a notes implementation that did not match how I wanted notes to be stored and displayed in Pick & Sip.
- **What was wrong with it:** The notes were not being displayed in the format I wanted. I wanted notes to support multiple entries and to be displayed clearly as a list, with the date associated with each note/entry where applicable.
- **What I did instead:** I changed the notes handling and display so that multiple notes could be shown in a list and adjusted the formatting and date display to match the design of Pick & Sip. I also fixed the way notes were presented on the café details page.
- **Commit:** https://github.com/cinemaseven/PickAndSip/commit/a771213db2cda80b9085e2a8d1dbabd30ff8c7b1 and https://github.com/cinemaseven/PickAndSip/commit/1b464e89e6a5cadba97381caf8becd81b6d6de2d
  
## 3. Who wrote what

### Written by me

#### 1. API setup, mock API, and seed data

- **File:** `httpApi.jsx`, `index.js`, and `seed.json`
- **Commit:** https://github.com/cinemaseven/PickAndSip/commit/2dd6a0fe1838546fb2297ff3739b04e47ec8b564
- **What it does and why it is built this way:** These files handle the initial API and data setup of Pick & Sip. `index.js` sets up the backend entry point, while `httpApi.jsx` handles requests from the frontend. `seed.json` contains the initial sample data used by the mock API. I worked on these files myself and used AI mainly when I encountered problems or needed help understanding an implementation. I decided to keep the mock data while developing the frontend because it allowed me to test the UI and page behavior before the database integration was complete.

#### 2. Application routing

- **File:** `App.jsx`
- **Commit:** https://github.com/cinemaseven/PickAndSip/commit/fff540320c86b98250fc0e5d2fc0c33d6e7e3b5f
- **What it does and why it is built this way:** `App.jsx` acts as the main router of the application. It defines the routes for the different pages of Pick & Sip and connects each URL to its corresponding page component. I built the routing around the navigation structure of my application so users can move between the Dashboard, My Cafés, Add Café, Profile, and other pages without putting all of the page logic into one component.

#### 3. Application styling

- **File:** `styles.css`
- **Commit:**  
  https://github.com/cinemaseven/PickAndSip/commit/fe386033f4aec5e555eee9c35d6326c2d24abedb  
  https://github.com/cinemaseven/PickAndSip/commit/6c383e0c59df44cb0261ba1808d6a6c99e57a550  
  https://github.com/cinemaseven/PickAndSip/commit/0afe3beb4499618b3f2d7f41234ff6dc09a88dd4  
  https://github.com/cinemaseven/PickAndSip/commit/6e4aea1c9a778f3657cacbe967a34640c4c9c3f2
- **What it does and why it is built this way:** `styles.css` contains the styling for the web application, including the layout, spacing, typography, buttons, cards, navigation, forms, and responsive behavior. I had some help from AI when working on particular styling problems, but I made revisions to the CSS as I developed the application. I repeatedly tested the pages and adjusted the styles to make the actual interface match my high-fidelity wireframes, including changes for the mobile viewport.

#### 4. Café data repository

- **File:** `cafesRepo.js`
- **Commit:** https://github.com/cinemaseven/PickAndSip/commit/8c0d60d2e75704edfa532e654aeb03469e6ef67a
- **What it does and why it is built this way:** `cafesRepo.js` contains the database queries used to work with café data. The repository separates the SQL queries from the rest of the backend logic, which makes the code easier to organize and allows the routes or services to call the repository when they need café information. Most of the SQL queries in this file were written by me. I used AI for help when I encountered problems with a query or needed to troubleshoot an issue, but I worked out and implemented most of the queries myself.

#### 5. Profile data repository

- **File:** `profileRepo.js`
- **Commit:** https://github.com/cinemaseven/PickAndSip/commit/0403bf885bbbb89fb4ee638b4ff9b20abf55b66c
- **What it does and why it is built this way:** `profileRepo.js` contains the SQL queries for retrieving and working with profile data. I separated these queries into a repository so that the database operations for profiles are kept separate from the rest of the application logic. Most of the queries were written by me. I used AI when I was troubleshooting or needed help understanding an issue, but I made the main decisions about the queries and how they should work with my database structure.

### The AI-written part I understand best

- **File:** `mockApi.js`
- **Commit:** https://github.com/cinemaseven/PickAndSip/commit/2dd6a0fe1838546fb2297ff3739b04e47ec8b564
- **What it does and why we kept it:** `mockApi.js` provides temporary API-like functions that let the frontend read and modify the seed data while the actual backend and database were still being developed. It handles operations such as reading the mock data, writing updated data, generating the next available ID, and preparing dashboard-related information. I kept it during the frontend development stage because it allowed me to test the pages and their functionality without depending on the completed database. Working with this file also helped me understand how the frontend gets and uses data, which made it easier for me to understand and work on the other parts of the application when I eventually moved toward the actual backend and database. I understand how the functions use the seed data as the temporary source of truth and how the frontend calls these functions to retrieve the information it needs.