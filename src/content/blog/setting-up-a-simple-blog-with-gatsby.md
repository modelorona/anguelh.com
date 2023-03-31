---
title: Setting up (and migrating) a simple blog with Gatsby and Netlify CMS
pubDate: 2020-05-22T19:46:17.937Z
description: I decided to upgrade an old blog from Hugo to Gatsby while still
  keeping the current CMS system. This is my process, and I hope it can help
  anyone who comes across it.
---

[Gatsby](https://www.gatsbyjs.org/) is a site-generator powered by [React](https://reactjs.org/) and [GraphQL](https://graphql.org/). It can use multiple sources for data, and outputs static HTML,CSS and React files that can be deployed on multiple static site hosting providers, such as [Netlify](https://www.netlify.com/) and [GitHub pages](https://pages.github.com/).

In fact, this very blog uses Gatsby and is hosted on Netlify.

My goal was to take an old [Hugo](https://gohugo.io/) powered blog and upgrade it to use Gatsby without having to rewrite any of the content. The reason for this was because the Hugo version was incredibly old, and updating to a new version broke a lot. Furthermore, the theme was not updated, and the viable solution was to update it. I decided to use a theme that is provided by the Gatsby theme, so that I can ensure that it will be updated.

The old blog used [Netlify CMS](https://www.netlifycms.org/) to provide a handy web interface to edit and add new content. I am using plain markdown files for each blog post, and Gatsby supports markdown content, so I only had to figure out how to setup the framework and then copy in the previous content. I wanted the new blog to work with the current CMS setup without requiring much tweaking.

[Node.js](https://nodejs.org/) was needed, and so at the time of writing I used the latest stable edition, which was v12 (the specific version was 12.16.3). It is important to note [Gatsby's Node version support](https://www.gatsbyjs.org/docs/upgrading-node-js/):

> Gatsby aims to support any version of Node that has a release status of Current, Active, or Maintenance. Once a major version of Node reaches End of Life status Gatsby will stop supporting that version.

The first step that I took was to install the Gatsby [CLI](https://www.gatsbyjs.org/docs/gatsby-cli/). With this tool, I can manage the project by building and testing. The command to install the tool is:

```shell
npm install -g gatsby-cli
```

The blog theme that I chose to use is [the starting Gatsby blog theme](https://www.gatsbyjs.org/packages/gatsby-theme-blog/).

Once the CLI is installed, a new blog can be created with the following command:

```shell
gatsby new my-blog https://github.com/gatsbyjs/gatsby-starter-blog-theme
```

where `my-blog` is the name of your blog and can be changed. The tool takes care of creating all of the necessary folders and files. Once it is finished, your structure (at the time of writing this) should resemble the diagram below:

```
my-blog
│───content
│   └───assets
|   │       avatar.png
│   └───posts
│           firstpost.mdx
│           secondpost.mdx
└───src
│   └───gatsby-theme-blog
│       └───components
│                bio-content.js
│       └───gatsby-plugin-theme-ui
│                colors.js
│   .prettierrc
│   gatsby-config.js
│   LICENSE
│   README.md
│   package.json
```

The `content` folder holds `assets` such as images and `posts`, which is where the markdown files will live. It is important to note that this theme uses the file format `mdx` which allows for interactive JSX components to be imported and used directly in the file. Regular markdown is written alongside it. The `avatar.png` can be replaced by any image of your choosing (but it must have the same name). It is the image that appears on the landing page of the site next to the biography content.

The `src` folder holds the components that are editable. In this case, we can change the content of `bio-content.js` to contain whatever text we want to appear on the landing page. The `colors.js` file lets us override the default theme colours.

The `gatsby-config.js` file is where we configure the site plugins as well as site metadata and other options. Gatsby has a very extensive plugin system, and many common functionalities can be installed from `npm` and added to the config file.

- This blog project will make use of:
  - [gatsby-plugin-manifest](https://www.gatsbyjs.org/packages/gatsby-plugin-manifest/) for generating icons of multiple size and other settings that allow the blog to become a Progressive Web App.
  - [gatsby-plugin-sitemap](https://www.gatsbyjs.org/packages/gatsby-plugin-sitemap/) to generate a sitemap.xml file when building.
  - [gatsby-plugin-robots-txt](https://www.gatsbyjs.org/packages/gatsby-plugin-robots-txt/) to generate a robots.txt file when building.
  - [gatsby-plugin-netlify-cms](https://www.npmjs.com/package/gatsby-plugin-netlify-cms) to integrate the CMS with the blog.
  - [gatsby-plugin-netlify](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-netlify) to generate the `_headers` and `_redirects` that are necessary for the Netlify CMS.
  - [gatsby-plugin-netlify-cache](https://github.com/axe312ger/gatsby-plugin-netlify-cache) to cache the build files. This one is not necessary but can help speed up subsequent builds.
  - [gatsby-plugin-nprogress](http://ricostacruz.com/nprogress/) to show a loading bar if the page is taking longer than usual. This one is not necessary but is helpful to convey to the user what is happening.
  - [gatsby-theme-blog](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-theme-blog) for the actual theme.

Installation instructions as well as configuration options for each plugin can be found on their respective website. For most of them, there are no options to configure, but for some you may want to tweak them to get what you desire. Once installed and added, my `gatsby-config.js` file resembles the content below:

```js
module.exports = {
  plugins: [
    "gatsby-plugin-netlify-cms",
    `gatsby-plugin-netlify`,
    "gatsby-plugin-netlify-cache",
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        color: `tomato`,
        showSpinner: true,
      },
    },
    {
      resolve: `gatsby-theme-blog`,
      options: {},
    },
    "gatsby-plugin-sitemap",
    "gatsby-plugin-robots-txt",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "",
        short_name: "",
        start_url: "/",
        background_color: "#0097a7",
        theme_color: "#26c6da",
        display: "minimal-ui",
        icon: "content/assets/icon.png",
        lang: "en",
        cache_busting_mode: "query",
      },
    },
  ],
  // Customize your site metadata:
  siteMetadata: {
    title: ``,
    author: ``,
    url: "",
    siteUrl: "",
    description: ``,
  },
};
```

This setup configures the Netlify CMS and any files it requires, a cache to build faster on Netlify's servers, a progress bar to indicate page load, a sitemap.xml and robots.txt generator, and manifest settings so that the blog can become a Progressive Web App.

And now, we have set up a basic blog with Gatsby! I had the Netlify CMS configured beforehand, since the old blog had used, but I will share the steps below that I took to configure it.

In the project root, add a file `config.yml` in `static/admin/` (create the folder structure if you do not have it already). This configuration file is what Netlify uses to configure the CMS for your site. There are a [plethora of options](https://www.netlifycms.org/docs/configuration-options/) that you can set. I have configured mine to build from the GitHub repo directly, and my settings are shown below:

```yml
backend:
  name: git-gateway
  branch: master

publish_mode: editorial_workflow
media_folder: "content/images/uploads"

collections:
  - name: "blog"
    label: "Posts"
    label_singular: "Post"
    extension: mdx
    format: frontmatter
    folder: "content/posts"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Body", name: "body", widget: "markdown" }
      - { label: "Date", name: "date", widget: "datetime" }
```

- The `backend` specifies to use my GitHub repo and to build from the master branch.

- The `publish_mode` allows me to have more control over my content, as I am able to create post drafts and publish them at a later time.

- The `media_folder` is where I tell Netlify to store all images that I upload through its admin interface.

- `collections` is where I tell Netlify how to handle my content as well as how to generate it. The settings below relate to the collections setting.
  - The `name` setting is the unique identifier. This is handy for when there are multiple collections in a site.
  - `label` and `label_singular` is how the collection will be displayed in the editor interface.
  - `extension` tells Netlify what kind of files to expect. In this case, the `mdx` extension is not directly known by Netlify, and so the `format` setting is necessary for it to interpret the files correctly.
  - `create` is necessary if the collection is a folder, as it allows for Netlify to create new files in that folder.
  - `slug` specifies the template for each file name.
  - `fields` maps the editor interface widgets to the content in the file. It is how Netlify can adapt to multiple post types and allow for more content to be added or removed. There are multiple options for this option but I have chosen for each post to just have a title, a date of publish, and a body.

After this, you would need to go into Netlify and enable the Identity option so that you are able to log in with a Google (or other provider) account. Furthermore, you can configure which GitHub repo it pulls from, and other settings. As mentioned before, Gatsby requires that the Node version is not end-of-life, and so you must add an environmental variable to specify the current Node version. I have specified version 12.16.3, which is currently the newest LTS version.

At this point, I have (almost) migrated my blog from Hugo to Gatsby while keeping the Netlify CMS setup. The last step for me was to transfer the post files to `content/posts`. Additionally, I would have to rename each `md` file to `mdx`. For this, thanks to this [Stack Overflow answer](https://stackoverflow.com/questions/7450818/rename-all-files-in-directory-from-filename-h-to-filename-half/7451880#7451880), I was able to use the following script to convert all of the files at once:

```shell
for file in *.md; do mv "$file" "${file/.md/.mdx}"; done
```

Thank you for reading my short article on how I updated my post to a different static-site generating framework. Perhaps in a couple of years, there may be yet another upgrade post.
