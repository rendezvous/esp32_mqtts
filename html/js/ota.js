	var connected_flag=0	
  var uploaded = 0;
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
  var microcontroller;

$('#commandSend').hide();

	function onConnectionLost(){
		console.log("connection lost");
		document.getElementById("status").innerHTML = '<i class="far fa-circle"></i> Connection Lost';
		connected_flag=0;
	}

	function onFailure(message) {
    connected_flag = 0;
		console.log("Failed");
        setTimeout(MQTTconnect, reconnectTimeout);
   	}

	function onMessageArrived(r_message){
		
		if(r_message.destinationName == "ota/apache/cli_0"){
        var value;
        var message;
        switch(r_message.payloadString){
          case "-4":
            value:'<i class="fas fa-times" style="color: red"></i> ';
            message = "Sorry, there was an error downloading the file from the server."
            break;
          case "-3":
            value:'<i class="fas fa-times" style="color: red"></i> ';
            message = "Sorry, there was an error mounting the file system."
            break;
          case "-2":
            value:'<i class="fas fa-times" style="color: red"></i> ';
            message = "Sorry, there was an error opening the downloaded file."
            break;
          case "-1":
            value:'<i class="fas fa-times" style="color: red"></i> ';
            message = "Sorry, there was an error setting up the update."
            break;
          case "0":
            value:'<i class="fas fa-times" style="color: red"></i> ';
            message = "Sorry, there was an error during the update."
            break;
          case "1":
            value = '<i class="fas fa-check" style="color: green"></i> ';
            message = "Microcontroller " + microcontroller + " has updated its firmware succesfully."
            var path = "ota/firmware.ino.esp32.bin";  
                $.ajax({  //remove file from server when the esp32 has downloaded it succesfully
                     url:"delete.php",  
                     type:"POST",  
                     data:{path:path},  
                     success:function(data){  
                           
                     }  
                });  
            break;
        }
        $("#notifications").append('<div class="card"> <li class="element">' + value + message + ' </li></div>');

      
    }
	}

	function onConnected(recon,url){
		console.log(" in onConnected " +reconn);
    connected_flag=1;
	}


	function onConnect() {
		connected_flag=1;
		document.getElementById("status").innerHTML = '<i class="fas fa-wifi"></i> Connected';
		console.log("on Connect "+connected_flag);
		sub_topics();
    if(uploaded == 0) $('#label').html('Upload your file first in the form above');
		if(uploaded == 1) {
      $('#label').html('');
      $('#commandSend').show();
    }
	}

    function MQTTconnect(id) {
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
		mqtt = new Paho.MQTT.Client(host,port,id);//id antes
		//mqtt = new Paho.Client("wss://192.168.1.40:9873/mqtt",id);
		//document.write("connecting to "+ host);
		var options = {
        	timeout: 3,
        	useSSL: true,
        	//cleanSession: false,
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
			mqtt.subscribe("ota/apache/cli_0");

		} else if(user == "client"){
			
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





$(document).ready(function() { 
				  var topic;
    			
    			

                $( "#send" ).click(function(e) {
                	e.preventDefault();
                	var date = new Date();
                	
                	message = new Paho.MQTT.Message("1");
                  microcontroller = $("#esp").val();
    				//message.destinationName = $("#level").val();
    				//message.retained = true;
    				//message.qos = 2; //excatamente una vez

    				if(user == "admin"){
    					message.destinationName = "ota/com/cli_" + microcontroller;
    				} 
    				
    				console.log(message.destinationName);
    				//console.log($("#level").val());
					mqtt.send(message); 
                });

              $('#sub').on('click', function() {
                var file_data = $('#fileToUpload').prop('files')[0];   
                var form_data = new FormData();                  
                form_data.append('fileToUpload', file_data);
                                            
                $.ajax({
                  url: 'upload.php', // point to server-side PHP script 
                  dataType: 'text',  // what to expect back from the PHP script, if anything
                  cache: false,
                  contentType: false,
                  processData: false,
                  data: form_data,                         
                  type: 'post',
                  success: function(php_script_response){
                    
                    //$('#phpResponse').html(php_script_response);
                    if(php_script_response.includes("web server")){
                      uploaded = 1
                      $("#notifications").append('<div class="card"> <i class="fas fa-check" style="color: green"></i>' + ' ' + php_script_response + ' </li></div>');
                      if(connected_flag == 1){
                        $('#label').html('');
                        $('#commandSend').show();
                      } 
                    } else {
                      $("#notifications").append('<div class="card"> <i class="fas fa-times" style="color: red"></i>' + ' ' + php_script_response + ' </li></div>');
                    }
                    

                  }
                });
              });
});

             /* $("#fileUp").on('submit', function(e) {
    console.log('Form submission captured. It is triggered by: ', document.activeElement);
    e.preventDefault();
  });*/



	



