# Proposal

**App Name:** Pick & Sip: *Pick your place. Sip your way.*

## What the app is for

Pick & Sip is a personal café-tracking web application designed to help me keep track of the cafés I visit, my orders and experiences, and where I might want to go next.

The app allows me to save cafés, record visits and multiple orders, rate cafés and orders, add notes, view visit history, and use “Choose for Me” to randomly select a saved café based on my preferred rating, price range, and tags.

## Who is it for

Pick & Sip is currently designed for **personal use**, with me as the primary and current user.

The original proposal described the app as being for students, café-hoppers, and café enthusiasts. During development, the scope was narrowed to a personal café-tracking application rather than a multi-user application.

The app currently uses a single user profile rather than individual user accounts. Authentication for the deployed API uses one shared username/password stored in environment variables.

## Core features

### 1. Dashboard / Home
`/`

Shows an overview of my café activity, including:

- Café Explorer level
- Most visited café
- Most ordered drink
- Recent cafés
- Quick actions for navigating to My Cafés or adding a café

The dashboard now uses the actual database data in the deployed version rather than relying on the original hardcoded/seed data.

### 2. My Cafés
`/cafes`

Displays my saved cafés and allows me to:

- Search cafés by name or location
- Filter cafés by minimum rating, price range, and tags
- View café cards
- Open Café Details
- Open the “Choose for Me” picker

The price-range options were changed to:

- `100-200`
- `200-300`
- `300+`

These ranges are used consistently in the Add Café form, My Cafés filters, Choose for Me filters, Café Details, and café cards. Individual order prices remain entered separately by the user.

### 3. Add Café
`/add`

Provides two workflows:

1. **Add New Café** – saves a café's name, location, price range, rating, tags, optional notes, and its first visit/orders.
2. **Add a Visit** – allows me to select an existing café and record a new visit with multiple orders.

For café location entry, the implementation changed from the original Google Maps API plan.

The current Add Café location workflow uses **Leaflet with OpenStreetMap data**, including location search/autocomplete and map selection. Selecting a result can fill the café name, location, latitude, and longitude.

### 4. Profile
`/profile`

Shows the user's profile and allows the username to be edited.

The Café Explorer level is calculated from the number of distinct cafés saved.

### 5. Café Details
`/cafes/:id`

Displays the selected café's information, including:

- Café name and location
- Price range
- Rating
- Tags
- Notes
- Visit history
- Order history
- Saved location on a map/link

The page also allows visits to be added and notes to be edited or deleted.

The original proposal included editing or deleting the café itself. This was changed during development: **café-level Edit/Delete controls were not included in the current implementation; note editing/deletion was implemented instead.**

## Choose for Me

“Choose for Me” remains part of the core functionality.

The picker allows the user to specify:

- Minimum rating
- Price range
- Tags/purpose

It then randomly selects a matching café from the saved cafés.

The result provides actions to:

- View the selected café
- Pick again

The selected café is opened through the `/cafes/:id` route.

## Data and state

The application keeps the café → visit → order relationship:

- **Cafés** – café information such as name, location, price range, rating, tags, and notes.
- **Visits** – individual visits associated with a café.
- **Orders** – individual food/drink orders associated with a visit, including item, price, and rating.
- **Profile** – username and Café Explorer level.

Notes are optional and can contain multiple entries.

The application uses the database as the source of truth in the deployed version. The React client keeps the data it needs for displaying and interacting with the interface.

## Location and Maps

The original proposal planned to use the Google Maps API for café locations.

This was changed during development.

The current implementation uses:

- **OpenStreetMap + Leaflet** for entering/selecting café locations
- **Photon/OSM-based search** for café location autocomplete
- Saved latitude and longitude for café locations
- **Google Maps** for viewing a saved café's location through a Google Maps link

The application does not require a Google Maps API key for the café-entry map.

This change also removed the need for the Google Maps API key that was originally considered for the project.

## Hosting

The deployed application now uses a separate client, API, and database:

| Part | Current hosting | Purpose |
|---|---|---|
| Client | Render Static Site | Hosts the React/Vite frontend |
| API | Render Web Service | Hosts the Node.js/Express API |
| Database | Supabase PostgreSQL | Stores the application's persistent café, visit, order, and profile data |

The deployed frontend uses the Express API rather than the mock API.

The current production configuration uses:

`VITE_USE_MOCK_API=false`

Database credentials remain on the server and are stored through environment variables rather than being exposed to the client.

### Free-tier considerations

The frontend can be hosted as a free Render Static Site.

The Render API uses a free Web Service, which can spin down after 15 minutes without incoming traffic, so the first request after inactivity may take longer while the service starts again.

The Supabase database uses the Free Plan, which can automatically pause projects with low activity. These limitations are relevant because the application is a personal project rather than a high-traffic production service.

## API and security

The application uses a Node.js/Express API connected to PostgreSQL.

The deployed API uses HTTP Basic Authentication with one shared username and password stored in environment variables:

- `APP_USERNAME`
- `APP_PASSWORD`

Protected API routes require authentication, while the `/ready` health/status endpoint remains accessible.

The project also keeps credentials and secrets out of the repository through environment variables and `.gitignore`.

## Demo / Mock Mode

During development, the project used a mock API with seed data so the frontend could be developed and tested before the database integration was complete.

The mock implementation includes `mockApi.js` and `seed.json`.

For the final deployed application, demo/mock mode is **off**. The deployed frontend uses the real Express API and Supabase PostgreSQL database.

`VITE_USE_MOCK_API=false`

The repository may still contain the mock API and seed data for local frontend development/testing, but they are not the data source for the deployed application.

## Features changed or cut from the original proposal

### Café Edit/Delete

The original proposal stated that Café Details would include options to edit or delete the café.

This was changed during implementation. Café-level Edit/Delete functionality is not part of the current interface. Instead, notes can be edited or deleted.

### Google Maps API for café entry

The original proposal planned to use Google Maps API information for café locations and identified Google Maps integration as a development risk.

This was changed to Leaflet/OpenStreetMap for the café-entry map and location search. Google Maps is retained only for viewing a saved location through a link.

### Multi-user audience

The original proposal described students, café-hoppers, and café enthusiasts as the target audience.

The current scope is narrower: Pick & Sip is currently a personal café-tracking application for my own use. It does not currently provide separate accounts for multiple users.

## Stretch goals

The following ideas were considered during the original planning or development process but are outside the current core scope:

- Multi-user accounts
- Full café-level editing/deletion
- More advanced café/place search using a paid place-search service
- Expanded map/place integration

These are not required for the current personal version of Pick & Sip.

## Risks

### OpenStreetMap/Photon search coverage

The original Google Maps integration risk changed rather than disappearing completely.

The current OpenStreetMap/Photon search is free, but café names, branches, and addresses are not always returned consistently. Search results can sometimes be incomplete or ambiguous, especially when a café has multiple branches.

The map and manual selection of a location provide an alternative when the search result is not sufficient.

OpenStreetMap public services also have usage and attribution requirements.

### Free hosting limitations

The application depends on free-tier hosting for the deployed version.

Render's free API service can spin down after inactivity, which can cause a slower first request. Supabase's Free Plan can also pause projects after prolonged low activity.

These limitations may affect availability or initial loading time but do not change the application's core functionality.

### External services

The application depends on external services for hosting, database access, and map/location functionality. Changes in the availability or limits of Render, Supabase, OpenStreetMap, or Photon could affect parts of the application.

## Current status

The application has moved from the original frontend/demo-oriented proposal to a deployed full-stack implementation:

**React/Vite client → Node.js/Express API → Supabase PostgreSQL**

The final version is currently scoped as a personal café-tracking application, with real database-backed data, OpenStreetMap/Leaflet for café location entry, Google Maps for viewing saved locations, and mock/seed data retained only for development/testing.