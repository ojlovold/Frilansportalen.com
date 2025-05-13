[13:59:55.128] Running build in Washington, D.C., USA (East) – iad1
[13:59:55.153] Cloning github.com/ojlovold/Frilansportalen.com (Branch: main, Commit: ad9534b)
[13:59:55.690] Cloning completed: 536.000ms
[13:59:56.591] Restored build cache from previous deployment (HPqHvZjqyoK3i1yTEsnfQY1aU9ud)
[13:59:56.971] Running "vercel build"
[13:59:57.359] Vercel CLI 41.7.3
[13:59:57.654] Installing dependencies...
[14:00:01.394] npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
[14:00:01.455] npm warn deprecated @types/jspdf@2.0.0: This is a stub types definition. jspdf provides its own type definitions, so you do not need this installed.
[14:00:01.481] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[14:00:01.493] npm warn deprecated @supabase/auth-helpers-shared@0.1.4: This package is now deprecated - please use the @supabase/ssr package instead.
[14:00:01.613] npm warn deprecated @supabase/auth-helpers-react@0.2.4: This package is now deprecated - please use the @supabase/ssr package instead.
[14:00:02.335] 
[14:00:02.336] added 97 packages, and removed 113 packages in 4s
[14:00:02.336] 
[14:00:02.336] 24 packages are looking for funding
[14:00:02.336]   run `npm fund` for details
[14:00:02.372] Detected Next.js version: 13.4.19
[14:00:02.376] Running "npm run vercel-build"
[14:00:02.488] 
[14:00:02.488] > frilansportalen@1.0.0 vercel-build
[14:00:02.488] > next build
[14:00:02.488] 
[14:00:03.061] - info Linting and checking validity of types...
[14:00:12.408] Failed to compile.
[14:00:12.409] 
[14:00:12.410] ./pages/gjenbruk/[id].tsx:7:10
[14:00:12.410] Type error: Module '"../../lib/visningslogg"' has no exported member 'loggVisning'.
[14:00:12.410] 
[14:00:12.410] [0m [90m  5 | [39m[36mimport[39m { useUser } [36mfrom[39m [32m'@supabase/auth-helpers-react'[39m[0m
[14:00:12.410] [0m [90m  6 | [39m[36mimport[39m supabase [36mfrom[39m [32m'../../lib/supabaseClient'[39m[0m
[14:00:12.410] [0m[31m[1m>[22m[39m[90m  7 | [39m[36mimport[39m { loggVisning } [36mfrom[39m [32m'../../lib/visningslogg'[39m[0m
[14:00:12.410] [0m [90m    | [39m         [31m[1m^[22m[39m[0m
[14:00:12.410] [0m [90m  8 | [39m[0m
[14:00:12.412] [0m [90m  9 | [39mtype [33mProps[39m [33m=[39m {[0m
[14:00:12.412] [0m [90m 10 | [39m  oppforing[33m:[39m {[0m
[14:00:12.455] Error: Command "npm run vercel-build" exited with 1
[14:00:12.762] 
[14:00:15.965] Exiting build container
