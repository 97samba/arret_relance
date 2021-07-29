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
        REBOND_WIN=SW11183.int.wsf.ads
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
if [ ! -d $LOCAL_DIR ] 
then
    mkdir -p $LOCAL_DIR
    if [ $? -ne 0 ] 
    then
        echo
        echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        echo "Echec creation repertoire LOG ($LOCAL_DIR)"
        echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        echo
    fi
fi
FIC_ETAT=$LOCAL_DIR/etat.txt
FIC_TMP=$LOCAL_DIR/tmp.txt
case $TYPE_ACTION in
    Arret)
        LOCAL_LOG_FILE=$LOG_DIR/Stop_$APPLI.log
        LOCAL_REPORT_FILE=$LOG_DIR/Stop_$APPLI"_Report.log"
        ;;
    Relance)
        LOCAL_LOG_FILE=$LOG_DIR/Start_$APPLI.log
        LOCAL_REPORT_FILE=$LOG_DIR/Start_$APPLI"_Report.log"
        ;;
    Tests)
        LOCAL_LOG_FILE=$LOG_DIR/Tests_$APPLI.log
        LOCAL_REPORT_FILE=$LOG_DIR/Tests_$APPLI"_Report.log"
        ;;
    *)
        echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        echo "Type d'action incorrecte (Arret / Relance / Tests )"
        echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        echo
        exit 0
esac

if [ -f $FIC_ETAT ]
then
    rm -f $FIC_ETAT
fi
echo "DEBUT DU TRAITEMENT" > $FIC_ETAT
if [ -f $FIC_TMP ]
then
    rm -f 
fi

if [ -f $LOCAL_LOG_FILE ]
then
    mv $LOCAL_LOG_FILE $LOCAL_LOG_FILE.old
fi

if [ -f $LOCAL_REPORT_FILE ]
then
    mv $LOCAL_REPORT_FILE $LOCAL_REPORT_FILE.old
fi


logEvent(){
    if [ -z "$1" ]
    then
        echo >> $LOCAL_LOG_FILE
    else
        echo "$(date + '%d/%m/%Y %H:%M:%S') : $1 " >> $LOCAL_LOG_FILE
    fi
}

logReport(){
    if [ -z "$1" ]
    then
        echo >> $LOCAL_REPORT_FILE
    else
        echo "$(date + '%d/%m/%Y %H:%M:%S') : $1 " >>  $LOCAL_REPORT_FILE
    fi

}
 
######################################## Tests ########################################
Launch_POS()
{
     
    echo " Execution des étapes POS 0  1"
    CMD_WIN = "powershell .\POSTester.ps1 .\Json\test_container_1.json 0 1"
    res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
    echo 
    echo " [ Action Web :"$APPLI"] / OK RES("$res") " 
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
     
    echo " Execution des étapes POS 3  6"
    CMD_WIN = "powershell .\POSTester.ps1 .\Json\test_container_1.json 3 6"
    res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
    echo 
    echo " [ Action Web :"$APPLI"] / OK RES("$res") " 
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
     
    echo " Execution des étapes POS 8  8"
    CMD_WIN = "powershell .\POSTester.ps1 .\Json\test_container_1.json 8 8"
    res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
    echo 
    echo " [ Action Web :"$APPLI"] / OK RES("$res") " 
    echo "FIN : $(date +'%d/%m/%Y %H:%M:%S')"
    echo 
     
}
 
######################################## MAIN ########################################
echo "# | Version TRANSFORMERS : 19/05/2021"
echo "# | Version POS : 19/05/2021"
echo "# | Version EBO : 19/05/2021"
echo "# | Date creation : 19/05/2021"
        Launch_POS
echo "FIN DU TRAITEMENT" >>$FIC_ETAT
