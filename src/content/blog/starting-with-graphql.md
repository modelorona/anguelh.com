---
title: Starting with GraphQL
pubDate: 2019-09-01T19:23:40.650Z
description: "I was forced to look at GraphQL, and it is not that bad"
---

In essence, GraphQL is a way for you to describe what data you want, and let the server do the work. Compared to a traditional RESTful interface, you only need to make one request instead of multiple, and you only get the data that you want, nothing more and nothing less.

For example, you may have a database that contains blog posts, and how many users have liked a post. With a REST interface, you would query for a blog post AND all of the likes at once. This would not be flexible. And there may be situations where you may want only likes, or only the blog post. Of course, the interface can always be tweaked, but this will lead to unnecessary complications and ugly code.

On the contrary, GraphQL would allow you to specify which portion of the data you want, and the server would fetch it. There are more steps than this, but I am only getting started, so expect some later blog posts to have more info.

A sample GraphQL query could look like this

```graphql
query {
  blogs {
    content
    author
  }
}
```

in which we would fetch only the blogs with their content and author. A blog post could have much more info, such as publish date, category, etc. But this way, we describe what data we want, and get only that. Very cool.
