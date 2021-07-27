<#
    Programme qui execute les Etapes pos suivant une plage donnée, si on cette derniere n'est pas renseignée toute la POS est executée
    Arguments : 
        * fichier Json du ssa
        * debut le debut de la plage d'étape à executer dans la POS
        * Fin laa fin de la plage d'étape à executer dans la POS

    exemple 1: .\POSExcutor.ps1 .\Json\APPXXX_test.json
    ici toutes les actions de la POS sont exécutées
    
    exemple 2: .\POSExcutor.ps1 .\Json\APPXXX_test.json 1 3
    ici seules les étapes de 1 à 3 sont exécutées
#>


############## Variables  ###################
$CURRENT_URL = ""
$json = get-content $args[0] | ConvertFrom-Json
$start=0
$end= $json.POS.length

if($args[1]){
    $start=$args[1]
}
if($args[2]){
    $end=$args[2]
}

#Fonction de présentation
function describe-ssa(){
    
    "`nApplication : "+$json.name
    "Auteur : "+$json.auteur
    "Date de création "+$json.date_de_creation

    write-host "Execution des étapes de $start à $end`n"
}
#Décrypte un mot de passe
function convert-password($password, $login) {

    $mdp = $password | ConvertTo-SecureString -key (Get-Content .\aes.key)
    

    $pscred = New-Object System.Management.Automation.PSCredential($login, $mdp)
    
    return $pscred.GetNetworkCredential().Password
    
}

#renvoit un driver Chrome | Firefox | Edge
function get-driver($navigator) {
    
    if ($navigator -eq "Chrome") {
        $driver = Start-SeChrome -ImplicitWait 5
        
        return $driver
    }
    if ($navigator -eq "Firefox") {
        return Start-SeFirefox
    }
    if ($navigator -eq "Edge") {
        return Start-SeEdge 
    }
    if ($null -eq $navigator) {
        return $null
    }

}

#Visite une url
function Url($url, $driver) {
    if ($url -ne $CURRENT_URL) {
        #Entre que quand c'est un url diferrent 
        Enter-SeUrl -Url $url -Target $driver
        write-host Lien different $url current $CURRENT_URL`n
    }

    Start-Sleep -s 2
}

#Fait un click sur un element
function click-element($driver, $url, $informations) {
    
    if ($url -ne $CURRENT_URL) {

        write-host Lien different $url current $CURRENT_URL`n
        Enter-SeUrl -Url $url -Target $driver

    }
    write-host $informations.clickSelector`n       
    $clickELement = Find-SeElement -Target $driver -By CssSelector $informations.clickSelector    
    
    write-host "Element found : $clickElement"`n  
    send-SeClick -Element $clickELement -SleepSeconds 2
     

}

# fonction pour l'authentification
function init-connection($driver, $url, $informations) {
   
    if ($url -ne $CURRENT_URL) {
        Enter-SeUrl -Url $url -Target $driver
        write-host Lien different $url current $CURRENT_URL`n
    }
    

    $loginSelector = Find-SeElement -Target $driver -By CssSelector $informations.loginSelector
    $passwordSelector = Find-SeElement -target $driver -By CssSelector $informations.passwordSelector

    Send-SeKeys -Element $loginSelector -Keys $informations.login 

    $password = convert-password -login $informations.login -password $informations.password
    
    Send-SeKeys -Element $passwordSelector -Keys $password

    Start-Sleep -s 2

    $screenshot = Invoke-SeScreenshot -Target $driver 
    
    $filename = Join-Path (Get-Location).Path "$($json.name)-1$.png"
    $bytes = [Convert]::FromBase64String($screenshot)

    [IO.File]::WriteAllBytes($filename, $bytes)
}

# rensigne un text dans un champ
function set-field($driver, $url, $informations) {
    if ($url -ne $CURRENT_URL) {
        write-host Lien different $url current $CURRENT_URL`n
        Enter-SeUrl -Url $url -Target $driver
    }

    write-host selecteur $($informations.fieldSelector)

    $fieldElement = Find-SeElement -Target $driver -By CssSelector $($informations.fieldSelector)

    Send-SeKeys -Element $fieldElement -Keys $($informations.field) 
    Start-Sleep -s 2
}

#fait une déconnexion
function logOut($driver, $url, $informations) {
    if ($url -ne $CURRENT_URL) {
        write-host Lien different $url current $CURRENT_URL`n
        Enter-SeUrl -Url $url -Target $driver
    }
    if ($($informations.logOutSelector)) {
        Write-Host Déconnexion par click
        click-element -driver $driver -url $url -informations $informations
    }
    else {
        if ($($informations.logOut)) {
            Write-Host Déconnexion par Lien
            Enter-SeUrl -Url $($informations.logOut) -Target $driver
        }
    }
}

#traite une action web
function webAction($driver, $url, $informations) {
    
    if ($informations.type -eq "connection") {
     
        init-connection -driver $driver -url $url -informations $informations
    }
    if ($informations.type -eq "click") {

        click-element -driver $driver -url $url -informations $informations
    }
    if ($informations.type -eq "logOut") {
        logOut -url $url -driver $driver -informations $informations
    }
    if ($informations.type -eq "form") {

        set-field -driver $driver -url $url -informations $informations
    }
    
}

######################## Main ######################
#$driver = Start-SeChrome 

describe-ssa

$POS = $json.POS

for ($i = $start; $i -lt $end; $i++) {
    
    if ($POS[$i].type -eq "Link") {
        Write-Host "Url action found" 
        #Url -url $POS[$i].url -driver $driver
    }
    
    if ($POS[$i].type -eq "webAction") {
        Write-Host "Web action found type : " $($POS[$i].informations.type)
        #webAction -driver $driver -informations $POS[$i].informations -url $POS[$i].url     
    }
    $CURRENT_URL = $POS[$i].url
    Write-Host current URL : $CURRENT_URL
}
    
#Stop-SeDriver -Target $driver
