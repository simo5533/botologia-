# npm non reconnu dans PowerShell / VS Code — Diagnostic et correction

Erreur typique :
```text
npm : Le terme 'npm' n'est pas reconnu comme nom d'applet de commande, fonction, fichier de script ou programme executable.
```

---

## 1. Vérifier si Node.js est installé

Dans **PowerShell** (ou terminal VS Code) :

```powershell
# Diagnostic complet (depuis la racine du projet)
powershell -ExecutionPolicy Bypass -File .\scripts\diagnose-node.ps1
```

Ou manuellement :

```powershell
# Node dans le PATH ?
node -v
npm -v

# Recherche dans les emplacements standards
Test-Path "C:\Program Files\nodejs\node.exe"
Test-Path "C:\Program Files (x86)\nodejs\node.exe"
Test-Path "$env:LOCALAPPDATA\Programs\node\node.exe"
```

- Si **aucun** ne renvoie `True` → Node.js n’est pas installé (voir § 2).
- Si l’un renvoie `True` mais `node` / `npm` ne sont pas reconnus → problème de PATH (voir § 3).

---

## 2. Installer Node.js (si absent)

1. Télécharger **Node.js LTS** : https://nodejs.org/fr  
2. Lancer l’installateur Windows.  
3. **Important** : à l’écran « Tools for Native Modules », cocher **automatically install the necessary tools** si proposé ; surtout, à la fin, vérifier que l’option **« Add to PATH »** est bien activée.  
4. Redémarrer **PowerShell** et **VS Code** (fermer toutes les fenêtres).  
5. Ouvrir un **nouveau** terminal PowerShell et vérifier :

```powershell
node -v
npm -v
```

Si les deux commandes affichent des numéros de version, passer à l’installation du projet (§ 5).

---

## 3. Corriger le PATH (Node installé mais npm non reconnu)

### 3.1 Pour la session en cours uniquement

À la racine du projet :

```powershell
. .\scripts\fix-path-current-session.ps1
npm install
npm run dev
```

Cela ajoute le dossier Node au PATH **uniquement** pour cette fenêtre PowerShell.

### 3.2 Ajouter Node au PATH de façon permanente (utilisateur)

Remplacer `C:\Program Files\nodejs` par le chemin où se trouve `node.exe` si différent.

**PowerShell (en tant qu’utilisateur, pas Admin obligatoire) :**

```powershell
$nodePath = "C:\Program Files\nodejs"
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$nodePath*") {
  [Environment]::SetEnvironmentVariable("Path", "$nodePath;$userPath", "User")
  Write-Host "PATH utilisateur mis a jour. Fermez et rouvrez PowerShell / VS Code."
} else {
  Write-Host "Node est deja dans le PATH utilisateur."
}
```

Puis **fermer et rouvrir** le terminal (et VS Code si besoin).

### 3.3 Vérifier le PATH après modification

```powershell
$env:Path -split ";" | Where-Object { $_ -match "node" }
```

Vous devez voir au moins une entrée contenant le dossier d’installation de Node.

---

## 4. PowerShell : stratégie d’exécution et profil

L’erreur « npm n’est pas reconnu » ne vient en général **pas** de l’exécution de scripts (ExecutionPolicy). Si malgré tout vous avez des erreurs sur les scripts `.ps1` :

```powershell
Get-ExecutionPolicy -List
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Pour lancer le diagnostic sans changer la politique pour tout le système :

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\diagnose-node.ps1
```

Profil PowerShell : normalement le profil ne bloque pas `npm`. Si vous avez modifié `$PROFILE`, assurez-vous de ne pas avoir supprimé ou écrasé `$env:Path` de façon à enlever le dossier Node.

---

## 5. VS Code : terminal et PATH

- Le terminal intégré VS Code hérite du **PATH du processus qui a lancé VS Code**.  
- Après avoir modifié le PATH (install Node ou § 3.2) : **fermer VS Code complètement** puis le rouvrir.  
- Ensuite, ouvrir un **nouveau** terminal (PowerShell) et taper :

```powershell
npm -v
```

Si `npm` est reconnu, dans le dossier du projet :

```powershell
cd "c:\Users\hp\OneDrive\Bureau\BoTooLogIA"
npm install
npm run dev
```

Si le chemin du projet est sous **OneDrive** et que vous avez des erreurs de chemins trop longs, déplacer le projet dans un dossier court (ex. `C:\Dev\BoTooLogIA`) peut aider ; cela n’affecte pas la reconnaissance de `npm`.

---

## 6. Résumé des commandes (état final attendu)

Dans un **nouveau** PowerShell (ou terminal VS Code), après correction du PATH :

```powershell
cd "c:\Users\hp\OneDrive\Bureau\BoTooLogIA"
node -v
npm -v
npm install
npm run dev
```

Ouvrir ensuite http://localhost:3000 dans le navigateur.

---

## 7. En cas d’installation Node corrompue ou ancienne

1. Désinstaller Node.js : **Paramètres Windows** → **Applications** → **Node.js** → Désinstaller.  
2. Supprimer manuellement si présents :
   - `C:\Program Files\nodejs`
   - `%APPDATA%\npm`
   - `%APPDATA%\npm-cache`
3. Réinstaller Node.js LTS depuis https://nodejs.org en cochant **Add to PATH**.  
4. Redémarrer le PC ou au minimum fermer tous les terminaux et VS Code, puis rouvrir.
