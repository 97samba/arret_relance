TYPE_ACTION=$1
TYPE_ENVIRONNEMENT=$2
BUILD_JENKINS_USER=$3
LOCAL_DIR=/tmp
LOG_DIR=/tmp
TIME_OUT=600
################################ VARIABLES ################################
APPLI=test_container_1
case $TYPE_ENVIRONNEMENT in 
    PROD)
        localhost=localhost
        instance=instance
        REBOND_WIN=sw15298
        ;;
    HPROD)
        localhost=localhost
        instance=definir
        REBOND_WIN=sw15272
        ;;
    HPROD2)
        localhost=localhost
        instance=definir
        REBOND_WIN=sw15272
        ;;
    *)
        echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        echo "Type d'environnement incorrect (PROD / HPROD )"
        echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        exit 0
        ;;
esac
 
################################ FIN VARIABLES ################################
 
######################################## Tests ########################################
Launch_POS()
{
     
    echo " Execution des étapes POS de 0 à 1"
    CMD_WIN = "powershell .\POSTester.ps1 .\Json\test_container_1.json 0 1"
    res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
    echo " [Action Web :"$APPLI"] / OK RES("$res") " 
    echo "FIN : $(date +'%d/%m/%Y %H:%M:%S')"
    echo 
     
    #Les environnements sur lesquels vont s'executer la commande
    ENVS=(PROD HPROD HPROD2 DEV)
    
    for i in "${ENVS[@]}"
    do
        if [ $i == $TYPE_ENVIRONNEMENT ] 
        then
                ETAPE=Etape3
                SRV=$localhost
                let NUM_ERR++ 
                USER=
                CMD_WIN="powershell ./service.ps1 status test $SRV" 
                echo
                echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
                echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
                echo "Commande : "$CMD_WIN
                res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
                retval=$?
                echo $res > $FIC_TMP
                if grep -c "$RES_ATTENDU" $FIC_TMP > /dev/null; then
                echo "===> OK / RESULTAT : "$res" / RES_ATTENDU("$RES_ATTENDU"))"
                else
                echo "===> ERREUR "$NUM_ERR" : RESULTAT : "$res" / DIFFERENT DU RESULTAT ATTENDU ("$RES_ATTENDU")"
                exit $NUM_ERR
                fi
                echo
        fi
        
    done
     
    echo " Execution des étapes POS de 3 à 6"
    CMD_WIN = "powershell .\POSTester.ps1 .\Json\test_container_1.json 3 6"
    res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
    echo " [Action Web :"$APPLI"] / OK RES("$res") " 
    echo "FIN : $(date +'%d/%m/%Y %H:%M:%S')"
    echo 
     
    #Les environnements sur lesquels vont s'executer la commande
    ENVS=(PROD HPROD HPROD2 DEV)
    
    for i in "${ENVS[@]}"
    do
        if [ $i == $TYPE_ENVIRONNEMENT ] 
        then
                ETAPE=Etape8
                SRV=$localhost
                let NUM_ERR++ 
                USER=
                CMD_WIN="powershell ./database.ps1 status $test MSSQL $SRV" 
                echo
                echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
                echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
                echo "Commande : "$CMD_WIN
                res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
                retval=$?
                echo $res > $FIC_TMP
                if grep -c "$RES_ATTENDU" $FIC_TMP > /dev/null; then
                echo "===> OK / RESULTAT : "$res" / RES_ATTENDU("$RES_ATTENDU"))"
                else
                echo "===> ERREUR "$NUM_ERR" : RESULTAT : "$res" / DIFFERENT DU RESULTAT ATTENDU ("$RES_ATTENDU")"
                exit $NUM_ERR
                fi
                echo
        fi
        
    done
     
    echo " Execution des étapes POS de 8 à 8"
    CMD_WIN = "powershell .\POSTester.ps1 .\Json\test_container_1.json 8 8"
    res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
    echo " [Action Web :"$APPLI"] / OK RES("$res") " 
    echo "FIN : $(date +'%d/%m/%Y %H:%M:%S')"
    echo 
     
}
