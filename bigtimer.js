/**
 * This node is copyright (c) Peter Scargill - but as I've had so many ideas from others -
 * consider it free to use for whatever purpose you like. If you redesign it
 * please remember to drop my name and link in there somewhere.
 * http://tech.scargill.net This software puts out one of two messages on change
 * of state which could be sent to the MQTT node, tests every minute and can be
 * manually over-ridden
 */

module.exports = function(RED) {
	"use strict";
	var SunCalc = require('suncalc');
	
	function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
	
	function randomInt (low, high) {
    var m=Math.floor(Math.random() * (Math.abs(high) - low) + low);
	if (high<=0) return -m; else return m;
}
	
	function bigTimerNode(n) {
		RED.nodes.createNode(this, n);
		var node = this;
	
		var ismanual=-1;
		var timeout=0;
		var startDone=0;
		
		var onlyManual=0;
		
		node.lat = n.lat;
		node.lon = n.lon;
		node.start = n.start;
		node.end = n.end;
		node.startT = n.starttime;
		node.endT = n.endtime;
		node.startOff = n.startoff;
		node.endOff = n.endoff;
		node.outtopic = n.outtopic;
		node.outPayload1 = n.outpayload1;
		node.outPayload2 = n.outpayload2;
		node.outText1 = n.outtext1;
		node.outText2 = n.outtext2;

		node.sun = n.sun;
		node.mon = n.mon;
		node.tue = n.tue;
		node.wed = n.wed;
		node.thu = n.thu;
		node.fri = n.fri;
		node.sat = n.sat;
		node.jan = n.jan;
		node.feb = n.feb;
		node.mar = n.mar;
		node.apr = n.apr;
		node.may = n.may;
		node.jun = n.jun;
		node.jul = n.jul;
		node.aug = n.aug;
		node.sep = n.sep;
		node.oct = n.oct;
		node.nov = n.nov;
		node.dec = n.dec;
		node.suspend=n.suspend;
		node.random=n.random;
		node.repeat=n.repeat;
		node.atStart=n.atstart;
		
	    var goodDay=0;
		
		var temporaryManual=0;
		var permanentManual=0;
		
		var autoState=0;
		var lastState=-1;
		
		var playit = 0;
		var newEndTime = 0;
		
		var actualStartOffset=0;
		var actualEndOffset=0;

		var actualStartTime=0;
		var actualEndTime=0;
		
		var manualState=0;
		var autoState=0;
		var lastState=-1;
		
		var change=0;
								
		node
				.on(
						"input",
						function(inmsg) {
							var now = new Date();
							var nowOff = -now.getTimezoneOffset() * 60000;
							var times = SunCalc.getTimes(now, node.lat,
									node.lon);
							var nowMillis = Date.UTC(now.getUTCFullYear(), now
									.getUTCMonth(), now.getUTCDate(), now
									.getUTCHours(), now.getUTCMinutes(), 1);
							var midnightMillis = Date.UTC(now.getUTCFullYear(),
									now.getUTCMonth(), now.getUTCDate(), 0, 1);
							var startMillis = Date.UTC(times[node.start]
									.getUTCFullYear(), times[node.start]
									.getUTCMonth(), times[node.start]
									.getUTCDate(), times[node.start]
									.getUTCHours(), times[node.start]
									.getUTCMinutes());
							var endMillis = Date.UTC(times[node.end]
									.getUTCFullYear(), times[node.end]
									.getUTCMonth(), times[node.end]
									.getUTCDate(), times[node.end]
									.getUTCHours(), times[node.end]
									.getUTCMinutes());

							nowMillis += nowOff;
							startMillis += nowOff;
							endMillis += nowOff;

							var outmsg = {
								payload : "",
								topic : ""
							};
							var outmsg2 = {
								payload : "",
								topic : "status"
							};
							var outtext = {
								payload : "",
								topic : ""
							};
							
							if ((node.random) && (actualStartOffset==0)) actualStartOffset=randomInt(0,node.startOff);
	                        if ((node.random) && (actualEndOffset==0)) actualEndOffset=randomInt(0,node.endOff);
							
							
							var dawn = (((startMillis - midnightMillis) / 60000)) % 1440;
							var dusk = (((endMillis - midnightMillis) / 60000)) % 1440;
							var today = (Math
									.round((nowMillis - midnightMillis) / 60000)) % 1440;
							var startTime = parseInt(node.startT, 10);
							var endTime = parseInt(node.endT, 10);

							if (startTime == 5000)
								startTime = dawn;
							if (startTime == 6000)
								startTime = dusk;
							if (endTime == 5000)
								endTime = dawn;
							if (endTime == 6000)
								endTime = dusk;
							
							actualStartTime=(startTime+Number(actualStartOffset))%1440;  
							actualEndTime= (endTime+Number(actualEndOffset))%1440; 
			
							autoState = 0; goodDay=0;
							switch (now.getDay()) {
							case 0:
								if (node.sun)
									autoState=1;
								break;
							case 1:
								if (node.mon)
									autoState=1; ;
								break;
							case 2:
								if (node.tue)
									autoState=1;
								break;
							case 3:
								if (node.wed)
									autoState=1; 
								break;
							case 4:
								if (node.thu)
									autoState=1;
								break;
							case 5:
								if (node.fri)
									autoState=1; 
								break;
							case 6:
								if (node.sat)
									autoState=1;
								break;
							}

							if (autoState)
							{ 
							autoState=0;
						    switch (now.getMonth()) {
								case 0:
									if (node.jan)
										autoState=1;
									break;
								case 1:
									if (node.feb)
										autoState=1;
									break;
								case 2:
									if (node.mar)
										autoState=1;
									break;
								case 3:
									if (node.apr)
										autoState=1;
									break;
								case 4:
									if (node.may)
										autoState=1;
									break;
								case 5:
									if (node.jun)
										autoState=1;
									break;
								case 6:
									if (node.jul)
										autoState=1;
									break;
								case 7:
									if (node.aug)
										autoState=1;
									break;
								case 8:
									if (node.sep)
										autoState=1;
									break;
								case 9:
									if (node.oct)
										autoState=1;
									break;
								case 10:
									if (node.nov)
										autoState=1;
									break;
								case 11:
									if (node.dec)
										autoState=1;
									break;
								}
								if (autoState==1) goodDay=1; 
							}
							// if autoState==1 at this point - we are in the right day and right month

							if (autoState==1) // have to handle midnight wrap
							{
								autoState=0;
								if (actualStartTime <= actualEndTime) {
									if ((today >= actualStartTime)
											&& (today <= actualEndTime))
										autoState=1;
								} else {
									if ((today >= actualStartTime)
											|| (today <= actualEndTime))
										autoState=1;
								}
							}

							// autoState is 1 or 0 or would be on auto.... has anything changed...
							change=0;
							
							if (autoState!=lastState) // there's a change of auto
							{
							 lastState=autoState; change=1;
							 if (autoState==1) actualEndOffset=0; else actualStartOffset=0; // if turning on - reset random offset for next OFF time else reset offset for next ON time
							 temporaryManual=0; // kill temporary manual as we've changed to next auto state
							}
							
							// manual override
							switch (inmsg.payload)
							{
								case "on"  :
								case "ON"  :
								case "1"   : if ( permanentManual==0) { temporaryManual=1; timeout=480; } else timeout=1440;
											 change=1; manualState=1; timeout=480; break;
								case "off" :
								case "OFF" :
								case "0"   : if ( permanentManual==0) { temporaryManual=1; timeout=480; } else timeout=1440;
								             change=1; manualState=0; timeout=480; break;
								case "default" :
								case "DEFAULT" :
								case "auto" :
								case "AUTO" : temporaryManual=0; permanentManual=0; change=1; break;
								case "manual" :
								case "MANUAL" : temporaryManual=0; permanentManual=1; change=1; break;
								default :  break;
							}

							if (timeout) if ((--timeout)==0) manualState=0; // kill the output after 8 hours of any kind of manual on
							if ((temporaryManual==1) || (permanentManual==1)) autoState=manualState; // if in permanent manual - OR temporary - use manualState instead of auto
							

							var duration = 0;
							var manov=""; 
							if (permanentManual==1) manov="Man. override. "; else if (temporaryManual==1) manov="Temp. override. ";
							if (node.suspend) manov+="No schedule.";
							
							if ((permanentManual==1) || (temporaryManual==1) || (node.suspend))
							{
								if (autoState==1) 
									node.status({
										fill : "green",
										shape : "dot",
										text : "ON "+manov
										});
									else
										node.status({
										fill : "red",
										shape : "dot",
										text : "OFF "+manov
										});
							}
							else // so not manual but auto....
								{
									if (goodDay==1) // auto and today's the day
									{
											if (autoState==1) 
											{  // i.e. if turning on automatically
												if (today <= actualEndTime)
													duration = actualEndTime - today;
												else
													duration = actualEndTime + (1440 - today);
													node.status({
													fill : "green",
													shape : "dot",
													text : "On for " + pad(parseInt(duration/60),2) + "hrs " + pad(duration%60,2) + "mins"
													});										
											} 
										else {
											if (today <= actualStartTime)
												duration = actualStartTime - today;
											else
												duration = actualStartTime + (1440 - today);
												node.status({
												fill : "blue",
												shape : "dot",
												text : "Off for "  + pad(parseInt(duration/60),2) + "hrs " + pad(duration%60,2) + "mins"
												});		
										}
									}
								else
								node.status({   // auto and nothing today thanks
											fill : "black",
											shape : "dot",
											text : "No action today"
										});	
								}

							outmsg.topic = node.outtopic;
						    outmsg2.payload = (autoState==1)? "1" : "0";			
	                        outtext.payload=node.outText1;
							if (autoState==1)
								{
									outmsg.payload = node.outPayload1;
									outtext.payload=node.outText1;								
								}
							else
								{
									outmsg.payload = node.outPayload2;
									outtext.payload=node.outText2;
								}	
						
							// take into account CHANGE variable - if true a manual or auto change is due
							
							if ((change) || ((node.atStart)&&(startDone==0)))
							{
								node.send([outmsg, outmsg2,outtext]);			
							}
							else
							{
								if (node.repeat) node.send([outmsg, outmsg2,null]);	else node.send([null, outmsg2,null]);
							}	
							startDone=1;
						});  // end of the internal function

		var tock = setTimeout(function() {
			node.emit("input", {});
		}, 2000); // wait 2 secs before starting to let things settle down -
					// e.g. UI connect

		var tick = setInterval(function() {
			node.emit("input", {});
		}, 60000); // trigger every 60 secs

		node.on("close", function() {
			if (tock) {
				clearTimeout(tock);
			}
			if (tick) {
				clearInterval(tick);
			}
		});

	}
	RED.nodes.registerType("bigtimer", bigTimerNode);
}
