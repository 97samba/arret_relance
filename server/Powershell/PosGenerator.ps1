$json = Get-Content .\json\ares.json | ConvertFrom-Json
$json.name
$json.auteur
$json.date_de_creation
$json.Arret | where {$_.type -eq "lien"} | Select-Object url