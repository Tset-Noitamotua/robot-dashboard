Robot Dashboard
===============

|license|

.. |license| image:: https://img.shields.io/dub/l/vibe-d.svg?style=flat-square

Getting started (Windows 7)
---------------

- install Meteor (from here: https://www.meteor.com/install)
- clone this repository (e.g. to C:\robot-dashboard)
- cd into folder where you cloned this repository to (e.g. `cd C:\robot-dashboard`)
- run `meteor`
- (OPTIONAL: for those who are behind a corporate proxy)
	- run `set HTTP_PROXY=http://user:password@proxyhost_or_ip:port set HTTPS_PROXY=http://user:password@proxyhost_or_ip:port`
- after Meteor is running open your browser to http://localhost:3000/
- run robot-watchdog tests
- you should see some magic in your browser


When do I know that Meteor is running?
You should see something like this:

```shell
C:\robot-dashboard>meteor
[[[[[ C:\_GITHUB\robot-dashboard ]]]]]

=> Started proxy.

=> Meteor 1.3: ES2015 modules, npm integration, app testing, mobile
improvements, and more.

This release is being downloaded in the background. Update your app to
Meteor 1.3 by running 'meteor update'.

=> Started MongoDB.
=> Started your app.

=> App running at: http://localhost:3000/
   Type Control-C twice to stop.
```

The proposal
------------

To have a real-time dashboard displaying all your Robot Framework tests
being executed. It would include the server communication and user interface.
Advanced search and or filters seems to be interesting features. The server
can also act as a means to storage logs and facilitate debugging the test
execution.


Technology to be used
---------------------

The tools needed to make this a nice system are yet to be chosen. The
implementation that is available now is a very simple server created with
nodejs and a python watchdog that talks to it using HTTP. You can learn more
about it at `robot-watchdog <https://github.com/vkruoso/robot-watchdog>`_
github page.


Contributing
------------

If you have experience with real-time dashboards and fell like contributing,
please get in touch so we can share information about how this project might
go in the future.
