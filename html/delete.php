 <?php  

session_start();
if (!isset($_SESSION['loggedin'])) {
  header('Location: index.html');
  exit;
}
 //delete.php  
 if(!empty($_POST["path"]))  
 {  
      if(unlink($_POST["path"]))  
      {  
           echo 'Image Deleted';  
      }  
 }  
 ?> 