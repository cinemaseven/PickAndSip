# Security and privacy checklist

This is the security and privacy review for Pick & Sip: a React/Vite frontend, a Node.js/Express API, and a PostgreSQL database hosted through Supabase. It follows the class checklist. Ticked items were checked; unticked items are open or not implemented, and each one says why.

## Before the first push

- [x] `.gitignore` includes `.env`, and `git check-ignore -v .env` confirms it is ignored
- [x] `git ls-files | grep -iE '\.env$|\.pem$|id_rsa'` prints nothing, so no environment files or private keys are tracked
- [x] `.env.example` is committed with placeholder values only
- [x] No connection string, key or password is in the repository source, comments, or screenshots. The real Supabase database credentials and application login credentials are stored in environment variables
- [x] No `student.json`, and no name, student number or email of mine or anyone else's is included in the repository

The production database connection and application login credentials are stored in the deployed API's environment variables rather than in GitHub. The repository contains only placeholder values in the `.env.example` files.

## The application

- [x] Every SQL query is parameterised. The API passes café IDs, visit IDs, order IDs, search values, and other user-provided values as query parameters instead of directly inserting them into SQL strings
- [x] Input is validated on the server. The API validates values such as café data, ratings, prices, dates, usernames, and other request fields before sending them to the database
- [x] CORS names its origins through the configured `allowedOrigins` environment variable. It is not configured as an unrestricted wildcard
- [x] `NODE_ENV=production` is configured for the deployed API, and API error responses do not expose stack traces, database details, or connection information
- [ ] `helmet` installed. **Not implemented.** The current API does not use the Helmet middleware
- [ ] Anything that costs money or accepts a password is rate limited. **Not implemented.** Pick & Sip does not process payments, and repeated application login attempts are not currently rate limited
- [x] Passwords, if you have accounts, are hashed with bcrypt and never logged. **N/A for user accounts.** Pick & Sip does not have individual user accounts; the application-level login uses credentials stored in environment variables and they are not logged
- [ ] Every route that touches somebody's data has the ownership check in the query, as `AND user_id = $2`, not as an `if` above it. **N/A for the current personal-use implementation.** Pick & Sip does not currently have multiple user accounts or `user_id` ownership fields on its café, visit, and order records
- [x] `npm audit` run once, and the easy fixes taken. The project dependencies were reviewed with `npm audit` and applicable easy fixes were applied

### Access control

The API is protected by an application-level login rather than individual user accounts. The client provides the login credentials, and protected API routes require valid authentication before allowing access. The application credentials are stored in environment variables rather than hardcoded in the frontend.

Because Pick & Sip is a personal-use application rather than a multi-user system, there are no per-user ownership checks on café, visit, or order records.

### Database

The browser does not connect directly to PostgreSQL. The React frontend communicates with the Node.js/Express API, and the API communicates with the Supabase PostgreSQL database.

Supabase Row Level Security (RLS) is enabled on the application tables, and Supabase Network Restrictions are enabled. The API currently connects using the Supabase `postgres` role, which has broader privileges than a dedicated least-privilege application role. This is a known limitation of the project.

### Deployment and repository security

The frontend and backend are deployed separately on Render, while the PostgreSQL database is hosted through Supabase. Production environment variables are configured on the hosting services rather than committed to GitHub.

The repository was also reviewed to ensure that real credentials were not committed and that the required `.env` files and private key patterns are not tracked.

## Privacy

- [x] No real classmates' names, numbers, emails or photos in the code, seed data, screenshots, or documentation
- [x] Seed data is invented. The mock API and development seed data contain fictional café, visit, order, and profile information used for testing
- [x] Real testers' data: **N/A.** Pick & Sip is intended for personal café tracking and does not require storing information about classmates or other testers
- [x] The app collects only the information needed for its café-tracking features, including a username, café details, visits, orders, ratings, tags, prices, dates, and notes
- [x] No faces in screenshots or the demo. The project does not use photographs of classmates or other people
- [x] Assets used in the project do not contain classmates' personal photos or information

Pick & Sip is designed as a personal café-tracking application, so it does not need to collect classmates' names, contact information, photographs, or other personal information. The café and visit information stored in the application is related to the user's own tracking activity.

## Known security limitations

The main security concern for Pick & Sip was protecting the Supabase database connection and application credentials because the project repository is public. I kept credentials in environment variables, committed only placeholder values in `.env.example`, checked that real credentials were not present in the repository or its history, used parameterised SQL queries, added server-side validation, configured CORS with allowed origins, and used generic API error responses. Supabase Row Level Security and Network Restrictions were also enabled. The main tradeoff I knowingly accepted is that the API currently uses the Supabase `postgres` database role rather than a dedicated least-privilege application role. Helmet and login rate limiting were also not implemented in the current version.