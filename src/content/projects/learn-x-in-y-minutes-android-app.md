---
title: "Learn X in Y Minutes Unofficial Android App"
description: ""
year: 2018
type: "Personal Project"
links:
  - label: "Github (Android) Repo"
    url: "https://github.com/modelorona/LearnXinYMinutesUnofficalAndroidApp"
    icon: "github"
  - label: "Github (Content Scraper) Repo"
    url: "https://github.com/modelorona/xinydownloader"
    icon: "github"
  - label: "Google Play Link"
    url: "https://play.google.com/store/apps/details?id=com.ah.xiny3&hl=en"
    icon: "google-play"
tech:
  - name: "Python 3"
    url: "https://www.python.org/"
  - name: "Java"
    url: "https://www.java.com/en/"
  - name: "Android"
    url: "https://www.android.com/"
  - name: "Firebase"
    url: "https://firebase.google.com/"
  - name: "BeautifulSoup4"
    url: "https://www.crummy.com/software/BeautifulSoup/"
order: 10
---

This was my first Android application. I am a big fan of the Learn X in Y Minutes website and wanted to see how I could translate it into a mobile app. A separate Python script is run that scrapes the Learn X in Y Minutes Github page and generates the HTML content to be saved in Firebase's Firestore. The app reads from the Firestore database and caches the content locally.
