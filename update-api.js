const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processAdminRoutes() {
  const adminApiDir = path.join(process.cwd(), 'src/app/api/admin');
  
  walkDir(adminApiDir, (filePath) => {
    if (!filePath.endsWith('.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    // 1. Update requireAuth to return session
    if (content.includes('async function requireAuth() {') && !content.includes('return session;')) {
      content = content.replace(
        /async function requireAuth\(\) \{[\s\S]*?if \(!session\?\.user\) throw new Error\('Unauthorized'\);\n\}/,
        `async function requireAuth() {\n  const session = await auth.api.getSession({ headers: await headers() });\n  if (!session?.user) throw new Error('Unauthorized');\n  return session;\n}`
      );
      changed = true;
    }

    // 2. Add eq to drizzle-orm import if not there
    if (!content.includes('eq') && content.includes('drizzle-orm')) {
        content = content.replace(/import \{(.*?)\} from 'drizzle-orm';/, (match, p1) => {
            return `import {${p1}, eq} from 'drizzle-orm';`;
        });
        changed = true;
    } else if (!content.includes('drizzle-orm')) {
        content = `import { eq } from 'drizzle-orm';\n` + content;
        changed = true;
    }

    // 3. For POST and PUT, inject userId into the body before insert/update
    // Replace `await requireAuth();` with `const session = await requireAuth();`
    if (content.includes('await requireAuth();')) {
        content = content.replace(/await requireAuth\(\);/g, 'const session = await requireAuth();');
        changed = true;
    }

    if (content.includes('const body = await req.json();')) {
        content = content.replace(
            /const body = await req\.json\(\);/,
            'const body = await req.json();\n    body.userId = session.user.id;'
        );
        changed = true;
    }

    // 4. For UPDATE/DELETE/GET that uses ID, we MUST add where(and(eq(id), eq(userId)))
    // Actually, simple way is just replace `where(eq(schema.X.id, id))` with `where(and(eq(schema.X.id, id), eq(schema.X.userId, session.user.id)))`
    // Wait, Drizzle `and` is needed.
    if (content.includes('where(eq(') && !content.includes('session.user.id')) {
        // Need to import `and`
        if (!content.includes('import {') || !content.includes('and')) {
            content = content.replace(/from 'drizzle-orm';/, ", and } from 'drizzle-orm';").replace(/import \{ eq, and \}/, "import { eq, and }");
        }
        
        // Find something like where(eq(schema.table.id, id)) or where(eq(schema.table.id, params.id))
        content = content.replace(/where\(eq\((schema\.\w+\.id), ([^\)]+)\)\)/g, 'where(and(eq($1, $2), eq($1.replace(".id", ".userId"), session.user.id)))');
        // The above replace is bad hack for $1.replace. We should extract the table name.
        content = content.replace(/where\(eq\(schema\.(\w+)\.id, ([^\)]+)\)\)/g, 'where(and(eq(schema.$1.id, $2), eq(schema.$1.userId, session.user.id)))');
        changed = true;
    }
    
    // 5. specific fix for settings/route.ts which does `const settings = await db.select().from(schema.siteSettings).limit(1);`
    if (filePath.includes('settings') && content.includes('db.select().from(schema.siteSettings).limit(1)')) {
        content = content.replace(/db\.select\(\)\.from\(schema\.siteSettings\)\.limit\(1\)/g, 'db.select().from(schema.siteSettings).where(eq(schema.siteSettings.userId, session.user.id)).limit(1)');
        changed = true;
    }
    
    // 6. specific fix for summary/route.ts
    if (filePath.includes('summary') && content.includes('db.select().from(schema.professionalSummary).limit(1)')) {
        content = content.replace(/db\.select\(\)\.from\(schema\.professionalSummary\)\.limit\(1\)/g, 'db.select().from(schema.professionalSummary).where(eq(schema.professionalSummary.userId, session.user.id)).limit(1)');
        changed = true;
    }

    // 7. specific fix for GET messages/route.ts
    if (filePath.includes('messages') && content.includes('db.select().from(schema.contactMessages)') && !content.includes('.where(')) {
        content = content.replace(/db\.select\(\)\.from\(schema\.contactMessages\)/g, 'db.select().from(schema.contactMessages).where(eq(schema.contactMessages.userId, session.user.id))');
        changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
    }
  });
}

processAdminRoutes();
