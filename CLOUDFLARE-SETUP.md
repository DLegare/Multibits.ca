# Configuration Cloudflare + GitHub Pages pour Multibits.ca

## 🎯 Objectif
Ajouter les headers de sécurité (HSTS, CSP, etc.) à votre site hébergé sur GitHub Pages en utilisant Cloudflare comme proxy.

---

## 📋 Étape 1 : Configurer GitHub Pages

1. Allez sur votre dépôt : https://github.com/DLegare/Multibits.ca
2. Cliquez sur **Settings** → **Pages** (dans le menu de gauche)
3. Sous **Source**, sélectionnez :
   - Branch : `master` (ou `main`)
   - Folder : `/` (root) ou `/static` selon votre structure
4. Cliquez sur **Save**
5. **Notez l'URL** générée : `https://dlegare.github.io/Multibits.ca/`

### Si vous utilisez un domaine personnalisé :
- Dans **Custom domain**, entrez : `multibits.ca`
- Cochez **Enforce HTTPS**

---

## 📋 Étape 2 : Créer un compte Cloudflare

1. Allez sur **https://cloudflare.com**
2. Cliquez sur **Sign Up** (Gratuit)
3. Créez votre compte
4. Cliquez sur **Add a Site**
5. Entrez votre domaine : `multibits.ca`
6. Sélectionnez le plan **Free** (gratuit)

---

## 📋 Étape 3 : Configurer les DNS

### Dans Cloudflare :

1. Cloudflare va scanner vos DNS actuels
2. Ajoutez ces enregistrements DNS :

| Type  | Name | Content                        | Proxy Status |
|-------|------|--------------------------------|--------------|
| CNAME | @    | dlegare.github.io              | ✅ Proxied   |
| CNAME | www  | dlegare.github.io              | ✅ Proxied   |

3. **Important :** Assurez-vous que le nuage orange est **activé** (Proxied)

### Chez votre registraire de domaine (où vous avez acheté multibits.ca) :

4. Cloudflare va vous donner **2 nameservers** comme :
   ```
   name1.cloudflare.com
   name2.cloudflare.com
   ```
5. Allez dans les paramètres de votre domaine chez votre registraire
6. Remplacez les nameservers actuels par ceux de Cloudflare
7. Sauvegardez

⏱️ **Propagation :** Ça peut prendre 1-24 heures

---

## 📋 Étape 4 : Configurer SSL/TLS

1. Dans Cloudflare, allez dans **SSL/TLS**
2. Sélectionnez **Full** (pas Full Strict, car GitHub Pages utilise son propre certificat)
3. Allez dans **Edge Certificates**
4. Activez :
   - ✅ **Always Use HTTPS**
   - ✅ **Automatic HTTPS Rewrites**

### Configurer HSTS :

5. Dans **Edge Certificates**, cliquez sur **HTTP Strict Transport Security (HSTS)**
6. Activez HSTS avec ces paramètres :
   - **Status :** Enabled
   - **Max Age Header :** 12 months (31536000)
   - **Include Subdomains :** Enabled
   - **Preload :** Optional (recommandé)
   - **No-Sniff Header :** Enabled
7. Cliquez sur **Save**

---

## 📋 Étape 5 : Configurer les Headers de Sécurité (CSP, etc.)

### Méthode 1 : Transform Rules (Recommandé)

1. Dans Cloudflare, allez dans **Rules** → **Transform Rules**
2. Cliquez sur **Create rule**
3. Sélectionnez **Modify Response Header**

**Créez ces règles :**

#### Règle 1 : Content-Security-Policy

- **Rule name :** Add CSP Header
- **When incoming requests match :**
  - Field : `Hostname`
  - Operator : `equals`
  - Value : `multibits.ca`
- **Then :**
  - Operation : `Set static`
  - Header name : `Content-Security-Policy`
  - Value : `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self' mailto:;`

#### Règle 2 : Autres Headers de Sécurité

- **Rule name :** Add Security Headers
- **When incoming requests match :** (même que ci-dessus)
- **Then :** Ajoutez plusieurs headers :

| Operation | Header Name | Value |
|-----------|-------------|-------|
| Set static | X-Content-Type-Options | nosniff |
| Set static | X-Frame-Options | SAMEORIGIN |
| Set static | X-XSS-Protection | 1; mode=block |
| Set static | Referrer-Policy | strict-origin-when-cross-origin |
| Set static | Permissions-Policy | geolocation=(), microphone=(), camera=() |

5. Cliquez sur **Deploy**

---

## 📋 Étape 6 : Vérifier la Configuration

### Tester les headers :

1. Attendez quelques minutes pour que les changements se propagent
2. Ouvrez votre navigateur (Chrome/Edge)
3. Allez sur `https://multibits.ca`
4. Appuyez sur **F12** (Outils développeur)
5. Allez dans l'onglet **Network**
6. Rafraîchissez la page (F5)
7. Cliquez sur le premier fichier (la page HTML)
8. Allez dans l'onglet **Headers**
9. Vérifiez que vous voyez :
   - ✅ `strict-transport-security`
   - ✅ `content-security-policy`
   - ✅ `x-content-type-options`
   - ✅ `x-frame-options`

### Outils de test en ligne :

- **Security Headers :** https://securityheaders.com/?q=multibits.ca
- **SSL Labs :** https://www.ssllabs.com/ssltest/analyze.html?d=multibits.ca

---

## 📋 Étape 7 : Configuration GitHub (CNAME)

Pour que GitHub Pages reconnaisse votre domaine personnalisé :

1. Dans votre dépôt, créez un fichier `CNAME` à la racine
2. Contenu du fichier : `multibits.ca` (juste une ligne)
3. Commit et push

Ou faites-le directement dans GitHub :
- **Settings** → **Pages** → **Custom domain** → Entrez `multibits.ca`

---

## ✅ Résumé de l'Architecture

```
Visiteur → Cloudflare (Proxy + Headers de sécurité) → GitHub Pages (Contenu HTML/JS/CSS)
```

**Avantages :**
- ✅ Headers de sécurité complets (HSTS, CSP, etc.)
- ✅ CDN global (site plus rapide partout dans le monde)
- ✅ Protection DDoS
- ✅ Certificat SSL gratuit
- ✅ Cache intelligent
- ✅ Analytics (si activé)
- ✅ 100% Gratuit

---

## 🆘 Dépannage

### Le site ne se charge pas :
- Vérifiez que les nameservers sont bien changés chez votre registraire
- Attendez jusqu'à 24h pour la propagation DNS

### Les headers ne s'appliquent pas :
- Vérifiez que le proxy Cloudflare est activé (nuage orange)
- Videz le cache Cloudflare : **Caching** → **Configuration** → **Purge Everything**
- Videz le cache de votre navigateur (Ctrl+Shift+Delete)

### Erreur "Too many redirects" :
- Dans **SSL/TLS**, assurez-vous d'utiliser **Full** (pas Full Strict)

---

## 📞 Support

Si vous avez des questions :
- Documentation Cloudflare : https://developers.cloudflare.com/pages/
- Support GitHub Pages : https://docs.github.com/pages

---

**Créé pour Multibits.ca - Site bilingue (FR-CA / EN-CA)**
