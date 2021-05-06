$json = Get-Content .\json\ares.json | ConvertFrom-Json
$json.name
$json.auteur
$json.date_de_creation

$inf = $json.Arret | where {$_.type -eq "webAction"} | Select-Object informations

#$json.Arret | ForEach-Object { write-host "information of" $_.index "is "`n ; $_.informations}

function visitUrl($url){

    $mdp = Get-Content .\password.txt | ConvertTo-SecureString -key (Get-Content .\aes.key)
    

    $pscred = New-Object System.Management.Automation.PSCredential("test@gmail.com",$mdp)
    
    $chromeDriver = Start-SeChrome -StartURL "https://linkedin.com" -Maximized 

     

    $mail = Find-SeElement -Driver $chromeDriver -Id "session_key"
    
    Send-SeKeys -Element $mail -Keys $pscred.UserName

    $password = Find-SeElement -Driver $chromeDriver -id "session_password"

    Send-SeKeys -Element $password -Keys $pscred.GetNetworkCredential().Password
    
    $submit = Find-SeElement -Driver $chromeDriver -Css "#main-content > section.section.section--hero > div.sign-in-form-container > form > button"
    
    
    #Invoke-SeClick -Element $submit

    #faire une capture d'ecran
    

}

visitUrl -url $url
