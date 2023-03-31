---
title: "@Transactional Annotation in Spring Boot"
pubDate: 2019-08-20T21:36:37.415Z
description: Remembering what the annotation @Transactional in Spring Boot means
---

First off, let us establish that the annotation @Transactional is related to working with database transactions in Spring Boot.

In applications, the need arises for database transactions to either completely pass or fail. There is no middle-ground. For example, either all objects in a collection are saved, or if one fails, none of them are. This requires the database to be rolled back to the state it was before the first item was added, and to remove everything that was added up to the point of failure. Of course, this is a very "basic" view of how this functionality should be implemented, and it is expected that Spring (and other frameworks that have this functionality) possess a certainly more elegant implementation.

As it is an annotation, Spring will handle this behind-the-scenes, and hence the mental load to the developer is lessened. As most annotations, there are settings to configure the functionality, and these can be found by a simple search.

It is important to keep in mind when to use it, and as most answers, this will be application as well as use case specific. Be mindful of the capabilities of the framework that you have at hand, and exploit it to the best of your abilities.
