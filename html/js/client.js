	var connected_flag=0	
	var mqtt;
    var reconnectTimeout = 2000;
	var host="192.168.1.40";
	var port=9873;
	
	var radiation_value;
	var temperature_value;
	var humidity_value;
	var fluidtemp_value;
	var user;
	var pass;

	

	function onConnectionLost(){
		console.log("connection lost");
		document.getElementById("status").innerHTML = '<i class="far fa-circle"></i> Connection Lost';
		connected_flag=0;
	}

	function onFailure(message) {
		connected_flag=0;
		console.log("Failed");
        setTimeout(MQTTconnect, reconnectTimeout);
   	}

	function onMessageArrived(r_message){
		if(r_message.destinationName == "esp32/rad"){
			radiation_value=r_message.payloadString;
			
		}
		if(r_message.destinationName == "esp32/temp"){
			temperature_value=r_message.payloadString;
			
		}
		if(r_message.destinationName == "esp32/hum"){
			humidity_value=r_message.payloadString;
			
		}
		if(r_message.destinationName == "esp32/ftemp"){
			fluidtemp_value=r_message.payloadString;
			
		}

		/*if(r_message.destinationName == "inc/#"){
			$("#notifications").append('<li class="element"> ' + r_message.payloadString + ' </li>');
			
		}
		if(r_message.destinationName == "not/#"){
			$("#notifications").append('<li class="element"> ' + r_message.payloadString + ' </li>');
			
		}*/


		if(r_message.destinationName.includes("inc/")){
			if(r_message.destinationName.includes("/critical")){
				$("#notifications").append('<div class="card"> <li class="element"> <i class="fas fa-exclamation-triangle" style="color: red"></i>' + ' ' + r_message.payloadString + ' </li></div>');
			} else if(r_message.destinationName.includes("/high")){
				$("#notifications").append('<div class="card"> <li class="element"> <i class="fas fa-exclamation" style="color: orange"></i>' + ' ' + r_message.payloadString + ' </li></div>');
			} else if(r_message.destinationName.includes("/medium")){
				$("#notifications").append('<div class="card"> <li class="element"> <i class="fas fa-flag" style="color: yellow"></i>' + ' ' + r_message.payloadString + ' </li></div>');
			} else if(r_message.destinationName.includes("/low")){
				$("#notifications").append('<div class="card"> <li class="element"> <i class="far fa-comment-alt" style="color: green"></i>' + ' ' + r_message.payloadString + ' </li></div>');
			}
			/*console.log("INCIDENCIA PARA ADMIN");
			$("#notifications").append('<div class="card"> <li class="element"> ' + r_message.payloadString + ' </li></div>');*/
			
		}
		if(r_message.destinationName.includes("notf/")){
			if(r_message.destinationName.includes("/critical")){
				$("#notifications").append('<div class="card"> <li class="element"> <i class="fas fa-exclamation-triangle" style="color: red"></i>' + ' ' + r_message.payloadString + ' </li></div>');
			} else if(r_message.destinationName.includes("/high")){
				$("#notifications").append('<div class="card"> <li class="element"> <i class="fas fa-exclamation" style="color: orange"></i>' + ' ' + r_message.payloadString + ' </li></div>');
			} else if(r_message.destinationName.includes("/medium")){
				$("#notifications").append('<div class="card"> <li class="element"> <i class="fas fa-flag" style="color: yellow"></i>' + ' ' + r_message.payloadString + ' </li></div>');
			} else if(r_message.destinationName.includes("/low")){
				$("#notifications").append('<div class="card"> <li class="element"> <i class="far fa-comment-alt" style="color: green"></i>' + ' ' + r_message.payloadString + ' </li></div>');
			}
			/*console.log("NOTIFICAC PARA CLIENT");
			$("#notifications").append('<div class="card"> <li class="element"> ' + r_message.payloadString + ' </li></div>');*/
			
		}
		
	}

	function onConnected(recon,url){
		console.log(" in onConnected " +reconn);
		connected_flag = 1;
		//document.getElementById("status").innerHTML = '<i class="fas fa-wifi"></i> Connected';
	}

	function onConnect() {
		connected_flag=1;
		document.getElementById("status").innerHTML = '<i class="fas fa-wifi"></i> Connected';
		console.log("on Connect "+connected_flag);
		sub_topics();
		$('#izq').show();
		if(user == 'client'){
			$('#power').hide();
			$('#alarm').hide();
			$('#command').hide();
		} else{
			$('#power').show();
			$('#alarm').show();
			$('#command').show();
		}
		startRadiationChart();
		startTemperatureChart();
		startHumidityChart();
		startFluidTempChart();
		startRadiationGauge();
		startTemperatureGauge();
		startHumidityGauge();
		startFluidTempGauge();
	}

    function MQTTconnect(id) {
    	$('#notifications').html('');
    	console.log(id);
		user = document.getElementById("user").value;
		console.log(user);
		pass = document.getElementById("pass").value;
		/*if (p!="")
		{
			console.log("ports");
			port=parseInt(p);
			console.log("port" +port);
		}
		if (s!="")
		{
			//host=s;
			console.log("host");
		}*/


		console.log("connecting to "+ host +" "+ port);
		mqtt = new Paho.MQTT.Client(host,port,user);//id antes
		//mqtt = new Paho.Client("wss://192.168.1.40:9873/mqtt",id);
		//document.write("connecting to "+ host);
		var options = {
        	timeout: 3,
        	useSSL: true,
        	cleanSession: false,
        	userName: user,
        	password: pass,
			onSuccess: onConnect,
			onFailure: onFailure,
      
     	};
	
        mqtt.onConnectionLost = onConnectionLost;
        mqtt.onMessageArrived = onMessageArrived;
		mqtt.onConnected = onConnected;

		mqtt.connect(options);
		
		

		return false;
  
 
	}

	function sub_topics(){
		if(user == "admin"){
			console.log("ADMIN");
			mqtt.unsubscribe("notf/#");
			mqtt.subscribe("esp32/rad");
			mqtt.subscribe("esp32/temp");
			mqtt.subscribe("esp32/hum");
			mqtt.subscribe("esp32/ftemp");
			mqtt.subscribe("inc/low", {qos: 1}); //qos to receive undelivered messages
			mqtt.subscribe("inc/medium", {qos: 1});
			mqtt.subscribe("inc/high", {qos: 1});
			mqtt.subscribe("inc/critical", {qos: 1});
		} else if(user == "client"){
			console.log("CLIENT");
			mqtt.unsubscribe("inc/#");
			mqtt.subscribe("esp32/rad");
			mqtt.subscribe("esp32/temp");
			mqtt.subscribe("esp32/hum");
			mqtt.subscribe("esp32/ftemp");
			mqtt.subscribe("notf/low", {qos: 1});
			mqtt.subscribe("notf/medium", {qos: 1});
			mqtt.subscribe("notf/high", {qos: 1});
			mqtt.subscribe("notf/critical", {qos: 1});
		}
		
		
		/*mqtt.subscribe("inc/low");
		mqtt.subscribe("inc/medium");
		mqtt.subscribe("inc/high");
		mqtt.subscribe("inc/critical");
		mqtt.subscribe("notf/low");
		mqtt.subscribe("notf/medium");
		mqtt.subscribe("notf/high");
		mqtt.subscribe("notf/critical");*/
		
		return false;
		
	}


	/*function send_message(){
		document.getElementById("messages").innerHTML ="";
		if (connected_flag==0){
			out_msg="<b>Not Connected so can't send</b>"
			console.log(out_msg);
			document.getElementById("messages").innerHTML = out_msg;
			return false;
		}
		var msg = document.forms["smessage"]["message"].value;
		console.log(msg);

		var topic = document.forms["smessage"]["Ptopic"].value;
		message = new Paho.MQTT.Message(msg);
		if (topic=="")
			message.destinationName = "test-topic"
		else
			message.destinationName = topic;
		mqtt.send(message);
		return false;
	}*/

function startRadiationChart(){
	var chartRad = new Highcharts.Chart({
  chart:{ renderTo : 'radiation_chart' },
  title: { text: 'Irradiation' },
  series: [{
    showInLegend: false,
    data: []
  }],
  plotOptions: {
    line: { animation: false,
      dataLabels: { enabled: true }
    },
    series: { color: '#059e8a' }
  },
  xAxis: { type: 'datetime',
    dateTimeLabelFormats: { second: '%H:%M:%S' }
  },
  yAxis: {
    title: { text: 'Irradiaton (W/m2)' }
  },
  credits: { enabled: false }
});

 setInterval(function () {
        var chartRad = $('#radiation_chart').highcharts();
        if (typeof chartRad === 'undefined') {
            return;
        }
		var x = (new Date()).getTime(),
          y = Number(radiation_value);
      //console.log(this.responseText);
      if(chartRad.series[0].data.length > 40) {
        chartRad.series[0].addPoint([x, y], true, true, true);
      } else {
        chartRad.series[0].addPoint([x, y], true, false, true);
      }
    }, 900);	
}

function startTemperatureChart(){
	var chartTemp = new Highcharts.Chart({
  chart:{ renderTo : 'temperature_chart' },
  title: { text: 'Temperature' },
  series: [{
    showInLegend: false,
    data: []
  }],
  plotOptions: {
    line: { animation: false,
      dataLabels: { enabled: true }
    },
    series: { color: '#059e8a' }
  },
  xAxis: { type: 'datetime',
    dateTimeLabelFormats: { second: '%H:%M:%S' }
  },
  yAxis: {
    title: { text: 'Temperature (ºC)' }
  },
  credits: { enabled: false }
});

 setInterval(function () {
        var chartTemp = $('#temperature_chart').highcharts();
        if (typeof chartTemp === 'undefined') {
            return;
        }
		var x = (new Date()).getTime(),
          y = Number(temperature_value);
      //console.log(this.responseText);
      if(chartTemp.series[0].data.length > 40) {
        chartTemp.series[0].addPoint([x, y], true, true, true);
      } else {
        chartTemp.series[0].addPoint([x, y], true, false, true);
      }
    }, 800);	
}

function startHumidityChart(){
	var chartHum = new Highcharts.Chart({
  chart:{ renderTo : 'humidity_chart' },
  title: { text: 'Humidity' },
  series: [{
    showInLegend: false,
    data: []
  }],
  plotOptions: {
    line: { animation: false,
      dataLabels: { enabled: true }
    },
    series: { color: '#059e8a' }
  },
  xAxis: { type: 'datetime',
    dateTimeLabelFormats: { second: '%H:%M:%S' }
  },
  yAxis: {
    title: { text: 'Humidity (%)' }
  },
  credits: { enabled: false }
});

 setInterval(function () {
        var chartHum = $('#humidity_chart').highcharts();
        if (typeof chartHum === 'undefined') {
            return;
        }
		var x = (new Date()).getTime(),
          y = Number(humidity_value);
      //console.log(this.responseText);
      if(chartHum.series[0].data.length > 40) {
        chartHum.series[0].addPoint([x, y], true, true, true);
      } else {
        chartHum.series[0].addPoint([x, y], true, false, true);
      }
    }, 600);	
}

function startFluidTempChart(){
	var chartFluidTemp = new Highcharts.Chart({
  chart:{ renderTo : 'fluidtemp_chart' },
  title: { text: 'Fluid Temperature' },
  series: [{
    showInLegend: false,
    data: []
  }],
  plotOptions: {
    line: { animation: false,
      dataLabels: { enabled: true }
    },
    series: { color: '#059e8a' }
  },
  xAxis: { type: 'datetime',
    dateTimeLabelFormats: { second: '%H:%M:%S' }
  },
  yAxis: {
    title: { text: 'Fluid Temperature (ºC)' }
  },
  credits: { enabled: false }
});

 setInterval(function () {
        var chartFluidTemp = $('#fluidtemp_chart').highcharts();
        if (typeof chartFluidTemp === 'undefined') {
            return;
        }
		var x = (new Date()).getTime(),
          y = Number(fluidtemp_value);
      //console.log(this.responseText);
      if(chartFluidTemp.series[0].data.length > 40) {
        chartFluidTemp.series[0].addPoint([x, y], true, true, true);
      } else {
        chartFluidTemp.series[0].addPoint([x, y], true, false, true);
      }
    }, 1000);	
}



var gaugeOptions = {
    chart: {
        type: 'solidgauge'
    },

    title: null,

    pane: {
        center: ['50%', '85%'],
        size: '130%',
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
        }
    },

    exporting: {
        enabled: false
    },

    tooltip: {
        enabled: false
    },

    // the value axis
    yAxis: {
        stops: [
            [0.1, '#55BF3B'], // green
            [0.5, '#DDDF0D'], // yellow
            [0.9, '#DF5353'] // red
        ],
        lineWidth: 0,
        tickWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
            y: -70
        },
        labels: {
            y: 16
        }
    },

    plotOptions: {
        solidgauge: {
            dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
            }
        }
    }
};


function startRadiationGauge(){

		// The radiation gauge
var chartRadiation = Highcharts.chart('container-radiation', Highcharts.merge(gaugeOptions, {
    yAxis: {
        min: 0,
        max: 800,
        title: {
            text: 'Irradiation'
        }
    },

    credits: {
        enabled: false
    },

    series: [{
        name: 'Irradiation',
        data: [0],
        dataLabels: {
            format:
                '<div style="text-align:center">' +
                '<span style="font-size:25px">{y}</span><br/>' +
                '<span style="font-size:12px;opacity:0.4">W/m2</span>' +
                '</div>'
        },
        tooltip: {
            valueSuffix: ' W/m2'
        }
    }]

}));

setInterval(function () {
    // Speed
    var point,
        newVal,
        inc;

    if (chartRadiation) {
        point = chartRadiation.series[0].points[0];
        

        point.update(Number(radiation_value));
    }
}, 2000);
}

function startTemperatureGauge(){

var chartTemperature = Highcharts.chart('container-temperature', Highcharts.merge(gaugeOptions, {
    yAxis: {
        min: -5,
        max: 45,
        title: {
            text: 'Temperature'
        }
    },

    credits: {
        enabled: false
    },

    series: [{
        name: 'Temperature',
        data: [0],
        dataLabels: {
            format:
                '<div style="text-align:center">' +
                '<span style="font-size:25px">{y}</span><br/>' +
                '<span style="font-size:12px;opacity:0.4">ºC</span>' +
                '</div>'
        },
        tooltip: {
            valueSuffix: ' ºC'
        }
    }]

}));

setInterval(function () {
    // Speed
    var point,
        newVal,
        inc;

    if (chartTemperature) {
        point = chartTemperature.series[0].points[0];
        

        point.update(Number(temperature_value));
    }
}, 2000);
}

function startHumidityGauge(){

var chartHumidity = Highcharts.chart('container-humidity', Highcharts.merge(gaugeOptions, {
    yAxis: {
        min: 0,
        max: 100,
        title: {
            text: 'Humidity'
        }
    },

    credits: {
        enabled: false
    },

    series: [{
        name: 'Humidity',
        data: [0],
        dataLabels: {
            format:
                '<div style="text-align:center">' +
                '<span style="font-size:25px">{y}</span><br/>' +
                '<span style="font-size:12px;opacity:0.4">%</span>' +
                '</div>'
        },
        tooltip: {
            valueSuffix: ' %'
        }
    }]

}));

setInterval(function () {
    // Speed
    var point,
        newVal,
        inc;

    if (chartHumidity) {
        point = chartHumidity.series[0].points[0];
        

        point.update(Number(humidity_value));
    }
}, 2000);
}

function startFluidTempGauge(){

var chartFluidTemp = Highcharts.chart('container-fluidtemp', Highcharts.merge(gaugeOptions, {
    yAxis: {
        min: 0,
        max: 100,
        title: {
            text: 'Fluid Temperature'
        }
    },

    credits: {
        enabled: false
    },

    series: [{
        name: 'Fluid Temperature',
        data: [0],
        dataLabels: {
            format:
                '<div style="text-align:center">' +
                '<span style="font-size:25px">{y}</span><br/>' +
                '<span style="font-size:12px;opacity:0.4">ºC</span>' +
                '</div>'
        },
        tooltip: {
            valueSuffix: ' ºC'
        }
    }]

}));

setInterval(function () {
    // Speed
    var point,
        newVal,
        inc;

    if (chartFluidTemp) {
        point = chartFluidTemp.series[0].points[0];
        

        point.update(Number(fluidtemp_value));
    }
}, 2000);
}


$(document).ready(function() { 
	$('#izq').hide();

					$('.toggle').prop('checked', false).change();
				$('#main_lights').change(function() {
      				if($(this).prop('checked') == true){
      					message = new Paho.MQTT.Message("1");
    					message.destinationName = "esp32/led";
						mqtt.send(message);
      				}else{
      					message = new Paho.MQTT.Message("0");
    					message.destinationName = "esp32/led";
						mqtt.send(message);
      				}
    			})
    			$('#sec_lights').change(function() {
      				if($(this).prop('checked') == true){
      					message = new Paho.MQTT.Message("1");
    					message.destinationName = "esp32/sec";
						mqtt.send(message);
      				}else{
      					message = new Paho.MQTT.Message("0");
    					message.destinationName = "esp32/sec";
						mqtt.send(message);
      				}
    			})
                
    			var topic;
    			
    			$( '.lvl' ).click(function(e) {
                	e.preventDefault();
                	console.log($(this).text());
                	$("#lvl").html($(this).text());
                	topic = $(this).text();
                });

                $( "#send" ).click(function(e) {
                	e.preventDefault();
                	var date = new Date();
                	console.log("click");
                	//topic = $( "#my_select option:selected" ).text();
                	var hour = date.getHours();
                	var minutes = date.getMinutes();
                	var seconds = date.getSeconds();
                	
                	if(Number(hour)<10) hour="0"+hour;
                	if(Number(minutes)<10) minutes="0"+minutes;
                	if(Number(seconds)<10) seconds="0"+seconds;

                	var time_now = "[" + hour + ":" + minutes + ":" + seconds + " "
                				+ date.getDate() + '-' + (Number(date.getMonth())+1) +'-'+ date.getFullYear() +"]";
                	message = new Paho.MQTT.Message(time_now + ' ' + $("#notif").val());
					console.log($("#notif").val());
    				//message.destinationName = $("#level").val();
    				//message.retained = true;
    				message.qos = 1; //at least once

    				if(user == "admin"){
    					message.destinationName = "notf/" + topic.toLowerCase();
    				} else if(user == "client"){
    					message.destinationName = "inc/" + topic.toLowerCase();
    				}
    				
    				console.log(message.destinationName);
    				//console.log($("#level").val());
					mqtt.send(message); 
					$("#notif").val('');
					$("#lvl").html('');
                });
            }); 


	



