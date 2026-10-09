# Security checklist

## Secrets and credentials

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 1 | `.env` is gitignored and is not in the repository | Yes | `.gitignore` contains `.env`, and `git ls-files .env` returned no output. |
| 2 | A `.env.example` with placeholder values only is committed | Yes | `.env.example` and `server/.env.example` are tracked, and the server example uses placeholders such as `USERNAME`, `PASSWORD`, `HOST`, and `DATABASE_NAME` rather than real credentials. |
| 3 | No connection string, key, token or password is hardcoded in source, comments or commented-out code | Yes | I searched the current repository with `git grep -n -i -E "password|secret|api[_-]?key|postgres://"` and found only placeholders, documentation, environment-variable names, and code that reads credentials from environment variables. |
| 4 | Git history is clean: I searched `git log -p` for password, secret, api key and `postgres://` | Yes | I searched the Git history with `git log -p` for password, secret, API key, and `postgres://`. The matches were provided template/example credentials and documentation values, not my production credentials. |
| 5 | Any credential that was ever committed has been rotated | N/A | I found no personal or production credential committed to the repository. The credentials found in history were example values from the provided project template. |
| 6 | Production credentials live only in my hosting provider's environment settings | Yes | Production database and application login credentials are stored as environment variables in the server/hosting configuration and are not committed to the public repository. |

## GitHub Actions

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 7 | No secret value is written literally in any workflow YAML file | Yes | `.github/workflows/deploy-pages.yml` contains no database password, API key, or application login credential |
| 8 | Secrets are stored in repository Actions secrets and read with `${{ secrets.NAME }}` | N/A | The existing workflow does not require GitHub Actions secrets. Its frontend configuration uses non-secret repository variables through `${{ vars.VITE_USE_MOCK_API }}` and `${{ vars.VITE_API_BASE_URL }}`. |
| 9 | No workflow step echoes, dumps or debug-prints a secret, and I opened a recent run's log to confirm | Yes | The workflow contains no commands that echo or dump secrets, and no secret values are passed to the workflow. |
| 10 | Uploaded build artifacts contain no `.env`, key file or generated config | Yes | The workflow builds `client/dist` and uploads that directory as the GitHub Pages artifact. No `.env` or private key is included in the workflow. |
| 11 | Third-party actions are pinned to a commit SHA, not a moveable tag | No | The workflow uses version tags such as `actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-pages-artifact@v3`, and `actions/deploy-pages@v4` rather than commit SHAs. |
| 12 | Secret scanning and push protection are enabled on the repository | Yes | GitHub repository settings show Secret Protection and Push protection enabled under Settings → Security and quality → Advanced Security. |

## Database

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 13 | Every query taking user input uses parameters, never string concatenation | Yes | I reviewed the server repository code and the database queries use PostgreSQL parameter placeholders such as `$1` instead of concatenating user input into SQL. |
| 14 | The database is not open to the whole internet, or is reachable only by the app | Yes | Supabase Network Restrictions were enabled. |
| 15 | The database user the app connects as has only the permissions it needs | No | The Render API currently connects using the Supabase `postgres` database role. The role has broader administrative privileges than the Pick & Sip API requires. |
| 16 | Seed and sample data is invented, not real people's data | Yes | I did not run `seed.sql` on the production Supabase database. The current database contains one profile, one café, two visits, and four orders entered during development/testing. |
| 17 | Debug, seed and reset routes are removed before going public | Yes | I reviewed `server/server.js` and found no public `/debug`, `/seed`, or `/reset` HTTP routes. The `db:seed` and `db:reset` entries in `package.json` are local command-line scripts, not public API routes. |

## Access control

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 18 | The app has an access layer: Cloudflare Zero Trust, an app-level password, or a real login | Yes | The Pick & Sip application uses an application-level login with credentials stored in `APP_USERNAME` and `APP_PASSWORD` environment variables. Unauthenticated login attempts are rejected with 401 Unauthorized. |
| 19 | If Supabase or Firebase: Row Level Security or security rules are on, and I tested it signed out | Yes |  RLS was enabled on all four application tables and tested signed out. |
| 20 | If Zero Trust: tjakoen.s@gmail.com is on the access policy. If an app password: the credentials are in my private workspace `project/README.md` | Yes | The project uses the application-login option. The login credentials are documented in the private workspace `project/README.md` for instructor access and are not stored in the public repository. |
| 21 | The gate covers every route, including the ones that only change data | Yes | The application login is required before users can access the application. Authenticated API requests are then used for application operations, including data-changing requests. |
| 22 | The credentials for the gate are environment variables, not in source | Yes | The application login reads `process.env.APP_USERNAME` and `process.env.APP_PASSWORD`; the actual credentials are not hardcoded in the source. |

## Input and output

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 23 | Input from the user is validated on the server, not only in the browser | Yes | I tested an authenticated `POST /api/cafes` request with a rating of `99`, and the server returned `400 Bad Request` with `rating must be between 0 and 5`. |
| 24 | User-supplied text is escaped when rendered, so it cannot inject markup or script | Yes | `git grep -n "dangerouslySetInnerHTML"` returned no results. User data is rendered through normal React JSX rather than raw HTML injection. |
| 25 | Error responses do not expose stack traces, file paths or connection details | Yes | I requested a nonexistent API route and received `404` with `{"error":"No such route"}` without a stack trace, filesystem path, or database connection information. |
| 26 | CORS is not a wildcard on routes that change data | Yes | The server uses `cors({ origin: allowedOrigins })`, where allowed origins come from `CORS_ORIGINS`. The deployed frontend origin is configured explicitly rather than using `*`. |

## Repository and privacy

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 27 | No student number, personal email, phone number or home address in the repository or in commit messages | Yes | I checked the repository and commit information and confirmed that no student number, personal email, phone number, or home address is included. |
| 28 | No classmate's personal data in the repository | Yes | I reviewed the project data and repository contents and confirmed that no classmate's personal data is included. |
| 29 | Dependencies come from official registries, and `node_modules` is gitignored | Yes | `.gitignore` contains `node_modules/`, and `git ls-files node_modules` returned no output. No registry-related generated files were found in tracked files. |
| 30 | Images, fonts and other assets are mine, licensed, or credited | Yes | The repository contains only the Pick & Sip logo assets `client/src/assets/logo-dark.svg` and `client/src/assets/logo-light.svg`; no external image files are tracked in the repository. |
| 31 | Repository visibility is deliberate, and I checked it after my last push | Yes | The PickAndSip GitHub repository is intentionally public so the project source can be reviewed as part of the final project submission. |

## Anything I found and fixed

This checklist caught several security items that I had not fully addressed before the review. I replaced the concrete database example in server/.env.example with placeholders and implemented application-level login protection while keeping the health-check route available for Render. I also verified parameterized queries, server-side validation, generic error responses, CORS configuration, application login protection, and the absence of actual production credentials in the repository and Git history.
