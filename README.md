# League of Legends Server Status

![Build Status](https://travis-ci.org/jsachs/lol_status.svg?branch=master)

[![Coverage Status](https://img.shields.io/coveralls/jsachs/lol_status.svg)](https://coveralls.io/r/jsachs/lol_status)

This is a simple webapp to monitor server status for League of Legends.
You can view the status of game server, the store, and forums.
If you subscribe to email alerts, a cron job running every 30 seconds checks
the current status of the game servers. Any change in status sends an
email to all subscribers.
