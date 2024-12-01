# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.2.0](https://github.com/cssninjaStudio/unplugin-fonts/compare/v1.1.1...v1.2.0) (2024-12-01)


### Features

* add fontBaseUrl and preconnectUrl on google font provider ([12684bc](https://github.com/cssninjaStudio/unplugin-fonts/commit/12684bc134737304baadde2aa9a3bfb2f8640742)), closes [#78](https://github.com/cssninjaStudio/unplugin-fonts/issues/78)
* add fontBaseUrl on typekit font provider ([724026b](https://github.com/cssninjaStudio/unplugin-fonts/commit/724026b4bb3be0233347310a0b3b0527a9747c70))
* support vite 6.0 ([#77](https://github.com/cssninjaStudio/unplugin-fonts/issues/77)) ([38332ba](https://github.com/cssninjaStudio/unplugin-fonts/commit/38332baad92a4b8f405a062242abc97f6e5a99b2))

### [1.1.1](https://github.com/cssninjaStudio/unplugin-fonts/compare/v1.1.0...v1.1.1) (2023-11-22)


### Bug Fixes

* build issue, importMap export ([ba7d88b](https://github.com/cssninjaStudio/unplugin-fonts/commit/ba7d88b2d55390c5828d306eb9992c8026a67f02))

## [1.1.0](https://github.com/cssninjaStudio/unplugin-fonts/compare/v1.0.3...v1.1.0) (2023-11-22)


### Features

* add support to fontsource variable v5 ([a17831d](https://github.com/cssninjaStudio/unplugin-fonts/commit/a17831d213ef3cf207f481bed7202526d7e235d4)), closes [#60](https://github.com/cssninjaStudio/unplugin-fonts/issues/60) [#57](https://github.com/cssninjaStudio/unplugin-fonts/issues/57)
* improve local file preload for vite and vitepress ([10d7067](https://github.com/cssninjaStudio/unplugin-fonts/commit/10d7067a98dae5b054e90e22922d3a0f471358c6))
* vite 5 compatibility ([15ea829](https://github.com/cssninjaStudio/unplugin-fonts/commit/15ea8291b9db79cf1ffd5dc7b4ceba8650e39a93))


### Bug Fixes

* bug in `fontsource.ts` when style is normal ([#52](https://github.com/cssninjaStudio/unplugin-fonts/issues/52)) ([1253f4d](https://github.com/cssninjaStudio/unplugin-fonts/commit/1253f4d4604e4a8b80bc342e252c17911fc439dc))
* **nuxt:** fontsource loading and custom font preloading ([5260277](https://github.com/cssninjaStudio/unplugin-fonts/commit/5260277b85fb92c64217a8a6ba4519637bc5f6bc))

### [1.0.3](https://github.com/cssninjaStudio/unplugin-fonts/compare/v1.0.2...v1.0.3) (2023-04-15)


### Bug Fixes

* **fontsource:** slugify family name to match package ([570ea24](https://github.com/cssninjaStudio/unplugin-fonts/commit/570ea24fe93341ed27f7178a2d46081cc0bc020e))
* **nuxt:** only load unfonts.css when necessary ([0c6bd30](https://github.com/cssninjaStudio/unplugin-fonts/commit/0c6bd30d77200675cda3eba20ec6370b2ee8a6e0))
* optionally generate sourcemap ([e6c5ffb](https://github.com/cssninjaStudio/unplugin-fonts/commit/e6c5ffbfbf9363563105c1e92e4e1a31ef8f138b))

### [1.0.2](https://github.com/cssninjaStudio/unplugin-fonts/compare/v1.0.1...v1.0.2) (2023-04-14)


### Bug Fixes

* Ressources typo in README ([0d41492](https://github.com/cssninjaStudio/unplugin-fonts/commit/0d41492ab70327d0b7afd609a30a59ae916107cf))

### [1.0.1](https://github.com/cssninjaStudio/unplugin-fonts/compare/v1.0.0...v1.0.1) (2023-04-14)


### Bug Fixes

* update dependencies ([2d75cbb](https://github.com/cssninjaStudio/unplugin-fonts/commit/2d75cbbface8a8ba5c4b2512da6995a54e850a92))

## [1.0.0](https://github.com/cssninjaStudio/unplugin-fonts/compare/v1.0.0-beta.1...v1.0.0) (2023-03-20)


### Bug Fixes

* exported links typing ([07b6e11](https://github.com/cssninjaStudio/unplugin-fonts/commit/07b6e113032506716f229cd46baa421c88a5598a))

## [1.0.0-beta.1](https://github.com/cssninjaStudio/unplugin-fonts/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2023-03-20)

## [1.0.0-beta.0](https://github.com/cssninjaStudio/unplugin-fonts/compare/v0.7.0...v1.0.0-beta.0) (2023-03-19)


### ⚠ BREAKING CHANGES

- rename virtual "virtual:fonts.css" to "unfonts.css"
- rename package "vite-plugin-fonts" to "unplugin-fonts"

### Features

* add astro component ([a31f167](https://github.com/cssninjaStudio/unplugin-fonts/commit/a31f16765e685cdcc37960f001d0ef1822b22e75))
* add custom font transformer ([05e339a](https://github.com/cssninjaStudio/unplugin-fonts/commit/05e339aa026e469d01a14a2334c3cb1bda2ac432))
* add fontsource font provider ([9cfa836](https://github.com/cssninjaStudio/unplugin-fonts/commit/9cfa8362d253053488c07bd10f4b323d682370b5))
* add fontsource provider ([e62f9c7](https://github.com/cssninjaStudio/unplugin-fonts/commit/e62f9c76e6a21b7957a3c22497496e1d79971904))
* add vitepress and sveltkit examples ([959914e](https://github.com/cssninjaStudio/unplugin-fonts/commit/959914e6beb36af9d82ac8b50a654fb02c0c8960))
* expose typescript declaration ([f3f2276](https://github.com/cssninjaStudio/unplugin-fonts/commit/f3f22766e9a95dd9c1518b329aeaa1c217e515dd))
* migrate plugin to unplugin ([5ae235a](https://github.com/cssninjaStudio/unplugin-fonts/commit/5ae235ac8db5b571634961c8ac85d1a5d6d333b7))


### Bug Fixes

* allow loading unfont.css with query ([9006d78](https://github.com/cssninjaStudio/unplugin-fonts/commit/9006d7820607adf96de1c14ad842c234ad6eb9f7))

## [0.7.0](https://github.com/cssninjaStudio/unplugin-fonts/compare/v0.6.0...v0.7.0) (2022-12-09)


### Features

* add vite 4 to peer dependencies version ([60bae97](https://github.com/cssninjaStudio/unplugin-fonts/commit/60bae97fcad268c73009c9950f07ce05ed50b785))
