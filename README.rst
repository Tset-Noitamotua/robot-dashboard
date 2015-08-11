Robot Dashboard
===============

|license|

.. |license| image:: https://img.shields.io/dub/l/vibe-d.svg?style=flat-square


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
