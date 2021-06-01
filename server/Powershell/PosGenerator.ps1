$json = Get-Content .\json\ARES.json | ConvertFrom-Json
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
    if($navigator -eq $null)
    {
        return $null
    }

}

function Url($url, $driver)
{
    
    Enter-SeUrl -Url $url -Target $driver
    Start-Sleep -s 2
}

function click-element($driver, $url,$informations){
    
    if($url -ne $CURRENT_URL){

        write-host Lien different $url current $CURRENT_URL
        Enter-SeUrl -Url $url -Target $driver

    }

    $clickELement = Find-SeElement -Target $driver -By CssSelector $informations.clickSelector       
        
    send-SeClick -Element $clickELement -SleepSeconds 2
     

}

function webAction($driver, $url, $informations){
    
    if($informations.type -eq "connection"){
        
        if($informations.url -ne $CURRENT_URL){
            Enter-SeUrl -Url $url -Target $driver
        }
        Start-Sleep -s 2

        $loginSelector = Find-SeElement -Target $driver -By CssSelector $informations.loginSelector
        $passwordSelector = Find-SeElement -target $driver -By CssSelector $informations.passwordSelector

        Send-SeKeys -Element $loginSelector -Keys $informations.login 

        $password = convert-password -login $informations.login -password $informations.password
        
        Send-SeKeys -Element $passwordSelector -Keys $password
        Start-Sleep -s 2
        #$screenshot = Invoke-SeScreenshot -Target $driver 
        #le stocker dans une image nomSSA_date_webaction_index.png


    }
    if($informations.type -eq "click"){

        click-element -driver $driver -url $url -informations $informations
    }
    
}

$driver = Start-SeChrome 


$json.Arret | ForEach-Object {

    if($_.type -eq "Link")
    {
        Write-Host "Url action found" 
        #Url -url $_.url -driver $driver
        
    }

    if($_.type -eq "webAction"){

        
        Write-Host "Web action found type : " $_.informations.type
        webAction -driver $driver -informations $_.informations -url $_.url
                
    }
    $CURRENT_URL = $_.url
    Write-Host $CURRENT_URL

}
Stop-SeDriver -Target $driver
