<?php  

session_start();
if (!isset($_SESSION['loggedin'])) {
  header('Location: index.html');
  exit;
}
                      
                        $target_dir = "ota/";
                        $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
                        $uploadOk = 1;
                        $fileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
                        
                        // Check file size
                        if ($_FILES["fileToUpload"]["size"] > 500000000) {
                          echo "Sorry, your file is too large.";
                          $uploadOk = 0;
                        }
                        // Allow certain file formats
                        if($fileType != "bin") {
                          echo "Sorry, only binary files are allowed.";
                          $uploadOk = 0;
                        }
                        // Check if $uploadOk is set to 0 by an error
                        if ($uploadOk == 0) {
                          echo "Sorry, your file was not uploaded.";
                        // if everything is ok, try to upload file
                        } else {
                          if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
                            echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded to the web server.";
                          } else {
                            echo "Sorry, there was an error uploading your file.";
                          }
                        } 
                      
?> 