---
title: The Tor Network
pubDate: 2019-08-25T00:12:17.058Z
description: >-
  A quick description of the Tor network and the various parts that make up the
  network
---

I have known about the Tor network for quite some time now, but, have never thought about how it actually works.

So I set out on a journey. I read the official documentation, then some blogs, then some tutorials. The best way to learn and understand something is to get the theory and then see it in action. With that in mind, I am considering turning my unused Raspberry pi into either a bridge or a relay node.

What are the parts of the network?

The entire network is made up of nodes, or relays. The types of nodes are:

- Start node
- Middle node
- End node
- Bridge node

When your client initially connects to the network, it requests a start node from a list of publicly available nodes. This is where the client's request starts. That is the **start node**.

Once the start node receives the original request, it forwards it to a **middle node**. This middle node is different, as each request uses a random path to make it harder to find out the source and destination. This path is created by the client.

The request keeps bouncing from middle node to middle node, and is encrypted from the start. Once it reaches the **end node**, the request actually gets sent to the destination server from that end node. Since each node only knows where to forward the data to and where it came from, the complete path is not known by any middle node or by the destination server. The destination server can only see that the request came from the end node.

The returned data follows the same circuit back to the client. This path will be reused for requests made in a short time frame, but after some time, new requests will have a completely different path.

How does this help with anonymity? A packet of data contains the actual data as well as information in the header portion that lists the destination, the source, and other potentially identifying data. Encryption only encrypts the data portion, as the header portion needs to be readable so that network devices know how to interpret the packet. However, with the middle nodes that only know the previous and next nodes, no single point can be used to determine the source or destination of the original request. This makes it much harder to apply statistical attacks on the packets, and increases anonymity. And with a diverse base of users on the network as well as changing paths, anonymity only increases. Keep in mind, however, that there is never complete anonymity.

Tor advertises that it can circumvent censorship as well. It accomplishes this by using **bridges.** A bridge is a start node that is not publicly advertised, and hence is much harder to block.

I am still unsure about some properties of the network, and want to look into detail about the actual implementation of each node to see how it works.
