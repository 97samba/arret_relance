$json = gc $args[0] | ConvertFrom-Json


$json.name
$json.auteur
$json.date_de_creation
$CURRENT_URL=""

function convert-password($password, $login){

    $mdp = $password | ConvertTo-SecureString -key (Get-Content .\aes.key)
    

    $pscred = New-Object System.Management.Automation.PSCredential($login,$mdp)
    
    return $pscred.GetNetworkCredential().Password
    
}

function get-driver($navigator){
    
    if($navigator -eq "Chrome")
    {
        $driver = Start-SeChrome -ImplicitWait 5
        
        return $driver
    }
    if($navigator -eq "Firefox")
    {
        return Start-SeFirefox
    }
    if($navigator -eq "Edge")
    {
        return Start-SeEdge 
    }
    if($null -eq $navigator)
    {
        return $null
    }

}

function Url($url, $driver)
{
    if($url -ne $CURRENT_URL){
        #Entre que quand c'est un url diferrent 
        Enter-SeUrl -Url $url -Target $driver
        write-host Lien different $url current $CURRENT_URL`n
    }

    Start-Sleep -s 2
}

function click-element($driver, $url,$informations){
    
    if($url -ne $CURRENT_URL){

        write-host Lien different $url current $CURRENT_URL`n
        Enter-SeUrl -Url $url -Target $driver

    }
    write-host $informations.clickSelector`n       
    $clickELement = Find-SeElement -Target $driver -By CssSelector $informations.clickSelector    
    
    write-host "Element found : $clickElement"`n  
    send-SeClick -Element $clickELement -SleepSeconds 2
     

}

# fonction pour l'authentification
function init-connection($driver, $url, $informations){
   
    if($url -ne $CURRENT_URL){
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

function set-field($driver, $url, $informations){
    if($url -ne $CURRENT_URL){
        write-host Lien different $url current $CURRENT_URL`n
        Enter-SeUrl -Url $url -Target $driver
    }

    write-host selecteur $($informations.fieldSelector)

    $fieldElement = Find-SeElement -Target $driver -By CssSelector $($informations.fieldSelector)

    Send-SeKeys -Element $fieldElement -Keys $($informations.field) 
    Start-Sleep -s 2
}


function webAction($driver, $url, $informations){
    
    if($informations.type -eq "connection"){
     
        init-connection -driver $driver -url $url -informations $informations
    }
    if($informations.type -eq "click"){

        click-element -driver $driver -url $url -informations $informations
    }
    if($informations.type -eq "form"){

        set-field -driver $driver -url $url -informations $informations
    }
    
}

######################## Main ######################
$driver = Start-SeChrome 



$json.POS | ForEach-Object {

    if($_.type -eq "Link")
    {
        Write-Host "Url action found" 
        Url -url $_.url -driver $driver
        
    }

    if($_.type -eq "webAction"){

        
        Write-Host "Web action found type : " $($_.informations.type)
        webAction -driver $driver -informations $_.informations -url $_.url
                
    }
    $CURRENT_URL = $_.url
    Write-Host current URL : $CURRENT_URL

}
Stop-SeDriver -Target $driver
