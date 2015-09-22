---
title: Organize your code
subTitle: PHP Best practices
currentMenu: php-organize
---

## Use a MVC framework
<span class="label label-success pull-right">Beginner</span>
###Rule

<div class="alert alert-info">Use a framework.</div>

###Explanation

Depending on the project we work on, we use different set of tools. One thing is sure however: we always use a 
framework that provides a descent **router**.

There are many frameworks out there, ranging from the gigantic Symfony 2 or Zend Framework 2 to the very small
Slim 3 or Silex micro-routers. At TheCodingMachine we even have our very own [Mouf](http://mouf-php.com), 
a framework based on dependency injection with a web-based UI.

One thing is fairly sure, you want to organize your code using controllers / services and a data layer.

<div class="row">
<div class="col-xs-6 col-xs-offset-3 box">Request</div>
</div>
<div class="row">
<div class="col-xs-6 col-xs-offset-3 arrow-down"></div>
</div>
<div class="row">
<div class="col-xs-12 box">Controllers</div>
</div>

<div class="row">
<div class="col-xs-7 arrow-down"></div>
<div class="col-xs-5 arrow-down"></div>
</div>

<div class="row">
<div class="col-xs-6 box">Services</div>
<div class="col-xs-1 arrow-right"></div>
<div class="col-xs-5 box">DAOs / Repositories</div>
</div>

<p></p>

- When a **request** arrives, it is routed by the framework to a **controller**
- The **controller** is in charge of analyzing the request and calling the relevant **services** or **DAOs** 
  (Data Access Objects, the classes in charge of communicating with the database).
- **Services** are objects that perform some kind of computation. It can be on the "domain layer" (i.e. computation
  that is directly related to the code of your application - what makes your application specific - ) or it can be
  purely technical services (like a mailer, a logger, etc...)
- Finally, the controller aggregates data received from various services and calls a "view" that will render the
  data in HTML (unless it is directly sent in another format like JSON).

## Limit the code in your controllers
<span class="label label-success pull-right">Beginner</span>
###Rule

<div class="alert alert-info"><strong>Limit the code in your controllers!</strong> A controller should not perform 
any kind of computation or any kind of database access. Its only role is to take the request and call the 
appropriate services. Based on the services response, it will generate the HTTP response send back to the 
browser (generally some HTML using a view, or some JSON if we are doing AJAX).</div>

###Explanation

TODO: example with SQL and computation.


## Write services

## Use dependency injection
