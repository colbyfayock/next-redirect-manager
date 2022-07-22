# 🔗 Next.js Redirect Manager Starter for Vercel

Dashboard for adding, removing, and viewing Vercel redirects.

- [⚡️ Quick Start](#%EF%B8%8F-quick-start)
- [🚀 Getting Started](#-getting-started)
- [🧐 What is this?](#-what-is-this)
- [🧰 Configuration](#-configuration)

<img width="666" alt="App UI with Redirect Example" src="https://user-images.githubusercontent.com/1045274/180498180-3a3e2e07-71a3-4350-bc20-513a4b0e73d5.png">

## ⚡️ Quick Start

Deploy this project to Vercel with your configured environment variables.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcolbyfayock%2Fnext-redirect-manager)

```
NEXT_PUBLIC_APP_HOSTNAME="<Your Public Hostname (ex: myredirect.com)>"

GITHUB_CLIENT_ID="<Your GitHub Client ID (ex: abcd1234)>"
GITHUB_CLIENT_SECRET="<Your GitHub Client Secret (ex: abcd1234)>"
GITHUB_REPOSITORY="<Your GitHub Repository Name (ex: myrepo)>"

VERCEL_ACCESS_TOKEN="<Your Vercel Access Token (ex: abcd1234)>"

NEXTAUTH_SECRET="<Your NextAuth Secret (ex: abcd1234)>"
NEXTAUTH_URL="<Your App URL (ex: https://myredirect.com)>"

# Optional: Only if you want to repository management done
# by an account other than the oAuth seession

# GITHUB_ACCESS_TOKEN="<Your GitHub Access Token (ex: abcd1234)>"

# Optional: Only if project is deployed to a Vercel Team

# VERCEL_TEAM_ID="<Your Vercel Team ID (ex: myteam)>"
```

[More information about environment variables](#environment-variables)

## 🚀 Getting Started

### Requirements
* GitHub Account & Access Token
* GitHub oAuth App Credentials
* Vercel Account & Access Token
* Environment variables (see below)

### Running the Project on a Local Environment

#### 1. Creating a new project locally

Use Create Next App to create a new project instance locally

```bash
yarn create next-app -e https://github.com/colbyfayock/next-redirect-manager
# or
npx create-next-app -e https://github.com/colbyfayock/next-redirect-manager
```

#### 2. Add project environment variables

Add an `.env.local` file to the root of the project

```
NEXT_PUBLIC_APP_HOSTNAME="<Your Public Hostname (ex: myredirect.com)>"

GITHUB_CLIENT_ID="<Your GitHub Client ID (ex: abcd1234)>"
GITHUB_CLIENT_SECRET="<Your GitHub Client Secret (ex: abcd1234)>"
GITHUB_REPOSITORY="<Your GitHub Repository Name (ex: myrepo)>"

VERCEL_ACCESS_TOKEN="<Your Vercel Access Token (ex: abcd1234)>"

NEXTAUTH_SECRET="<Your NextAuth Secret (ex: abcd1234)>"
NEXTAUTH_URL="<Your App URL (ex: https://myredirect.com)>"

# Optional: Only if you want to repository management done
# by an account other than the oAuth seession

# GITHUB_ACCESS_TOKEN="<Your GitHub Access Token (ex: abcd1234)>"

# Optional: Only if project is deployed to a Vercel Team

# VERCEL_TEAM_ID="<Your Vercel Team ID (ex: myteam)>"
```

[More information about environment variables](#environment-variables)

## 🧐 What is this?

### What is this?

Redirects and shortlinks are a common way to make it easier to direct people to content whether it's because the URL is too long or you want the flexibility to change the location of the redirect later. But unless you're paying for a service to manage this for you, you're often left manually editing a platform configuration file which can be a pain and prone to errors.

This application starter spins up a new Next.js project that takes advantage of GitHub code and file storage and Vercel redirects to given someone the ability to more easily manage redirects including adding, deleting, and simply viewing existing links.

## What tools does this use?

Primarily:
* [GitHub](https://github.com/) and [Octokit](https://octokit.github.io/rest.js/v18) for "file management" and access management
* [Next.js](https://nextjs.org/) for a web framework to build a [React](https://reactjs.org/) app upon
* [NextAuth.js](https://next-auth.js.org/) for oAuth authentication
* [Sass](https://sass-lang.com/) with CSS Modules for styling

A few other for ease-of-development, UX, and delight:
* [fuse.js](https://fusejs.io/)
* [react-copy-to-clipboard](https://www.npmjs.com/package/react-copy-to-clipboard)
* [react-icons](https://react-icons.github.io/react-icons/)
* [SWR](https://swr.vercel.app/)
* [use-http](https://github.com/ava/use-http)

### How does authentication work?

There are a few authentication points:
* Logged in user authentication
* Vercel deployment reading
* GitHub repository management

A single GitHub user is used to add commits to the repository, essentially managing the project on behalf of the logged in user.

A logged in GitHub account that has been added as a collaborator to the repository can make changes including adding redirects and removing redirects. Unless a separate account is specified, this account is also the committer of the update to the repository.

In order to get the status of whether or not a redirect is "live", the most recent Vercel deployment is inspected and compared to the most recent commit's filetree to determine what is actually deployed.

To orchestrate all of this, NextAuth.js is used to provide easy oAuth integration and the Octokit SDK is used to make GitHub requests with the provided token whether the oAuth token or the designated personal access token.

## 🧰 Configuration

### Environment Variables

| Name                               | Required | Example                | Description                                                          |
| ---------------------------------- | -------- | ---------------------- | -------------------------------------------------------------------- |
| GITHUB_REPOSITORY                  | Yes      | myrepo                 | Repository where project is hosted.                                  |
| GITHUB_ACCESS_TOKEN                | No       | abcd1234               | Access token for repository management user (not logged in user)     |
| GITHUB_CLIENT_ID                   | Yes      | abcd1234               | oAuth App Client ID                                                  |
| GITHUB_CLIENT_SECRET               | Yes      | abcd1234               | oAuth App Client Secret                                              |
| NEXT_PUBLIC_APP_HOSTNAME           | Yes      | myredirect.com         | Public hostname of deployed application (ex: myredirect.com)         |
| NEXTAUTH_SECRET                    | Yes      | abcd1234               | Random key for NextAuth.js authentication                            |
| NEXTAUTH_URL                       | Yes      | https://myredirect.com | Environment hostname (http://localhost:3000, https://myredirect.com) |
| VERCEL_ACCESS_TOKEN                | Yes      | abcd1234               | Access token for Vercel user with scope to project / team            |
| VERCEL_TEAM_ID                     | No       | myteam                 | ID of team where Vercel project is scoped if not a personal account  |

### Configuring GitHub

To set up GitHub, we need the following:
* A GitHub repository where the project is hosted
* GitHub oAuth client credentials to allow external users to log in
* Collaborator access given to anyone who can log in and manage redirects

We optionally need:
* GitHub Access token of the user that will manage the repository with applied commits if not the logged in user

#### GitHub Repository

The GitHub repository should contain the Next.js project from this Starter.

If you're using Create Next App, you can [add a local repository to GitHub using Git](https://docs.github.com/en/get-started/importing-your-projects-to-github/importing-source-code-to-github/adding-locally-hosted-code-to-github#adding-a-local-repository-to-github-using-git).

> Tip: instructions are also given on the starting page when creating a new, empty repository. Be sure not to add a README or any other starting files while creating the new repository if adding your local project.

#### GitHub oAuth Application

[Create a new oAuth application with your GitHub account](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app).

Most of the fields you can fill in as needed, but to ensure NextAuth.js can interface with GitHub, set the Callback URL as:
```
http://localhost:3000/api/auth/callback/github
```
Where you would replace `http://localhost:3000` with the host where you're accessing the application API.

> Tip: You can create multiple oAuth applications for a Dev environment (localhost) and prod environment (myredirect.com)

Once the application is created, you'll be supplied a Client ID and Client Secret which you'll use in your environment variables `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.

#### GitHub Access Token for Repository Management

Optionally, you can set up a separate user to perform commits to the repository when adding or removing redirects. This can be a user account or it can be a new "bot" account created for this purpose.

Ultimately, with the user that will manage access, [create a Personal Access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with the following scopes:
* repo
* read:user
* read:email

Once created, you will be supplied with a token which will be used in your environment variable `GITHUB_ACCESS_TOKEN`.

### Configuring Vercel

#### Getting the Team ID

If your appication is deployed to a [Team](https://vercel.com/docs/concepts/teams/overview) and not just your personal account, you'll need your Team ID for the API requests which is typically in your Vercel account's URL (vercel.com/<Team ID>)

[Using the Access Token in Team API Calls](https://vercel.com/support/articles/how-do-i-use-a-vercel-api-access-token#using-the-access-token-in-team-api-calls)
