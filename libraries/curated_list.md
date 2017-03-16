---
title: Curated list of packages
subTitle: Packages we like
currentMenu: curated-list
---

This page contains a list of packages that we often use at TheCodingMachine and that we like (a lot).

## PHP libraries

### HTTP client libraries

Using cURL? Stop right there! cURL is hard to use. Error handling is poor (no exceptions, you have to check for errors manually), and there are a number of tricks one has to know to successfully use it (ask anyone who tried to do HTTPS with cURL).

You definitely want to use a "wrapper" around cURL that will make your life easier (we call that an "HTTP Client").

Libraries:

- [Guzzle (6+)](http://docs.guzzlephp.org/en/latest/)
- [HTTPlug](https://github.com/php-http/httplug) : an abstraction library on top of Guzzle. Use this (and this only) if you are writing a library meant to be used in several projects

### File system access

Need to access the file system? Think `fopen` and `fwrite` is enough? Think twice. Error handling is poorly done (no exceptions) and you might enjoy using a wrapper that will handle a lot of the tiny details onemust think about when accessing files.
 
Libraries:

- [symfony/filesystem](http://symfony.com/doc/current/components/filesystem.html): a battle-tested tiny lib on top of common file system functions.
- [The PHP league's flysystem](https://flysystem.thephpleague.com/): an abstraction library to easily swap out a local filesystem for a remote one. Think about accessing files using FTP, AWS S3, or Dropbox as easily as local files.

### Sending mails

Do not use PHP's `mail` function. It does a very poor job at sending HTML mails or attachments. Instead, rely on a solid mail library that does the job.

Libraries:

- [Swift mailer](http://swiftmailer.org/): an elegant object-oriented library to send emails
- [thecodingmachine/swift-twig-mail-template](https://github.com/thecodingmachine/swift-twig-mail-template): a bridge to easily turn Twig templates into Swift messages

### Image manipulation

You often need to display the same image using many resolutions (full size, thumbnails) and ratios (square, landscape or portrait). Worst thing to do would be loading the original (uploaded) image and resize or crop it using CSS, whitch will result in very low network performances. Also avoid developping your own "image preset manipulation" library.
- [ThePHPLeague's Glide](http://glide.thephpleague.com) : API is exposed via HTTP, ex : ```<img src="kayaks.jpg?w=300&h=300&fit=crop">```
- [Mouf's awsome MoufImage package](https://github.com/thecodingmachine/utils.graphics.mouf-imagine) : A Mouf wrapper around the [Imagine](https://github.com/avalanche123/Imagine) library. You can define URLs for each image preset inside Mouf.
