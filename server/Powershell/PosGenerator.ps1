
$SCRIPT_DIRECTORY = ".\scripts"
$POSExecutor = ".\POSTester.ps1"

function verify-args($parameters) {
    
    if ($parameters -ne 1) {
        write-host ERROR pas de fichier trouvé en argument
        exit
    }   

}

function write-line($line, $tab = 0) {

    $symbole = ""
    
    if ($tab -gt 0) {

        $symbole = "  "

        for ($i = 0 ; $i -lt $tab ; $i++) {
     
            $symbole += $symbole
        }
    }
    Add-Content -Value $symbole$line -Path $SCRIPT_DIRECTORY\$FILE_NAME
}

function init($file) {
    
    if (!(Test-Path -Path $file)) {
        
        write-host Le fichier $file n`'existe pas
        
    }

    if (!(Test-Path -Path $SCRIPT_DIRECTORY)) {
        
        Write-Host "Création du dossier Scripts"
        
        New-Item -ItemType Directory -Name $SCRIPT_DIRECTORY | Out-Null

    }
    
        
    if (!(Test-Path -Path $SCRIPT_DIRECTORY\$FILE_NAME )) {

        New-item -ItemType File -Name $FILE_NAME -Path $SCRIPT_DIRECTORY   | Out-Null
         
    }
    else {

        Write-Host ce fichier $FILE_NAME existe
        Remove-Item -Path $SCRIPT_DIRECTORY\$FILE_NAME
        Write-Host Suppression de  $FILE_NAME 
        New-item -ItemType File -Name $FILE_NAME -Path $SCRIPT_DIRECTORY   | Out-Null

    }
    
}

#
####### Créer les Variables
#
function create-variable($Variables) {

    write-line -line "TYPE_ACTION=`$1"
    write-line -line "TYPE_ENVIRONNEMENT=`$2"
    write-line -line "BUILD_JENKINS_USER=`$3"
    write-line -line "LOCAL_DIR=/tmp"
    write-line -line "LOG_DIR=/tmp"
    write-line -line "TIME_OUT=600"

    write-line -line '################################ VARIABLES ################################'

    write-line -line "APPLI=$PARPRE_NAME"

    write-line -line "case `$TYPE_ENVIRONNEMENT in "
    write-line -line "PROD)" -tab 1

    $variables | ForEach-Object {
        write-line -line "$($_.prod)=$($_.prod)" -tab 2
    }
    write-line -line "REBOND_WIN=sw15298" -tab 2
    write-line -line ";;" -tab 2

    write-line -line "HPROD)" -tab 1
    $variables | ForEach-Object {
        write-line -line "$($_.prod)=$($_.hprod)" -tab 2
    }
    write-line -line "REBOND_WIN=SW11183.int.wsf.ads" -tab 2
    write-line -line ";;" -tab 2

    write-line -line "HPROD2)"-tab 1
    $variables | ForEach-Object {
        write-line -line "$($_.prod)=$($_.dev)" -tab 2
    }
    write-line -line "REBOND_WIN=sw15272" -tab 2
    write-line -line ";;" -tab 2

    write-line -line "*)" -tab 1
    write-line -line "echo `"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`"" -tab 2
    write-line -line "echo `"Type d`'environnement incorrect (PROD / HPROD )`"" -tab 2
    write-line -line "echo `"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`"" -tab 2
    write-line -line "exit 0" -tab 2

    write-line -line ";;" -tab 2
    write-line -line "esac"
    write-line -line " "


    write-line -line '################################ FIN VARIABLES ################################'
    
}

#
####### Créer les fonctions de logs et report
#
function create-logAndReport() {

    write-line -line "if [ ! -d `$LOCAL_DIR ] "
    write-line -line "then"
    write-line -line "mkdir -p `$LOCAL_DIR" -tab 1
    write-line -line "if [ `$? -ne 0 ] " -tab 1
    write-line -line "then" -tab 1
    write-line -line "echo" -tab 2
    write-line -line "echo `"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`"" -tab 2
    write-line -line "echo `"Echec creation repertoire LOG (`$LOCAL_DIR)`"" -tab 2
    write-line -line "echo `"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`"" -tab 2
    write-line -line "echo" -tab 2
    write-line -line "fi" -tab 1
    write-line -line "fi"

    write-line -line "FIC_ETAT=`$LOCAL_DIR/etat.txt"
    write-line -line "FIC_TMP=`$LOCAL_DIR/tmp.txt"
    write-line -line "case `$TYPE_ACTION in"
    
    write-line -line "Arret)" -tab 1
    write-line -line "LOCAL_LOG_FILE=`$LOG_DIR/Stop_`$APPLI.log" -tab 2
    write-line -line "LOCAL_REPORT_FILE=`$LOG_DIR/Stop_`$APPLI`"_Report.log`"" -tab 2
    write-line -line ";;" -tab 2

    write-line -line "Relance)" -tab 1
    write-line -line "LOCAL_LOG_FILE=`$LOG_DIR/Start_`$APPLI.log" -tab 2
    write-line -line "LOCAL_REPORT_FILE=`$LOG_DIR/Start_`$APPLI`"_Report.log`"" -tab 2
    write-line -line ";;" -tab 2

    write-line -line "Tests)" -tab 1
    write-line -line "LOCAL_LOG_FILE=`$LOG_DIR/Tests_`$APPLI.log" -tab 2
    write-line -line "LOCAL_REPORT_FILE=`$LOG_DIR/Tests_`$APPLI`"_Report.log`"" -tab 2
    write-line -line ";;" -tab 2

    write-line -line "*)" -tab 1
    write-line -line "echo `"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`"" -tab 2
    write-line -line "echo `"Type d`'action incorrecte (Arret / Relance / Tests )`"" -tab 2
    write-line -line "echo `"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`"" -tab 2
    write-line -line "echo" -tab 2
    write-line -line "exit 0" -tab 2
    write-line -line "esac"
    write-line -line ""

    write-line -line "if [ -f `$FIC_ETAT ]"
    write-line -line "then"
    write-line -line "rm -f `$FIC_ETAT" -tab 1
    write-line -line "fi"
    write-line -line "echo `"DEBUT DU TRAITEMENT`" > `$FIC_ETAT"

    write-line -line "if [ -f `$FIC_TMP ]"
    write-line -line "then"
    write-line -line "rm -f $FIC_TMP" -tab 1
    write-line -line "fi"
    write-line -line ""

    write-line -line "if [ -f `$LOCAL_LOG_FILE ]"
    write-line -line "then"
    write-line -line "mv `$LOCAL_LOG_FILE `$LOCAL_LOG_FILE.old" -tab 1
    write-line -line "fi"
    write-line -line ""

    write-line -line "if [ -f `$LOCAL_REPORT_FILE ]"
    write-line -line "then"
    write-line -line "mv `$LOCAL_REPORT_FILE `$LOCAL_REPORT_FILE.old" -tab 1
    write-line -line "fi"
    write-line -line ""

    write-line -line ""
    write-line -line "logEvent(){"

    write-line -line "if [ -z `"`$1`" ]" -tab 1
    write-line -line "then"-tab 1
    write-line -line  "echo >> `$LOCAL_LOG_FILE" -tab 2
    write-line -line "else" -tab 1
    write-line -line   "echo `"`$(date + `'%d/%m/%Y %H:%M:%S`') : `$1 `" >> `$LOCAL_LOG_FILE" -tab 2
    write-line -line "fi"-tab 1

    write-line -line "}"
    write-line -line ""

    write-line -line "logReport(){"

    write-line -line "if [ -z `"`$1`" ]" -tab 1
    write-line -line "then"-tab 1
    write-line -line  "echo >> `$LOCAL_REPORT_FILE" -tab 2
    write-line -line "else"-tab 1
    write-line -line   "echo `"`$(date + `'%d/%m/%Y %H:%M:%S`') : `$1 `" >>  `$LOCAL_REPORT_FILE" -tab 2
    write-line -line "fi"-tab 1
    write-line -line ""

    write-line -line "}"



}


#
####### Créer une étape 
#
function create-etape($step) {
    
    $envs = @()

    if ($($step.options.prod) -eq $true) {
        $envs += "PROD"
    }
    if ($($step.options.hprod) -eq $true) {
        $envs += "HPROD"
    }
    if ($($step.options.inte) -eq $true) {
        $envs += "HPROD2"

    }
    if ($($step.options.dev) -eq $true) {
        $envs += "DEV"

    }

    write-line -line "#Les environnements sur lesquels vont s`'executer la commande" -tab 1
    write-line -line "`ENVS=`($envs`)" -tab 1
    write-line -line "" -tab 1
    write-line -line "for i in `"`${ENVS[@]}`"" -tab 1
    write-line -line "do" -tab 1
    
    write-line -line "if [ `$i == `$TYPE_ENVIRONNEMENT ] " -tab 2
    write-line -line "then" -tab 2
    
    write-line -line "ETAPE=Etape$($step.index+1)" -tab 3
    
    write-line -line "SRV=`$$($step.server)" -tab 3

    write-line -line "let NUM_ERR++ " -tab 3
    
    write-line -line "USER=$($step.user)" -tab 3
    
    if ($($step.os) -ne "linux") {
        
        #create-windowsStep -step $step
        
    }
    else {
        
        #create-linuxStep -step $step
        
    }
    create-windowsStep -step $step

    
    write-line -line "echo" -tab 3    
    
    write-line -line "fi" -tab 2
    write-line -line "" -tab 2
    write-line -line "done" -tab 1



}

########### Créer une étape windows
function create-windowsStep($step) {

    #write-line -line "CMD=`"$($step.type) $($step.action) $($step.name)$($step.service) $($step.databaseType) $($step.server)`" " -tab 2

    $commande = Create-Command -step $step
    #write-host $commande

    write-line -line "CMD_WIN=`"$commande`" " -tab 3

    write-line -line "echo" -tab 3
    write-line -line "echo `"DEBUT : `$`(date +`'%d/%m/%Y %H:%M:%S`'`)`"" -tab 3
    write-line -line "echo `"Serveur `"`$SRV`" - [`"`$TYPE_ACTION`":`"`$APPLI`":`"`$ETAPE`"/`"`$NB_ETAPE`"]`" " -tab 3

    #write-line -line "echo `"Commande : `"`$CMD" -tab 2
    write-line -line "echo `"Commande : `"`$CMD_WIN" -tab 3
    write-line -line "res=`$`(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@`$REBOND_WIN `"`$CMD_WIN`"`)" -tab 3
    
    write-line -line "retval=`$?" -tab 3
    
    if ($($step.action) -eq "status") {

        write-line -line "echo `$res > `$FIC_TMP" -tab 3
        write-line -line "if grep -c `"`$RES_ATTENDU`" `$FIC_TMP > /dev/null; then" -tab 3
        write-line -line "echo `"===> OK / RESULTAT : `"`$res`" / RES_ATTENDU`(`"`$RES_ATTENDU`"`)`)`"" -tab 3
        write-line -line "else" -tab 3
        write-line -line "echo `"===> ERREUR `"`$NUM_ERR`" : RESULTAT : `"`$res`" / DIFFERENT DU RESULTAT ATTENDU `(`"`$RES_ATTENDU`"`)`"" -tab 3
        write-line -line "exit `$NUM_ERR" -tab 3
        write-line -line "fi" -tab 3
    

    }
    else {
        
        write-line -line "echo `"Serveur `"`$SRV`" - [`"`$TYPE_ACTION`":`"`$APPLI`":`"`$ETAPE`"/`"`$NB_ETAPE`"] / OK RES`(`"`$res`"`) `" " -tab 3
        write-line -line "echo `"FIN : `$`(date +`'%d/%m/%Y %H:%M:%S`'`)`"" -tab 3
    }
}

########### Créer une étape linux
function create-linuxStep($step) {

    write-line -line "CMD=`"$($step.name)`" " -tab 2

    write-line -line "CMD=`"su - `$USER -c `$CMD `" " -tab 2

   
    write-line -line "echo" -tab 2
    write-line -line "echo `"DEBUT : `$`(date +`'%d/%m/%Y %H:%M:%S`'`)`"" -tab 2
    write-line -line "echo `"Serveur `"`$SRV`" - [`"`$TYPE_ACTION`":`"`$APPLI`":`"`$ETAPE`"/`"`$NB_ETAPE`"]`" " -tab 2

    write-line -line "echo `"Commande : `"`$CMD" -tab 2
    write-line -line "res=`$`(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q root@`$SRV `"`$CMD`"`)" -tab 2
    
    write-line -line "retval=`$?" -tab 2
    
    if ($($step.action) -eq "status") {

        write-line -line "echo `$res > `$FIC_TMP" -tab 2
        write-line -line "if grep -c `"`$RES_ATTENDU`" `$FIC_TMP > /dev/null; then" -tab 2
        write-line -line    "echo `"Serveur `"`$SRV`" - [`"`$TYPE_ACTION`":`"`$APPLI`":`"`$ETAPE`"/`"`$NB_ETAPE`"]  / OK `(RES`(`"`$res`"`)` / RES_ATTENDU`(`"`$RES_ATTENDU`"`)`)`"" -tab 3
        write-line -line "else" -tab 2
        write-line -line    "echo `"Serveur `"`$SRV`" - [`"`$TYPE_ACTION`":`"`$APPLI`":`"`$ETAPE`"/`"`$NB_ETAPE`"]  / ERREUR `"`$NUM_ERR`" : RESULTAT `(`"`$res`"`) DIFFERENT DU RESULTAT ATTENDU `(`"`$RES_ATTENDU`"`)`"" -tab 3
        write-line -line    "exit `$NUM_ERR" -tab 3
        write-line -line "fi" -tab 2
    

    }
    else {
        
        write-line -line "echo `"Serveur `"`$SRV`" - [`"`$TYPE_ACTION`":`"`$APPLI`":`"`$ETAPE`"/`"`$NB_ETAPE`"]`" " -tab 2
        write-line -line "echo `"FIN : `$`(date +`'%d/%m/%Y %H:%M:%S`'`)`"" -tab 2
    }
}

# Créer une ligne de commande
function Create-Command ($step) {

    switch ($($step.type)) {
        "service" { 
            return "powershell ./$($step.type).ps1 $($step.action) $($step.name) `$SRV"
        }
        "process" { 
            return "powershell ./$($step.type).ps1 $($step.action) $($step.name) `$SRV"
        }
        "database" { 
            return "powershell ./$($step.type).ps1 $($step.action) `$$($step.name) $($step.databaseType) `$SRV"
        }
        "script" { 
            return "powershell ./invoke.ps1 $($step.path) `$SRV"
        }
        "log" { 
            return "powershell ./checkLog.ps1 $($step.name) $($step.path) `$SRV"
        }
        "disk" { 
            return "powershell ./checkDisk.ps1 $($step.disks) `$SRV"
        }
        "IIS" { 
            return "powershell ./Pool_iis.ps1 $($step.action) $($step.name) $($step.elementType) `$SRV"
        }
        "rename" { 
            return "powershell ./$($step.type).ps1 $($step.path) $($step.name) `$SRV"
        }
        "link" { 
            return "powershell ./CheckUrl.ps1 status $($step.url) `$SRV"
        }
        Default {
            return "powershell write-host Commande non prise en compte"
        }
    }
}

#
####### Créer les étapes de POS
#
function create-POS($actions) {
    
    write-line -line " "
    write-line -line "######################################## Tests ########################################"
    write-line -line "Launch_POS()"
    write-line -line "{"

    #La plage d'actions à vérifier avant de voir une action different d'un parcours web
    $actionToGenerateNow=@()

    #Toutes les étapes d'arret avec vérification
    for ($i = 0; $i -lt $actions.POS.length; $i++){
        if($actions.POS[$i].type -eq "webAction"){
            $actionToGenerateNow+=$actions.POS[$i]
            #si c'est le dernier, on écrit les étapes qui sont enregistées
            if($i -eq $actions.POS.length - 1){
                create-WebActionStep -start $($actionToGenerateNow[0].index) -end ($($actionToGenerateNow[-1].index))
            }
        }else{
            # On vérifie s'il y'a des actions POS, on les écrit dans le fichier 
            if($actionToGenerateNow.length -gt 0){
                
                create-WebActionStep -start $($actionToGenerateNow[0].index) -end ($($actionToGenerateNow[-1].index))
                # on flush le tableau
                $actionToGenerateNow=@()
            }
            # Puis on écrit l'étape
            create-etape -step $actions.POS[$i]
        }
    }   
    write-line -line "}"
}

function create-WebActionStep($start,$end)
{
    write-line -line " " -tab 1
    write-line -line "echo `" Execution des étapes POS $start  $end`"" -tab 1
    write-line -line "CMD_WIN = `"powershell $POSExecutor .\Json\$PARPRE_NAME.json $start $end`"" -tab 1
    write-line -line "res=`$`(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@`$REBOND_WIN `"`$CMD_WIN`"`)" -tab 1
    write-line -line "echo " -tab 1
    write-line -line "echo `" [ Action Web :`"`$APPLI`"] / OK RES`(`"`$res`"`) `" " -tab 1
    write-line -line "echo `"FIN : `$`(date +`'%d/%m/%Y %H:%M:%S`'`)`"" -tab 1
    write-line -line "echo " -tab 1
    write-line -line " " -tab 1   
}

#
####### Créer le main 

function create-main() {

    write-line -line " "
    write-line -line "######################################## MAIN ########################################"

    write-line -line "echo `"# | Version TRANSFORMERS : 19/05/2021`""
    write-line -line "echo `"# | Version POS : 19/05/2021`""
    write-line -line "echo `"# | Version EBO : 19/05/2021`""
    write-line -line "echo `"# | Date creation : 19/05/2021`""

    write-line -line "Launch_POS" -tab 2

    write-line -line "echo `"FIN DU TRAITEMENT`" >>`$FIC_ETAT"

}



function main-process($file) {

    $json_element = Get-Content $file | ConvertFrom-Json

    Write-Host Processing parpre $file name : $PARPRE_NAME as: $FILE_NAME  
    
    #Création de variables
    create-variable $($json_element.variables.servers)

    
    #Création des logs et reports
    create-logAndReport 
    
    #Séquence de Tests
    create-POS -actions $json_element

    #création du MAIN
    create-main     
    
}

############################### Main #############################
verify-args -parameters $args.Count

#On recupere le nom du fichier Json
$PARPRE_NAME = (Split-Path $args[0] -Leaf)

$PARPRE_NAME = [io.path]::GetFileNameWithoutExtension($PARPRE_NAME)

$FILE_NAME = $PARPRE_NAME + "_POS.sh"

init -file $args[0]

main-process -file $args[0]