# le repertoire des scripts générés par l'application Web
$Script_Path = '.\scripts'
$ServerScriptPath = '/outil/jenkins/applicatifs/gitbranchrepo'


#Test si le script existe
function init($ssaName){
    if(!(Test-Path $Script_Path)){
        Write-Host Le dossier des scripts est introuvable
        exit
    }
    if(!(Test-Path "$Script_Path\$ssaName.sh")){
        write-host "Le script d'arret relance du ssa $ssaName est introuvable"
        exit
    }
}

function copyToMaster($ssaName,$server){
    
    Write-Host "$Script_Path\$ssaName.sh root@${server}:${ServerScriptPath}" 
    #scp.exe "$Script_Path\$ssaName.sh root@${server}:${ServerScriptPath}" 
}

########## MAIN ########

init $args[0]

copyToMaster -ssaName $args[0] -server $args[1]