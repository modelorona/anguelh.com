---
title: "Batching rows of data with Sequelize, MariaDB, and Fastify"
pubDate: 2020-01-30T22:20:54.719Z
description: >-
  Today I realised just how useful it is to batch update data, going from 4
  minutes to 4 seconds.
---

I am involved in a year-long research project as part of my 4th year in University. The idea is to see if I can create an accurate way of determining if a mobile phone user has social anxiety based on basic information collected by the phone. The app is built with [Android](https://www.android.com/intl/en_uk/), and I am saving the data on a [MariaDB](https://mariadb.com/) remote server hosted on [Amazon Web Services](). I am using [Fastify](https://www.fastify.io/) as a server and [Sequelize](https://sequelize.org/) as an [ORM](https://stackoverflow.com/questions/1279613/what-is-an-orm-how-does-it-work-and-how-should-i-use-one).

One of the data points that I collect is Location. For the purposes of this article, the Location definition that I am using is as follows:

```java
class Location {

    long id; // used as primary key
    long latitude;
    long longitude;

    // constructor, getters, setters, toString removed for brevity
}
```

The app utilises the Google Play Services API for location gathering via the [Fused Location Provider](https://developers.google.com/location-context/fused-location-provider). The API is relatively straightforward, and I have implemented it so that it polls for location every 10 seconds or so. The Fused API advertises that it is better optimised for battery life compared to using the native Android location APIs. The obvious tradeoff is that now anyone that installs the app will need to have Google Play Services installed. I accepted this as I plan to do the trials on devices which are not rooted, do not have a custom ROM, and are not tampered with in any way.

Every 10 seconds, the app receives a [LocationResult](https://developers.google.com/android/reference/com/google/android/gms/location/LocationResult) item, and within it a [List](https://developer.android.com/reference/java/util/List.html) of [Location](https://developer.android.com/reference/android/location/Location.html) objects via the [getLocations](<https://developers.google.com/android/reference/com/google/android/gms/location/LocationResult.html#getLocations()>) method. These Locations are then saved to the internal database of the app.

When the time comes, the user has to upload the data to the MariaDB server. The app sends the data as HTTP requests using the [OkHttp](https://square.github.io/okhttp/) library generously provided by [Square](https://squareup.com/gb/en). There are multiple libraries for interacting with HTTP requests on Android. OkHttp was chosen as I had the most experience with it beforehand. I built up my request as such:

```java
// snippet taken from background Service
// relevant imports
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import java.util.List;
import java.io.IOException;

private void makeRequest() {
    final OkHttpClient client = new OkHttpClient();
    Request.Builder requestBuild = new Request.Builder()
            .url("https://my-server-url-where-the-database-is.com");

    List<String> locationJSON = locationAsJSON(dbApi); // dbApi declared above, it is my database communication object

    for (String loc : locationJSON) {
        RequestBody reqBody = RequestBody.create(loc, MediaType.parse("application/json; charset=utf-8"));

        Request req = requestBuild.post(reqBody).build();

        try (Response response = client.newCall(req).execute()) {
            if (!response.isSuccessful())
                throw new IOException("Unexpected code: " + response);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

private List<String> locationAsJSON(DatabaseLayerAPI dbApi) {

}

// other functionality
```

As can be seen above, it follows the examples that OkHttp have on their documentation. I do not show my actual error handling, as I believe that it may be distracting and unnecessary at the moment. For further clarification the `DatabaseLayerApi` class is of my own production. It is how I communicate with my database.

The gist is that I have a List of Java Strings, and each String represents an HTTP request that I want to send to my server. This is where I was presented with my problem: the database, after a couple of hours of collecting location, had about 9000 rows! With the other data, I could afford to send a network request for each row, as there were not many and it was relatively quick when tested.

With 9000 rows, this quickly becomes a problem. The overhead of creating a request for each row becomes almost exponential. It took me around 4 minutes to send all of them from my phone to the database. On the server, I was parsing each request and saving the row information. The server code to save looked like this:

```javascript
// code snippet
// relevant imports

'use strict';
const fastify = require('fastify')({});
const {Sequelize, DataTypes} = require('sequelize');
const opts = {
    bodyLimit: 5242880 // increase the body limit size in case the data is too big. 5mb should be enough, but you should test
};

const Location = sequelize.define('Location', {
    // other fields omitted
    id: {
        type: DataTypes.INT(11),
        primaryKey: true,
        allowNull: false,
        autoIncrement: false
    },
    latitude: {
        type: DataTypes.BIGINT(11)
    },
    longitude: {
        type: DataTypes.BIGINT(11)
    }
});

fastify.post('/save', opts, async (request, reply) => {
    const exists = await Location.findOne({
        where: {
            id: request.body.id
        }
    );

    if (!exists) {
        await Location.create({
            id: request.body.id,
            latitude: request.body.latitude,
            longitude: request.body.longitude
        });
    }

    return {code: 0};
});

// other functionality
```

The code above checks to see if the Location item already exists, and if it does not, then saves it in the database. Saving the data this way turned out to be a problem as well, but we will get to that later.

Going back to the Android code, I thought for a bit and came to the conclusion that since each Location object stores a minimal amount of data, I could safely batch them together and send multiples items per request in the form of an array. I thought about how to do this, and was able to find Google's [Guava](https://github.com/google/guava) library, particularly the [partition](https://guava.dev/releases/22.0/api/docs/com/google/common/collect/Lists.html#partition-java.util.List-int-) method in the [Guava Lists](https://guava.dev/releases/22.0/api/docs/com/google/common/collect/Lists.html) documentation. This would allow me to split up my 9000 records into lists of (almost) the same size. It would also take into account any leftover records I may have, and put them in a smaller list. Very handy method, and elimated the need for me to write any calculations.

With it, the Android Java code was modified to look as such:

```java
// relevant imports
import com.google.common.collect.Lists;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import java.util.List;
import com.my.app.database.entities.Location;
import com.my.app.database.DatabaseLayerAPI;

private List<String> locationJSON(DatabaseLayerAPI dbApi) {
    List<String> requests = new LinkedList<>(); // this will represent all of the network requests, converted from a JsonObject to a string

    try {
        List<Location> locations = dbApi.getLocations(getApplicationContext()); // this is all of the locations from the database

        List<List<Location>> locationLists = Lists.partition(locations, Math.floorMod(locations.size(), 1000)); // 1000 is not a special or magic number, you are welcome to try and see what works best for you

        for (List<Location> list : locationLists) {
            JsonObject request = new JsonObject();
            JsonArray batch = new JsonArray();

            for (Location location : list) {
                Location loc = new JsonObject();
                loc.addProperty("id", location.getId());
                loc.addProperty("latitude", location.getLatitude());
                loc.addProperty("longitude", location.getLongitude());
                batch.add(loc);
            }
            request.add("data", batch);
            requests.add(request.toString());
        }

    } catch (Exception e) {
        // multiple errors can be thrown, due to my code structure. Having the general Exception is not usual practice, only used here for brevity
    }

    return requests;
}

// other functionality
```

The code above creates a List of requests in String form. It does this by iterating through each List of Locations, places them in a JsonArray object, and once it is done with a list, adds that array to the `request` object, which is then added to the over List of requests. The JSON representation is as follows:

```json
"requests": [
    {
        "data": [
            {
                "id": "id,
                "latitude": 0
                "longitude": 0
            }, ...
        ]
    }, ...
]
```

It may seem confusing, but it works and is relatively straightforward to follow.

The server code had to be update to handle the new data format:

```javascript
// setup code omitted
fastify.post("/save", opts, async (request, reply) => {
  for (let pos = 0; pos < request.body.data.length; pos++) {
    // here goes the code for checking for existence as well as saving, omitted for brevity
  }
});
```

The new server code looped through each individual item per request. In essence, it is the same logic as before. The difference is that the entire procedure benefited from the server's hardware by letting it iterate through each item. The network overhead for sending a request per row was elimated.

With this modification to the Android and server code, the time to save 9000 records dropped to about 1.5 minutes. This is an incredible reduction, but not good enough. As mentioned earlier, the server code logic was problematic.

The server code recieves a batch of Location items, and then iterates through each item and saves it in the database. Seems alright...but surely there must be a way to save all of them at once. And behold, there is! The aptly named [bulkCreate](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-bulkCreate) method was exactly what I [had been waiting for.](https://www.youtube.com/watch?v=Wln6NX0V4AQ)

With some small changes, the explicit loop was removed, and a single call to bulkCreate was added, as such:

```javascript
// setup code omitted
fastify.post("/save", opts, async (request, reply) => {
  let items = request.body.data; // all of the items that were received in this request

  await Location.bulkCreate(items, {
    ignoreDuplicates: true,
  }).then(() => {
    console.log("all Locations saved");
  });
});
```

With this, the execution time went from 1.5 minutes to 3.7 seconds! Something can be said about not reinventing the wheel. Manual looping is alright for a small amount of data, but with this many rows, I would argue that it is better suited to let the ORM tool take care of it in situations like these, where I possess only the bare minimum of working with databases.

For the entire process, I used the [NodeJS Performance Timing API](https://nodejs.org/api/perf_hooks.html), specifically the [performance.now()](https://nodejs.org/api/perf_hooks.html#perf_hooks_performance_now) method. This method gave me the amount of seconds elapsed from the start of the `node` process, and with some basic calculations I am able to find the start and stop of the function execution, calculate the difference, and convert it to either minutes or seconds. All of the times above have been rounded to the nearest single decimal point.
