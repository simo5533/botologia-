# « npm n'est pas reconnu » — Solution

Cette erreur signifie que **Node.js** n'est pas installé ou que **npm** n'est pas dans le PATH Windows.

---

## Solution 1 : Installer Node.js (recommandé)

1. Téléchargez l’installateur **LTS** : https://nodejs.org/fr  
2. Lancez l’installateur.  
3. **Important** : cochez l’option **« Add to PATH »** (Ajouter au PATH).  
4. Terminez l’installation, puis **fermez et rouvrez** le terminal (ou Cursor).  
5. Vérifiez :
   ```cmd
   node -v
   npm -v
   ```
6. Dans le dossier du projet :
   ```cmd
   cd "c:\Users\hp\OneDrive\Bureau\BoTooLogIA"
   npm install
   npm run dev
   ```

---

## Solution 2 : Utiliser le script qui trouve Node tout seul

Si Node.js est déjà installé mais pas dans le PATH :

- Double-cliquez sur **`ouvrir-terminal-avec-node.bat`** à la racine du projet.  
- Une fenêtre CMD s’ouvre avec le PATH mis à jour.  
- Dans cette fenêtre, exécutez :
  ```cmd
  npm install
  npm run dev
  ```

---

## Solution 3 : Appeler npm avec son chemin complet

Si Node est dans `C:\Program Files\nodejs\` :

```cmd
cd /d "c:\Users\hp\OneDrive\Bureau\BoTooLogIA"
"C:\Program Files\nodejs\npm.cmd" install
"C:\Program Files\nodejs\npm.cmd" run dev
```

Si Node est dans `C:\Program Files (x86)\nodejs\` :

```cmd
cd /d "c:\Users\hp\OneDrive\Bureau\BoTooLogIA"
"C:\Program Files (x86)\nodejs\npm.cmd" install
"C:\Program Files (x86)\nodejs\npm.cmd" run dev
```

---

## Vérifier où Node est installé

Dans PowerShell :

```powershell
Get-Command node -ErrorAction SilentlyContinue | Select-Object Source
dir "C:\Program Files\nodejs\node.exe" 2>$null
dir "C:\Program Files (x86)\nodejs\node.exe" 2>$null
dir "$env:LOCALAPPDATA\Programs\node\node.exe" 2>$null
```

Utilisez le dossier où `node.exe` est trouvé dans les commandes de la Solution 3.
