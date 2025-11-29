# Package Maintenance

## Upgrading Astro

[Astro Docs](https://docs.astro.build/en/upgrade-astro/#upgrade-to-the-latest-version)

```bash
npx @astrojs/upgrade
```

## Node.js / npm

### Check node version

```bash
node --version
```

The node version is hardcoded in the `.nvmrc` file in the project root. Update this file when node version changes.

### Outdated Packages

Check for all outdated packages: 

```bash
npm outdated
```

Update all packages: 

```bash
npm update
```

Update specific package:

```bash
npm update <package-name>
```

Save changes to `package.json`. 

```bash
npm update --save
```
