TheCodingMachine Best practices
===============================

This repository contains the best coding practice website of TheCodingMachine.

Website URL is https://bestpractices.thecodingmachine.com

The website is statically generated using [Couscous](http://couscous.io).

Find a typo or an error? Do not hesitate to submit a pull-request.

## How to contribute

### Setup

The site generation is working under PHP 8.1 and Node 16.

You will need to install bower and gulp using the following commands:

    npm install -g bower gulp

Then, install the dependencies:

    composer install
    npm install
    bower install

### Run the website locally

Compile the assets:

    gulp

Then run the website locally with:

    vendor/bin/couscous preview
