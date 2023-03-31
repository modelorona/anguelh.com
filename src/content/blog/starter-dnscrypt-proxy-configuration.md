---
title: Starter dnscrypt-proxy configuration
pubDate: 2021-07-28T14:18:39.400Z
description: This is a starting configuration for the dnscrypt-proxy application
  that anyone can use and modify.
---

[dnscrypt-proxy](https://github.com/DNSCrypt/dnscrypt-proxy/) is a DNS proxy that is designed to give you more control over your computer's DNS settings. It can be configured to block certain sites as well as enable secure communication with DNS servers. It is available on multiple systems including Windows, macOS, and Linux.

I recently read about it when learning more about [DNS over HTTPS (DoH)](https://support.mozilla.org/en-US/kb/firefox-dns-over-https), [DNS over TLS (DoT)](https://www.cloudflare.com/learning/dns/dns-over-tls/), and [DNSCrypt](https://dnscrypt.info/). Both DoH and DoT are designed to increase user privacy and security by encrypting the data between the client and DNS resolver. This would prevent eavesdropping and manipulation from an ISP or other man-in-the-middle. DNSCrypt is a protocol that prevents DNS spoofing by encrypting and authenticating communication between a DNS client and resolver.

I was intrigued, and wanted to know how to configure DoH/DoT on my own personal machine. My first step was to see if the browser had some setting, and it does. On both Firefox and Chrome (and other browsers based on those), there is a setting to input a DoH URL. There were some defaults including Cloudflare's [1.1.1.1](https://1.1.1.1) and [NextDNS](https://nextdns.io/) but I was interested in adding my own.

Hence, my research led me to dnscrypt-proxy. dnscrypt-proxy has the ability to input multiple DoH/DoT servers that the program then uses to balance the load. This allows for potentially faster queries based on the user's location, and further allows the program to have multiple options in case one of the servers is not available.

Official installation instructions can be found on the [dnscrypt-proxy GitHub wiki](https://github.com/DNSCrypt/dnscrypt-proxy/wiki/Installation) as well as some client suggestions. On Linux, I did not choose a client as I felt comfortable running dnscrypt-proxy as a service controllable via the command line. On Windows, I initially installed [SimpleDnsCrypt](https://github.com/bitbeans/SimpleDnsCrypt) but found it to be a bit unstable and noticed that it had not been updated in a bit, thus like Linux I ran it as a service.

dnscrypt-proxy has multiple other settings too, and at this point I am still learning about them. The snippet below shows my current configuration file. It is based off the default (with some modifications) that is provided when the program is installed. I make no guarantee that it is sound, and encourage you to pick it apart and see for yourself.

```toml

##############################################
#                                            #
#        dnscrypt-proxy configuration        #
#                                            #
##############################################

listen_addresses = ['127.0.0.1:53']

server_names = ['mullvad-adblock-doh', 'doh-crypto-sx', 'doh-crypto-sx-ipv6', 'doh-de-blahdns-v6', 'doh-de-blahdns', 'dnscrypt-ch-blahdns-ipv4', 'dnscrypt-ch-blahdns-ipv6', 'dnscrypt-de-blahdns-ipv4', 'dnscrypt-de-blahdns-ipv6']

max_clients = 250

# Use servers reachable over IPv4
ipv4_servers = true

# Use servers reachable over IPv6
ipv6_servers = true

# Use servers implementing the DNSCrypt protocol
dnscrypt_servers = true

# Use servers implementing the DNS-over-HTTPS protocol
doh_servers = true

# Server must support DNS security extensions (DNSSEC)
require_dnssec = true

# Server must not log user queries (declarative)
require_nolog = true

# Server must not enforce its own blocklist (for parental control, ads blocking...)
require_nofilter = false

disabled_server_names = ['google', 'yandex', 'altername']

force_tcp = false
timeout = 5000
keepalive = 30
cert_refresh_delay = 240
bootstrap_resolvers = ['9.9.9.9:53', '8.8.8.8:53']  # renamed from fallback_resolvers to bootstrap_resolvers in version 2.1.0. use fallback_resolvers if under version 2.1.0

ignore_system_dns = true
netprobe_timeout = 60
netprobe_address = '9.9.9.9:53'
log_files_max_size = 10
log_files_max_age = 7
log_files_max_backups = 1
block_ipv6 = false
block_unqualified = true
block_undelegated = true
reject_ttl = 600
cache = true
cache_size = 4096
cache_min_ttl = 2400
cache_max_ttl = 86400
cache_neg_min_ttl = 60
cache_neg_max_ttl = 600

[query_log]
  file = 'query.log'
  format = 'tsv'

[nx_log]
  file = 'nx.log'
  format = 'tsv'

[sources]
  [sources.'public-resolvers']
  urls = ['https://raw.githubusercontent.com/DNSCrypt/dnscrypt-resolvers/master/v3/public-resolvers.md', 'https://download.dnscrypt.info/resolvers-list/v3/public-resolvers.md', 'https://ipv6.download.dnscrypt.info/resolvers-list/v3/public-resolvers.md', 'https://download.dnscrypt.net/resolvers-list/v3/public-resolvers.md']
  cache_file = 'public-resolvers.md'
  minisign_key = 'RWQf6LRCGA9i53mlYecO4IzT51TGPpvWucNSCh1CBM0QTaLn73Y7GFO3'
  refresh_delay = 72
  prefix = ''

  [sources.'relays']
  urls = ['https://raw.githubusercontent.com/DNSCrypt/dnscrypt-resolvers/master/v3/relays.md', 'https://download.dnscrypt.info/resolvers-list/v3/relays.md', 'https://ipv6.download.dnscrypt.info/resolvers-list/v3/relays.md', 'https://download.dnscrypt.net/resolvers-list/v3/relays.md']
  cache_file = 'relays.md'
  minisign_key = 'RWQf6LRCGA9i53mlYecO4IzT51TGPpvWucNSCh1CBM0QTaLn73Y7GFO3'
  refresh_delay = 72
  prefix = ''

[broken_implementations]
  fragments_blocked = ['cisco', 'cisco-ipv6', 'cisco-familyshield', 'cisco-familyshield-ipv6', 'cleanbrowsing-adult', 'cleanbrowsing-adult-ipv6', 'cleanbrowsing-family', 'cleanbrowsing-family-ipv6', 'cleanbrowsing-security', 'cleanbrowsing-security-ipv6']

[anonymized_dns]
  skip_incompatible = false

```
