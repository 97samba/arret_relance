#
# Génére une POS
#

#Variables

$FILE_NAME = "Test"
$json = Get-Content .\json\TestWebAction.json | ConvertFrom-Json

#Initialise, cr�ation du fichier et autre
function INIT(){

    if(! (Test-Path -Path $FILE_NAME)){

        New-item -ItemType Directory -Name $FILE_NAME -Path "." | Out-Null
        New-item -ItemType File -Name "$FILE_NAME.txt" -Path $FILE_NAME  | Out-Null

    }else{

        Write-Host ce dossier $FILE_NAME existe

    }
 


}

#Ecris une ligne pass�e en argument

function WriteInFile($line){

    Add-Content -Value $line -Path .\Test\Test.txt
    

}


########################## Main ######################
#INIT

#writeInFile -line "tester une ligne"

$json.name

writeInFile -line "Arret_App(){"

$json.Arret | ForEach-Object {
    
    $url = $_.url
    writeInFile -line `$url=$url

    $type = $_.type
    writeInFile -line `$type=$type
}
writeInFile -line "}"