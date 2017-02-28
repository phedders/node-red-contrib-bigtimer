# The ultimate Timing node for Node-Red

## Purpose
BigTimer is a powerful timing node offering a range of timing facilities for Node-Red and can be used singly or in groups. Full support for dusk/sunset dawn/sunrise and variations also day/week/month (and special days) control. The node offers outputs suitable for MQTT, speech and databases. You can also manually over-ride the UTC time setting on the host computer if required.

## Usage
Suitable for general use, BigTimer has 3 outputs, one of which triggers when there is a change and presents one of two messages (for, for example MQTT or other control mechanism), the second is a simple 1 or 0 every minute in the payload but also has additional outputs reflecting the status message in msg.state and message time. There is also a msg.name available  - and the third outputs a message which could be used for speech or debugging. In the output msg there is additional useful info.

## Inputs
It also has an input. This can be used to override the schedule - valid commands in the payload are "on" (or 1), "off" (or 0) which override until the next change of automatic schedule state, "manual" which when used with "on" and "off" changes the state until the timeout times out (nominally 1440 minutes or 24 hours), "default" (or "auto") which scraps manual settings and goes back to auto, "stop" which stops the timer working completely (as does the "suspend" tickbox), without the affecting current outputs and "sync" which outputs the current state immediately without changing anything.

## Special Days
These include special days (i.e. 25/12) and special weekdays (i.e. first Tuesday of the month) (fixed in 1.5.2).

## General
Note - if upgrading to a later version of BigTimer - check your settings. More information on BigTimer and a range of home-control-related projects can be found at http://tech.scargill.net

The second output (1.5.1 onwards) now outputs a range of values every minute (in minutes past midnight) including sunrise and sunset. 
example:

payload: "0"
reference: "pergola/toesp:{out16:1}:{out16:0}:1082"
topic: "status"
state: "off"
time: "01hrs 24mins"
name: "Pergola Red Light"
dusk: 1166
dawn: 443
solarNoon: 804
sunrise: 470
sunset: 1139
night: 1227
nightEnd: 382

You can typically access these in a Node-Red function as msg.payload, msg.reference etc. See the blog at http://tech.scargill.net/big-timer for more info.



