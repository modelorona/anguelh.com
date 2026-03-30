---
title: "Scroll-It"
description: ""
year: 2020
type: "Personal Project"
links:
  - label: "Github Repo"
    url: "https://github.com/modelorona/Scroll-It"
    icon: "github"
  - label: "Website"
    url: "https://scroll-it.xyz"
    icon: "link"
tech:
  - name: "Vue.js"
    url: "https://vuejs.org/"
  - name: "Vuetify"
    url: "https://vuetifyjs.com/"
  - name: "snoowrap"
    url: "https://github.com/not-an-aardvark/snoowrap"
extraTags:
  - label: "Host"
    tags:
      - name: "Netlify"
        url: "https://www.netlify.com/"
order: 60
---

During the Lockdown of 2020, I had some time and wanted a small side project. I decided to learn more about Vue.js as I was using it for a work project at the same time. The goal was to create a website that could autoscroll through image posts from Reddit. With multiple monitors, I would use one for work and another one for scrolling through nature and city photos.
<hr />
In 2024 I migrated the project to Vue 3, necessitating a substantial rewrite due to the framework's composition API and breaking changes. I replaced snoowrap with direct Reddit API integration, eliminating a deprecated dependency and gaining finer control over each request.
