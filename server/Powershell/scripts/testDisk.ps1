$PSEXEC = .\$PSEXEC





############### Main ##############
write-host Recherche des disques du serveur $args[0]
return (Get-PSDrive).name

