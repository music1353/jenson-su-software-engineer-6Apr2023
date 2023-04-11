# Spotlight

<img src="https://i.imgur.com/d9EjVx3.png" alt="Imgur" />

**Spotlight** is the simplest and trendiest profile generator made by Jenson.

Explore Spotlight: <a href="http://35.221.133.49" target="_blank">http://35.221.133.49</a>

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Local Deployment](#local-deployment)
- [Maintainers](#maintainers)

## Features

- **Create your own profile in easy way and clean UIUX**

  - Set your basic info: name, avatar, age.
  - Set your experiences: job title, company name, company logo, job description, start date and end date.

  <img src="https://i.imgur.com/c9GPnUQ.png" alt="Imgur" style="zoom: 25%;" />

- **Offline Editing**

  If you are offline, don't worry! Spotlight will store your changes and sync your data after you restore the network.

  Notice: the sync function can only be used for editing Basic Info and Experiences, and cannot be used for changing images.

- **Profile Sharing**

  Set your profile privacy to public, and then share your profile with others using a unique link.

  Alternatively, you can set a **View Passcode** to restrict access to your profile.

  <img src="https://i.imgur.com/FgLskyB.png" alt="Imgur" style="zoom: 25%;" />

- **RWD**

  Spotlight supports Responsive Web Design that you can view profile easily on the phone.

  <img src="https://i.imgur.com/RKB0BAF.png" alt="Imgur" height="400" />

## Tech Stack

* Frontend: React, Redux Toolkit, Ant Design, Typescript
* Backend: Express, Typescript
* Database: PostgreSQL
* Server: Nginx, Google Cloud Platform, AWS S3, Docker Swarm

## Local Deployment

### Backend

1. Install **PostgreSQL** 15 and you can also download **pgAdmin 4,** which provides a graphical interface for adjusting the database.

2. Create a **.env** file and set some important variables such as database connection information, AWS S3 settings, etc.

   The .env variables include:

   * APP_PORT
   * APP_SESSION_SECRET
   * DB_HOST
   * DB_PORT
   * DB_USERNAME
   * DB_PASSWORD
   * DB_NAME
   * AWS_REGION
   * AWS_ACCESS_KEY_ID
   * AWS_SECRET_ACCESS_KEY
   * AWS_BUCKET_NAME

3. `yarn install` & `yarn dev` to run the backend service

### Frontend

1. `yarn install` & `yarn start`

## Maintainers

[@Jenson Su](https://github.com/music1353)
