$files = Get-ChildItem -Path d:\gear\frontend\src\app\auth -Filter page.jsx -Recurse
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    if ($content -notmatch 'fetchWithCSRF') {
        $content = $content -replace 'import \{ motion \} from "framer-motion";', "import { motion } from `"framer-motion`";`r`nimport { fetchWithCSRF } from `"@/lib/api`";"
        $content = $content -replace 'await fetch\(', 'await fetchWithCSRF('
        Set-Content -Path $f.FullName -Value $content
    }
}
