# Security Guidelines

## 🔒 Before Pushing to GitHub

### Critical Security Checklist

- [x] `.env.local` is in `.gitignore` (VERIFIED ✅)
- [x] `.gitignore` is properly configured
- [ ] No API keys or secrets in code
- [ ] Firebase service account keys are NOT committed
- [ ] `.env.example` contains only placeholder values

## 🚨 Never Commit These Files

### Environment Files
- `.env`
- `.env.local`
- `.env.development.local`
- `.env.production.local`
- Any file containing real API keys or secrets

### Firebase Credentials
- `service-account-key.json`
- Any file with `-firebase-adminsdk-` in the name
- `.firebaserc` (if it contains sensitive data)

### Database Files
- `*.db`
- `*.sqlite`
- Database dumps with real data

## ✅ Safe to Commit

- `.env.example` (with placeholder values only)
- `firestore.rules`
- `database.rules.json`
- Configuration files WITHOUT secrets
- Public assets in `/public`

## 🔐 Environment Variables Setup

### For New Developers

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your actual values:**
   - Get Firebase config from Firebase Console
   - Get Google Sheets credentials from Google Cloud Console
   - Never share these values publicly

3. **Verify .env.local is ignored:**
   ```bash
   git check-ignore .env.local
   # Should output: .env.local
   ```

## 🛡️ Firebase Security

### Firestore Rules
- Rules are defined in `firestore.rules`
- Always test rules before deploying
- Never use `allow read, write: if true;` in production

### Admin SDK
- Service account keys should be stored as environment variables
- Use Firebase Admin SDK only on the server-side
- Never expose admin credentials to the client

## 📝 Security Best Practices

### Code Review
- Review all commits before pushing
- Use `git diff` to check for accidentally added secrets
- Use tools like `git-secrets` to prevent committing secrets

### API Keys
- Use NEXT_PUBLIC_ prefix only for truly public keys
- Server-side keys should NEVER have NEXT_PUBLIC_ prefix
- Rotate keys if accidentally exposed

### Production Deployment
- Use environment variables in your hosting platform
- Never hardcode production credentials
- Enable 2FA on all service accounts

## 🚨 If Credentials Are Exposed

1. **Immediately revoke/rotate the exposed credentials**
2. **Remove them from Git history:**
   ```bash
   # Use BFG Repo-Cleaner or git-filter-branch
   ```
3. **Update `.gitignore` to prevent future exposure**
4. **Generate new credentials**
5. **Update environment variables on all platforms**

## 📞 Reporting Security Issues

If you discover a security vulnerability, please email:
- **Security Team:** security@technovate.com
- Do NOT open a public issue

## 🔍 Regular Security Audits

- [ ] Monthly review of `.gitignore`
- [ ] Quarterly credential rotation
- [ ] Regular dependency updates (`npm audit`)
- [ ] Review Firebase security rules
- [ ] Check for exposed secrets in repository

---

**Last Updated:** January 26, 2026
**Maintained by:** Technovate Security Team
