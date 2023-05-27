# FLEXIANA-REACT

This repository contains a test app example for flexiana

## Setup

1. Clone this repository

```sh
git clone https://github.com/romJS/flexiana-app.git
```

2. Go to project folder and install dependencies

```sh
cd <PROJECT_FOLDER> && npm install
```

3. Run project

```sh
npm run dev
```

**Environment variables:**

`GITHUB_CLIENT_ID` – github client id for flexiana app<br>
`GITHUB_CLIENT_SECRET` – github secret key for flexiana app

NOTE: I made a branch with prefetching data in the table, but due to the request rate limits on github, it's hard to test.
It doesn't seem to always return the correct data. Please check primarily the main branch.
