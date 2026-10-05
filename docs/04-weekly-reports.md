# Weekly reports

The weekly report is a short progress journal for the project development. It records what was completed, what caused problems or remained unresolved, approximately how much time was spent, and what was planned next.

---

## Week of 2026-09-23

**Done.** 
- Completed the high-fidelity wireframes for the main Pick & Sip screens, including desktop and mobile layouts.
- Finalized the screen navigation and user flows for Home, My Cafés, Add Café/Visit, Profile, Café Details, and Choose for Me.
- Completed the component tree for the My Cafés screen and identified reusable components and their Atomic Design levels.
- Finalized the state ownership and data structure for cafés, visits, orders, filters, search, and the café picker.
- Set up the provided React/Vite project template as the starting point for Pick & Sip.
- Replaced the template's initial content with the Pick & Sip frontend structure.
- Started implementing the Home/Dashboard frontend with the planned layout, navigation, welcome section, Café Explorer level, summary cards, recent cafés, and footer.
- Added the initial CSS styling for the Home page and used hardcoded café and user data while the backend and database were not yet connected.

**Stuck.** 
- I encountered issues while replacing the provided template with the Pick & Sip frontend, particularly with the Vite/React setup and getting the new Home page to load correctly.
- I spent time troubleshooting the React/Vite configuration and refining the spacing, sizing, and positioning of the Home page components.
- I also had to figure out how to translate the high-fidelity wireframe into React components and CSS.

**Hours.** 
- Roughly: 16 hours

**Next.** 
- Continue and complete the remaining frontend screens and reusable components.
- Start developing the backend API and PostgreSQL database.

---

## Week of 2026-09-27

**Done.** 
- Completed the Pick & Sip frontend implementation based on the finalized high-fidelity design.
- Completed the Home/Dashboard, My Cafés, Café Details, Add Café, Profile, and Choose for Me screens.
- Added routing between the main Pick & Sip screens using React Router.
- Created reusable Atomic Design components.
- Added mock API functionality and local storage support for café, visit, order, profile, and picker data.
- Added responsive desktop and mobile layouts.
- Refined the mobile hamburger menu and Profile screen.
- Fixed the Choose for Me button and the Add Café and Add a Visit save actions.
- Added temporary logo assets and updated the navigation and footer.
- Added Notes edit and delete functionality on the Café Details screen.

**Stuck.** 
- I spent a lot of time refining the different pages to match the high-fidelity designs, especially the mobile hamburger menu, Profile layout, and Add Café map section.
- There were also some component import and form submission issues that had to be fixed.
- The frontend was still using mock data, so the backend and database were not connected yet.

**Hours.** 
- Roughly: 24 hours

**Next.** 
- Develop the Pick & Sip backend API.
- Set up the PostgreSQL database and connect it to the frontend.

---

## Week of 2026-10-04

**Done.** 
- Completed the Pick & Sip backend using Node.js and Express.
- Set up and connected the PostgreSQL database through Supabase.
- Connected the frontend to the real API and database, replacing the mock API for the deployed application.
- Connected the café, visit, order, profile, and dashboard functionality to the database.
- Added API authentication and configured the required environment variables and repository security settings.
- Deployed the frontend and backend.
- Changed the café location-entry map to Leaflet with OpenStreetMap-based search, while keeping Google Maps for viewing saved café locations.
- Updated the price ranges to ₱100-₱200, ₱200-₱300, and ₱300+, and made notes optional with support for multiple notes.
- Fixed the Dashboard so it no longer displays seed data when there is no actual database data.
- Completed final UI and responsive fixes across the application.

**Stuck.** 
- OpenStreetMap-based café search can sometimes return multiple branches or incomplete results, so the correct location may need to be confirmed manually.
- I also encountered some issues while connecting the frontend to the real API and database, which required troubleshooting the API configuration and database connection.

**Hours.** 
- Roughly: 19 hours

**Next.**
- Complete final end-to-end testing of the deployed application and finish all needed documentation files.
- Fix any remaining bugs and prepare the project for final submission.

---
