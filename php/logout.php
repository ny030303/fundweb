<?php
  require("db.php");

  unset($_SESSION['loginUser']);
  session_destroy();
  echo "
    <script>
        window.location.href='/';
    </script>
  ";
?>