TYPE_ACTION=$1
TYPE_ENVIRONNEMENT=$2
BUILD_JENKINS_USER=$3
LOCAL_DIR=/tmp
LOG_DIR=/tmp
TIME_OUT=600
################################ VARIABLES ################################
APPLI=variableTest
case $TYPE_ENVIRONNEMENT in 
    PROD)
        localhost=localhost
        svc_test=svc_test
        instance=instance
        REBOND_WIN=sw15298
        ;;
    HPROD)
        localhost=definir
        svc_test=
        instance=definir
        REBOND_WIN=SW11183.int.wsf.ads
        ;;
    HPROD2)
        localhost=definir
        svc_test=
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
}
 
######################################## MAIN ########################################
echo "# | Version TRANSFORMERS : 19/05/2021"
echo "# | Version POS : 19/05/2021"
echo "# | Version EBO : 19/05/2021"
echo "# | Date creation : 19/05/2021"
        Launch_POS
echo "FIN DU TRAITEMENT" >>$FIC_ETAT
