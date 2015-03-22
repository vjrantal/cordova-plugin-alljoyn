$cn = [ADSI]"WinNT://$env:ComputerName"
$user = $cn.Create("User","temp-user")
$user.SetPassword("MyPassword1")
$user.SetInfo()
$user.description = "Temp User"
$user.SetInfo()
