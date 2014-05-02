# Naked Itchy Feet

This repository contains the source code for [our travel blog](http://nakeditchyfeet.com).

The blog is built using [HaggerstonJS](https://github.com/haggerstonjs/grunt-haggerston/) and can be generated and viewed 
from the contents of this repository.

First, make sure you have the dependencies installed:

 * [Git](http://git-scm.com/)
 * [Node / NPM](http://nodejs.org/)
 * [GruntJS](http://gruntjs.com/) (installed via `npm install -g grunt-cli`)

Then:

```
git clone https://github.com/vitch/nakeditchyfeet.git
cd nakeditchyfeet
npm install
grunt serve
```

And point your browser at [http://localhost:3000]().

The source code is open as an example of how to use HaggerstonJS to generate a moderately complex static site. 

However there is no guarantee that everything in this repository corresponds to best practices - the blog is being written on the road and modified as new requirements and ideas come up. Having no access to internet much of the time while writing the blog means there may be some wheels that are reinvented or stupid approaches are taken.

That said, there are some interesting examples of the power that HaggerstonJS gives you (custom middlewares, custom Swig filters and integration with additional grunt plugins/ tasks) here so it may be worth a look if you're interested in using HaggerstonJS for your own site...