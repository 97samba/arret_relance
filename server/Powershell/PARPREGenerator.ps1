
$SCRIPT_DIRECTORY = ".\scripts"

function verify-args($parameters) {
    
    if ($parameters -ne 1) {
        write-host ERROR pas de fichier trouvé en argument
        exit
    }   

}

function write-line($line, $tab = 0) {

    $symbole = ""
    
    if ($tab -gt 0) {

        $symbole = "`t"

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
    write-line -line "REBOND_WIN=sw15272" -tab 2
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
    write-line -line "FIC_TEMP=`$LOCAL_DIR/tmp.txt"
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
####### Créer les étapes de relance
#
function create-relance($actions) {
    
    write-line -line " "
    write-line -line "######################################## RELANCE ########################################"
    write-line -line "Relance_App()"
    write-line -line "{"

    $num = $actions.count
    write-line -line "NB_ETAPE=$num" -tab 1
    write-line -line " "
    
    #Toutes les étapes
    $actions | ForEach-Object {

        create-etape -step $_
    }    
    write-line -line "}"
}

#
####### Créer les étapes d'Arrêt
#
function create-arret($actions) {
    
    write-line -line " "
    write-line -line "######################################## RELANCE ########################################"
    write-line -line "Arret_App()"
    write-line -line "{"

    write-line -line "NB_ETAPE=$($actions.count)" -tab 1
    write-line -line " "
    
    #Toutes les étapes d'arrêt
    $actions | ForEach-Object {

        create-etape -step $_
    }    
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
    write-line -line "`$ENVS=`($envs`)" -tab 1
    write-line -line "" -tab 1
    
    write-line -line "if [[ `${ENVS[@]} =~ `$TYPE_ENVIRONNEMENT ]] " -tab 1
    write-line -line "then" -tab 1
    
    write-line -line "ETAPE=Etape$($step.index+1)" -tab 2
    
    write-line -line "SRV=$($step.server)" -tab 2
    
    write-line -line "USER=$($step.user)" -tab 2
    
    if ($($step.os) -eq "windows") {
        
        create-windowsStep -step $step
        
    }
    else {
        
        create-linuxStep -step $step
        
    }
    
    write-line -line "echo" -tab 2    
    
    write-line -line "fi" -tab 1
    write-line -line "" -tab 1
}

########### Créer une étape windows
function create-windowsStep($step) {

    write-line -line "CMD=`"$($step.type) $($step.action) $($step.name)$($step.service) $($step.databaseType) $($step.server)`" " -tab 2

    
    write-line -line "CMD_WIN=`"powershell ./$($step.type).ps1 $($step.action) $($step.name)$($step.service) $($step.databaseType) $($step.server)`" " -tab 2

    write-line -line "echo" -tab 2
    write-line -line "echo `"DEBUT : `$`(date +`'%d/%m/%Y %H:%M:%S`'`)`"" -tab 2
    write-line -line "echo `"Serveur `"`$SRV`" - [`"`$TYPE_ACTION`":`"`$APPLI`":`"`$ETAPE`"/`"`$NB_ETAPE`"]`" " -tab 2

    #write-line -line "echo `"Commande : `"`$CMD" -tab 2
    write-line -line "echo `"Commande : `"`$CMD_WIN" -tab 2
    write-line -line "res=`$`(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@`$REBOND_WIN `"`$CMD_WIN`"`)" -tab 2
    
    write-line -line "retval=`$?" -tab 2
    
    if ($($step.action) -eq "status") {

        write-line -line "echo `$res > `$FIC_TMP" -tab 2
        write-line -line "if grep -c `"`$RES_ATTENDU`" `$FIC_TMP > /dev/null; then" -tab 2
        write-line -line "echo `"Serveur `"`$SRV`" - [`"`$TYPE_ACTION`":`"`$APPLI`":`"`$ETAPE`"/`"`$NB_ETAPE`"]  / OK `(RES`(`"`$res`"`)` / RES_ATTENDU`(`"`$RES_ATTENDU`"`)`)`"" -tab 3
        write-line -line "else" -tab 2
        write-line -line "echo `"Serveur `"`$SRV`" - [`"`$TYPE_ACTION`":`"`$APPLI`":`"`$ETAPE`"/`"`$NB_ETAPE`"]  / ERREUR `"`$NUM_ERR`" : RESULTAT `(`"`$res`"`) DIFFERENT DU RESULTAT ATTENDU `(`"`$RES_ATTENDU`"`)`"" -tab 3
        write-line -line "exit `$NUM_ERR" -tab 3
        write-line -line "fi" -tab 2
    

    }
    else {
        
        write-line -line "echo `"Serveur `"`$SRV`" - [`"`$TYPE_ACTION`":`"`$APPLI`":`"`$ETAPE`"/`"`$NB_ETAPE`"]`" " -tab 2
        write-line -line "echo `"FIN : `$`(date +`'%d/%m/%Y %H:%M:%S`'`)`"" -tab 2
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
        write-line -line "echo `"Serveur `"`$SRV`" - [`"`$TYPE_ACTION`":`"`$APPLI`":`"`$ETAPE`"/`"`$NB_ETAPE`"]  / OK `(RES`(`"`$res`"`)` / RES_ATTENDU`(`"`$RES_ATTENDU`"`)`)`"" -tab 3
        write-line -line "else" -tab 2
        write-line -line "echo `"Serveur `"`$SRV`" - [`"`$TYPE_ACTION`":`"`$APPLI`":`"`$ETAPE`"/`"`$NB_ETAPE`"]  / ERREUR `"`$NUM_ERR`" : RESULTAT `(`"`$res`"`) DIFFERENT DU RESULTAT ATTENDU `(`"`$RES_ATTENDU`"`)`"" -tab 3
        write-line -line "exit `$NUM_ERR" -tab 3
        write-line -line "fi" -tab 2
    

    }
    else {
        
        write-line -line "echo `"Serveur `"`$SRV`" - [`"`$TYPE_ACTION`":`"`$APPLI`":`"`$ETAPE`"/`"`$NB_ETAPE`"]`" " -tab 2
        write-line -line "echo `"FIN : `$`(date +`'%d/%m/%Y %H:%M:%S`'`)`"" -tab 2
    }
}

#
####### Créer les étapes d'Arrêt
#
function create-tests($actions) {
    
    write-line -line " "
    write-line -line "######################################## Tests ########################################"
    write-line -line "Tests_App()"
    write-line -line "{"

    
    #Toutes les étapes d'arret avec vérification
    $actions.Arret | where-Object { $_.action -eq "status" } | ForEach-Object {
        
        write-line -line "echo" -tab 1
        write-line -line "SRV=`"$($_.server)`"" -tab 1
        write-line -line "USER=" -tab 1
        write-line -line "CMD=`"$($_.type) $($_.action) $($_.name)$($_.service) $($_.databaseType) $($_.server)`" " -tab 1
        write-line -line "CMD_WIN=`"powershell ./$($_.type).ps1 $($_.action) $($_.name)$($_.service) $($_.databaseType) $($_.server)`" " -tab 1
        write-line -line "SSA : `"`$APPLI`"" -tab 1
        write-line -line "Serveur : `"`$SRV`"" -tab 1
        write-line -line "Commande : `"`$CMD_WIN`"" -tab 1
        write-line -line "res=`$`(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@`$REBOND_WIN `"`$CMD_WIN`"`)" -tab 1
        write-line -line "Resultat : `"`$res`"" -tab 1
        write-line -line "echo" -tab 1
        write-line -line ""

    }   
    #Toutes les étapes de relance avec vérification
    $actions.Relance | where-Object { $_.action -eq "status" } | ForEach-Object {
        
        write-line -line "echo" -tab 1
        write-line -line "SRV=`"$($_.server)`"" -tab 1
        write-line -line "USER=" -tab 1
        write-line -line "CMD=`"$($_.type) $($_.action) $($_.name)$($_.service) $($_.databaseType) $($_.server)`" " -tab 1
        write-line -line "CMD_WIN=`"powershell ./$($_.type).ps1 $($_.action) $($_.name)$($_.service) $($_.databaseType) $($_.server)`" " -tab 1
        write-line -line "SSA : `"`$APPLI`"" -tab 1
        write-line -line "Serveur : `"`$SRV`"" -tab 1
        write-line -line "Commande : `"`$CMD_WIN`"" -tab 1
        write-line -line "res=`$`(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@`$REBOND_WIN `"`$CMD_WIN`"`)" -tab 1
        write-line -line "Resultat : `"`$res`"" -tab 1
        write-line -line "echo" -tab 1
        write-line -line ""

    }  
    write-line -line "}"
}

#
####### Créer le main 

function create-main() {

    write-line -line " "
    write-line -line "######################################## MAIN ########################################"

    write-line -line "echo `"# | Version TRANSFORMERS : 19/05/2021`""
    write-line -line "echo `"# | Version PARPRE : 19/05/2021`""
    write-line -line "echo `"# | Version EBO : 19/05/2021`""
    write-line -line "echo `"# | Date creation : 19/05/2021`""

    write-line -line "case `$TYPE_ACTION in"
    write-line -line "Arret)" -tab 1
    write-line -line "Arret_App" -tab 2
    write-line -line ";;" -tab 2
    write-line -line "" -tab 2
    write-line -line "Relance)" -tab 1
    write-line -line "Relance_App" -tab 2
    write-line -line ";;" -tab 2
    write-line -line "" -tab 2
    write-line -line "Tests)" -tab 1
    write-line -line "Tests_App" -tab 2
    write-line -line ";;" -tab 2
    write-line -line "" -tab 2
    write-line -line "esac"
    write-line -line ""

    write-line -line "echo `"FIN DU TRAITEMENT`" >>`$FIC_ETAT"

}



function main-process($file) {

    $json_element = Get-Content $file | ConvertFrom-Json

    Write-Host Processing parpre $file name : $PARPRE_NAME as: $FILE_NAME  
    
    #Création de variables
    create-variable $($json_element.variables.servers)
    
    #Création des logs et reports
    create-logAndReport 

    #Séquence d'arrêt
    create-relance -actions $json_element.Relance
    
    #Séquence de relance
    create-arret -actions $json_element.Arret
    
    #Séquence de Tests
    create-tests -actions $json_element

    #création du MAIN
    create-main     
    
}

############################### Main #############################
verify-args -parameters $args.Count

#On reupere le nom du fichier Json
$PARPRE_NAME = (Split-Path $args[0] -Leaf)

$PARPRE_NAME = [io.path]::GetFileNameWithoutExtension($PARPRE_NAME)

$FILE_NAME = $PARPRE_NAME + ".sh"

init -file $args[0]

main-process -file $args[0]


