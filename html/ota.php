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
          <div class="card col-lg-9" style="padding: 3px; text-align: center;">
            <h5 class="card-header">
                <i class="fas fa-microchip"></i> Firmware Update
            </h5>
            <div class="card-body" style="padding: 10px; text-align: center">
              <div class="containter">
                <div class="row" style="margin: auto; text-align: center;">
                  <div class="col-lg-12">
                  <form method="post" enctype="multipart/form-data">
                    Select file to upload:
                    <input type="file" name="fileToUpload" id="fileToUpload">
                    <input id="sub" type="button" value="Upload" >
                    <label id="phpResponse">
                    
                    </label>
                  </form>
                </div><!-- col -lg -12 -->
                </div>
                <div  class="row" style="padding-top: 30px; margin: auto; text-align: center">
                  <div class="col-lg-12" style="margin: auto; text-align: center"> 
                    <label id="label"> Please fill in the login form to connect to the MQTT broker </label>
                    <div id="commandSend"> <strong> Microcontroller: </strong><input id="esp" type="text">
                    <button class="submit" id="send" type="button" style="margin: auto; text-align: center"> Send</button> </div>
                  </div>
                  
                </div> <!-- send notification to microcontroller -->
              </div> <!-- container -->
                
                
              </div> <!-- card-body -->
          </div>
          

    		</div> <!--row-->

          <br>

        <div class="container">
          <div class="row">
            <div class="col-lg-10" style="margin: auto; text-align: center">
          

          <!--Filtros-->
          <div class="card my-4 ">
            <h5 class="card-header">
              <i class="fas fa-bell"></i> Update info
            </h5>
            <ul style="list-style: none; padding: 4px; margin: auto;" id="notifications">
              
            </ul>
              
              
              
          </div> <!-- card-my-4 -->
            

      </div> <!--col-lg-10 -->
             
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
 <script type = "text/javascript" src="js/ota.js"> </script>

</body>

</html>