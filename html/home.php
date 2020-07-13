<?php


// We need to use sessions, so you should always start sessions using the below code.
session_start();
// If the user is not logged in redirect to the login page...
if (!isset($_SESSION['loggedin'])) {
	header('Location: index.html');
	exit;
}
?>

<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">

  <title>MQTT Client</title>

  <script type = "text/javascript" src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
  <!-- Bootstrap core CSS -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">

  <!-- Custom styles for this template -->
  <link href="home.css" rel="stylesheet">

  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css">

 <script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.js" type="text/javascript"></script> 
   <!--<script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.1.0/paho-mqtt.js" type="text/javascript"></script> -->
  
 
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
  <link href="https://cdn.jsdelivr.net/gh/gitbrent/bootstrap4-toggle@3.6.1/css/bootstrap4-toggle.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/gh/gitbrent/bootstrap4-toggle@3.6.1/js/bootstrap4-toggle.min.js"></script> 
  
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
  <!--highcharts-->

<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/highcharts-more.js"></script>
<script src="https://code.highcharts.com/modules/solid-gauge.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>
<script src="https://code.highcharts.com/modules/accessibility.js"></script>

</head>

<body>


  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <a class="navbar-brand" href="home.php">Home <span class="sr-only">(current)</span></a>
        </li>

        <?php

          
          if ($_SESSION['name'] == "test") {
            echo '<li class="nav-item">
              <a class="nav-link" href="ota.php">Firmware Update</a>
            </li>';
          }
        ?>
        
        
        
      </ul>
      
    </div>
  </nav>

    <!-- Page Content -->
   
<br><br><br>
      

      <div class="container">

        <div class="row">
         
          <div class="card col-lg-3" style="padding: 3px">
            <h5 class="card-header" id="status">
              <i class="far fa-circle"></i> Not Connected
            </h5>
      		  <form onsubmit="return MQTTconnect('<?php echo session_id(); ?>')" style="padding: 3px">
      			 Username: <input id="user" type="text" name="username"><br><br>
      			 Password:   <input id="pass" type="password" name="password"><br><br>
      		    <input class="submit" type="submit" value="Connect">
    		    </form>
          </div>
          <div class="card col-lg-5" style="padding: 3px">
            <h5 class="card-header">
              <i class="fas fa-bell"></i> New incidents
            </h5>
            <ul style="list-style: none; padding: 4px;" id="notifications">
              
            </ul>
          </div>
          <div class="card col-lg-4" style="padding: 3px">
            
            <h5 class="card-header">
              <i class="fas fa-comment-dots"></i> Send
            </h5>
            <div style="padding: 3px">
             <strong> Notification: </strong><input id="notif" type="text"><br><br>
            <div style="margin: auto; text-align: center" >
              <button type="button" class="btn lvl" style="background-color: green; color: white">Low</button>
              <button type="button" class="btn lvl" style="background-color: yellow">Medium</button>
              <button type="button" class="btn lvl" style="background-color: orange">High</button>
              <button type="button" class="btn lvl" style="background-color: red; ">Critical</button>
              
            </div>

            <br>
            <div class="container"> 
              <div class="row">
                
                  <label> <strong> Level: </strong></label>
                
                
                  <label id="lvl" style="padding-left: 8px"></label>
                
              </div>
            </div>
           
            
            <br>
              <div style="margin: auto; text-align: center"> 
                <button class="submit" id="send" type="button" style="margin: auto; text-align: center"> Send</button> 
              </div>
            </div>
          </div>

    		</div> <!--row-->

          <br>

        <div class="container">
          <div class="row">
            <div id="izq" class="col-lg-3">
          

          <!--Filtros-->
          <div class="card my-4 ">
            
              <!--<script src="./javascript/search-filters.js"></script> -->
              <h5 class="card-header">
                
              </h5>
              <div id="switches" class="card-body" style="padding: 10px">
                <ul class="list-group">
                  <li id ="lights" class="list-group-item" style="padding: 10px">
                    <h5>Lights</h5>
                    <div  class="card-body" style="padding-top: 0px; padding-bottom: 0px;">
                      <form>
                        <input class="toggle" id="main_lights" type="checkbox" checked data-toggle="toggle" data-onstyle="dark"> Main </input>
                        
                       </form>
                      
                    </div>
                    <br>
                    <div class="card-body" style="padding-top: 0px; padding-bottom: 0px;">
                      <form>
                        <input class="toggle" id="sec_lights" checked data-toggle="toggle" data-onstyle="dark" type="checkbox"> Secondary </input>                       
                       </form>
                      
                    </div>
                    
                  </li>
                  <li id ="power" class="list-group-item" style="padding: 10px">
                    <h5>Power</h5>
                    <div class="card-body" style="padding-top: 0px; padding-bottom: 0px;">
                      <form>
                        <input class="toggle" id="battery" type="checkbox" checked data-toggle="toggle" data-onstyle="dark"> UPS Mode </input>
                        
                       </form>
                      
                    </div>
                    <br>
                    <div class="card-body" style="padding-top: 0px; padding-bottom: 0px;">
                      <form>
                        <input class="toggle" id="disconnect" checked data-toggle="toggle" data-onstyle="dark" type="checkbox"> Disconnect </input>                        
                       </form>
                      
                    </div>
                    
                  </li>
                  <li id ="alarm" class="list-group-item" style="padding: 10px">
                    <h5>Alarm</h5>
                    <div class="card-body" style="padding-top: 0px; padding-bottom: 0px;">
                      <form>
                        <input class="toggle" id="alarm" type="checkbox" checked data-toggle="toggle" data-onstyle="dark"> Alarm </input>
                        
                      </form>
                      
                    </div>
                   
                    
                  </li>

                  <li id ="command" class="list-group-item" style="padding: 10px">
                    <h5>Command</h5>
                    <div  class="card-body" style="padding-top: 0px; padding-bottom: 0px;">
                      <form>
                        <input class="toggle" id="go_home" type="checkbox" checked data-toggle="toggle" data-onstyle="dark"> Go home </input>
                        
                       </form>
                      
                    </div>
                    <br>
                    <div class="card-body" style="padding-top: 0px; padding-bottom: 0px;">
                      <form>
                        <input class="toggle" id="manual" checked data-toggle="toggle" data-onstyle="dark" type="checkbox"> Manual mode </input>                      
                       </form>
                      
                    </div>
                    
                  </li>
                  
                </ul>
              </div> <!-- card-body -->
          </div> <!-- card-my-4 -->
            

      </div> <!--col-lg-3 -->
            <div class="col-lg-9">
    		      <div class="row">
    			     <div id="radiation_chart" class="col-lg-8"> </div><div id="container-radiation" class="chart-container col-lg-4"></div>
    		      </div>

    		      <div class="row">
    			     <div id="temperature_chart" class="col-lg-8"> </div> <div id="container-temperature" class="chart-container col-lg-4"> </div>
    		      </div>

              <div class="row">
                <div id="humidity_chart" class="col-lg-8"> </div> <div id="container-humidity" class="chart-container col-lg-4"> </div>
              </div>

              <div class="row">
                <div id="fluidtemp_chart" class="col-lg-8"> </div> <div id="container-fluidtemp" class="chart-container col-lg-4"> </div>
              </div>  
            </div> 
          </div>
        </div>
    
    


  </div> <!--row-->
    </div>


   


     
   
    <!-- /#page-content-wrapper -->


  <!-- /#wrapper -->

  

  <!-- Menu Toggle Script -->
  <script>
    $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });
  </script>

  <!--<script type = "text/javascript" src="js/radiation_chart.js"> </script>-->
 <script type = "text/javascript" src="js/client.js"> </script>

</body>

</html>