# Deployment guide — Cloudflare Pages + editor login

One-time setup, about 15–20 minutes. Everything here is on free plans. You'll need:

- the GitHub account that owns `elqaddar02/mouna-portfolio`
- a free Cloudflare account: <https://dash.cloudflare.com/sign-up>

At the end you'll have:

- the site at **`https://mouna-portfolio.pages.dev`**, rebuilt automatically after every change
- the editor at **`https://mouna-portfolio.pages.dev/admin/`**, where Mouna logs in with GitHub

---

## Part 1 — Put the site online (Cloudflare Pages)

1. In the Cloudflare dashboard, open **Workers & Pages** → **Create** → **Pages** tab → **Connect to Git**.
2. Authorise Cloudflare on GitHub and select the repository **`elqaddar02/mouna-portfolio`**.
3. Fill in the settings:

   | Setting | Value |
   | --- | --- |
   | Project name | `mouna-portfolio` → gives `mouna-portfolio.pages.dev` |
   | Production branch | `main` |
   | Framework preset | `None` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Environment variable | `NODE_VERSION` = `22` |

4. Click **Save and Deploy**. The first build takes a couple of minutes.

> If the name is already taken, Cloudflare gives a different `*.pages.dev` address. Tell me the address (or set it in `src/config/site.ts` and run `npm run cms-config`) so the meta tags, sitemap and editor point to the right place.

From now on, **every change pushed to `main` is deployed automatically**, including every save in the editor. If a build fails, for example because of an invalid content edit, Cloudflare keeps the previous version online.

---

## Part 2 — Editor login (Sveltia CMS Authenticator)

The editor saves Mouna's changes to GitHub, so it needs a small login service. It runs free on Cloudflare Workers.

### 2.1 Deploy the login service

1. Open <https://deploy.workers.cloudflare.com/?url=https://github.com/sveltia/sveltia-cms-auth> and follow the steps. Use the same Cloudflare account.
2. When it's done, open **Workers & Pages** → **`sveltia-cms-auth`** and copy its URL. It looks like `https://sveltia-cms-auth.<your-subdomain>.workers.dev`. This setup currently uses `https://sveltia-cms-auth.mouadelqaddar.workers.dev`.

> **If the build fails with `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`:** Cloudflare's default pnpm is older than the one the project uses. The service needs no installed packages, so skip the install. In **`sveltia-cms-auth` → Settings → Builds**:
> - Set **Deploy command** to `npx wrangler deploy`.
> - Under the **Builds** section's *Variables and secrets*, add `SKIP_DEPENDENCY_INSTALL` = `1`.
>
> Then click **Retry build**.

### 2.2 Register it on GitHub

1. Open <https://github.com/settings/applications/new> (logged in as the repo owner).
2. Fill in:

   | Field | Value |
   | --- | --- |
   | Application name | `Mouna portfolio editor` |
   | Homepage URL | `https://mouna-portfolio.pages.dev` |
   | Authorization callback URL | `<worker URL from 2.1>/callback` |

3. Click **Register application**, then **Generate a new client secret**.
4. Keep the page open. You need the **Client ID** and the **Client secret** next.

### 2.3 Give the keys to the login service

In Cloudflare: **Workers & Pages** → **`sveltia-cms-auth`** → **Settings** → **Variables and Secrets**. Use the **runtime** section at the top level of Settings, **not** the one inside **Builds**. Build variables aren't visible to the running service, and the editor would then report *"OAuth app client ID or secret is not configured"*.

Add all three as type **Secret**. Secrets survive later redeploys, while plain-text variables set in the dashboard can be removed when the service is redeployed from Git.

| Name | Value | Type |
| --- | --- | --- |
| `GITHUB_CLIENT_ID` | Client ID from 2.2 | Secret |
| `GITHUB_CLIENT_SECRET` | Client secret from 2.2 | Secret |
| `ALLOWED_DOMAINS` | `mouna-portfolio.pages.dev` | Secret |

Then click **Deploy**. `ALLOWED_DOMAINS` makes sure only this site can use the login service. Add the custom domain there later if you get one.

### 2.4 Point the editor to the login service

**Send me the worker URL from 2.1** and I'll update the configuration. Or do it yourself:

1. In `scripts/cms-config.mjs`, set `AUTH_BASE_URL` to the worker URL (currently `https://sveltia-cms-auth.mouadelqaddar.workers.dev`).
2. Run `npm run cms-config`, commit and push.

---

## Part 3 — Give Mouna access

1. Mouna creates a free GitHub account if she doesn't have one: <https://github.com/signup>.
2. In the repository: **Settings** → **Collaborators** → **Add people** → her GitHub username.
3. She accepts the invitation from her email.
4. She opens `https://mouna-portfolio.pages.dev/admin/`, clicks **Sign in with GitHub**, and she's in.

Her guide, in French: [`GUIDE-EDITEUR.md`](GUIDE-EDITEUR.md).

---

## Optional — Custom domain

1. Buy a domain from any registrar (about €10–15 a year; Cloudflare Registrar sells at cost).
2. In the Pages project: **Custom domains** → **Set up a custom domain**, and follow the steps.
3. Set the new address in `src/config/site.ts`, run `npm run cms-config`, commit and push.
4. Add the domain to `ALLOWED_DOMAINS` (2.3) and to the GitHub app's Homepage URL (2.2).

---

## Limits on the free plans

- **Cloudflare Pages:** 500 builds a month. Every editor save is one build, so that's ~16 saves a day, every day. Visitor traffic isn't charged.
- **Cloudflare Workers** (login service): 100,000 requests a day, while each login uses a handful.
- **GitHub:** free. Images are stored in the repository, and the editor automatically converts uploads to WebP and scales them down to 2800 px.
