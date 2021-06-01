$password =ConvertTo-SecureString -string $args[0] -AsPlainText -Force 
$password = ConvertFrom-SecureString -SecureString $password -key (Get-Content .\Powershell\aes.key)
return $password
