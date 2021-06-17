TYPE_ACTION=$1
TYPE_ENVIRONNEMENT=$2
BUILD_JENKINS_USER=$3
LOCAL_DIR=/tmp
LOG_DIR=/tmp
TIME_OUT=600
################################ VARIABLES ################################
APPLI=TestAutorelance
case $TYPE_ENVIRONNEMENT in 
		PROD)
				REBOND_WIN=sw15298
				;;
		HPROD)
				REBOND_WIN=sw15272
				;;
		HPROD2)
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
FIC_TEMP=$LOCAL_DIR/tmp.txt
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
 
######################################## RELANCE ########################################
Relance_App()
{
		NB_ETAPE=4
 
		ETAPE=Etape1
		SRV=localhost
		USER=
		CMD="service stop bits  localhost" 
		CMD_WIN="powershell ./service.ps1 stop bits  localhost" 
		echo
		echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
		echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
		echo "Commande : "$CMD
		echo "Commande : "$CMD_WIN
		res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
		retval=$?
		echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
		echo "FIN : $(date +'%d/%m/%Y %H:%M:%S')"
		echo
 
		ETAPE=Etape2
		SRV=localhost
		USER=
		CMD="service status bits  localhost" 
		CMD_WIN="powershell ./service.ps1 status bits  localhost" 
		echo
		echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
		echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
		echo "Commande : "$CMD
		echo "Commande : "$CMD_WIN
		res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
		retval=$?
		echo $res > $FIC_TMP
		if grep -c "$RES_ATTENDU" $FIC_TMP > /dev/null; then
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]  / OK (RES("$res") / RES_ATTENDU("$RES_ATTENDU"))"
		else
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]  / ERREUR "$NUM_ERR" : RESULTAT ("$res") DIFFERENT DU RESULTAT ATTENDU ("$RES_ATTENDU")"
				exit $NUM_ERR
		fi
		echo
 
		ETAPE=Etape3
		SRV=sw11203
		USER=
		CMD="database stop test MSSQL sw11203" 
		CMD_WIN="powershell ./database.ps1 stop test MSSQL sw11203" 
		echo
		echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
		echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
		echo "Commande : "$CMD
		echo "Commande : "$CMD_WIN
		res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
		retval=$?
		echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
		echo "FIN : $(date +'%d/%m/%Y %H:%M:%S')"
		echo
 
		ETAPE=Etape4
		SRV=sw11203
		USER=
		CMD="database status test MSSQL sw11203" 
		CMD_WIN="powershell ./database.ps1 status test MSSQL sw11203" 
		echo
		echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
		echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
		echo "Commande : "$CMD
		echo "Commande : "$CMD_WIN
		res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
		retval=$?
		echo $res > $FIC_TMP
		if grep -c "$RES_ATTENDU" $FIC_TMP > /dev/null; then
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]  / OK (RES("$res") / RES_ATTENDU("$RES_ATTENDU"))"
		else
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]  / ERREUR "$NUM_ERR" : RESULTAT ("$res") DIFFERENT DU RESULTAT ATTENDU ("$RES_ATTENDU")"
				exit $NUM_ERR
		fi
		echo
 
}
 
######################################## RELANCE ########################################
Arret_App()
{
		NB_ETAPE=4
 
		ETAPE=Etape1
		SRV=sw11203
		USER=
		CMD="database start test MSSQL sw11203" 
		CMD_WIN="powershell ./database.ps1 start test MSSQL sw11203" 
		echo
		echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
		echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
		echo "Commande : "$CMD
		echo "Commande : "$CMD_WIN
		res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
		retval=$?
		echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
		echo "FIN : $(date +'%d/%m/%Y %H:%M:%S')"
		echo
 
		ETAPE=Etape2
		SRV=sw11203
		USER=
		CMD="database status test MSSQL sw11203" 
		CMD_WIN="powershell ./database.ps1 status test MSSQL sw11203" 
		echo
		echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
		echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
		echo "Commande : "$CMD
		echo "Commande : "$CMD_WIN
		res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
		retval=$?
		echo $res > $FIC_TMP
		if grep -c "$RES_ATTENDU" $FIC_TMP > /dev/null; then
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]  / OK (RES("$res") / RES_ATTENDU("$RES_ATTENDU"))"
		else
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]  / ERREUR "$NUM_ERR" : RESULTAT ("$res") DIFFERENT DU RESULTAT ATTENDU ("$RES_ATTENDU")"
				exit $NUM_ERR
		fi
		echo
 
		ETAPE=Etape3
		SRV=localhost
		USER=
		CMD="service start bits  localhost" 
		CMD_WIN="powershell ./service.ps1 start bits  localhost" 
		echo
		echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
		echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
		echo "Commande : "$CMD
		echo "Commande : "$CMD_WIN
		res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
		retval=$?
		echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
		echo "FIN : $(date +'%d/%m/%Y %H:%M:%S')"
		echo
 
		ETAPE=Etape4
		SRV=localhost
		USER=
		CMD="service status bits  localhost" 
		CMD_WIN="powershell ./service.ps1 status bits  localhost" 
		echo
		echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
		echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
		echo "Commande : "$CMD
		echo "Commande : "$CMD_WIN
		res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
		retval=$?
		echo $res > $FIC_TMP
		if grep -c "$RES_ATTENDU" $FIC_TMP > /dev/null; then
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]  / OK (RES("$res") / RES_ATTENDU("$RES_ATTENDU"))"
		else
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]  / ERREUR "$NUM_ERR" : RESULTAT ("$res") DIFFERENT DU RESULTAT ATTENDU ("$RES_ATTENDU")"
				exit $NUM_ERR
		fi
		echo
 
}
 
######################################## Tests ########################################
Tests_App()
{
		echo
		SRV="localhost"
		USER=
		CMD="service status bits  localhost" 
		CMD_WIN="powershell ./service.ps1 status bits  localhost" 
		SSA : "$APPLI"
		Serveur : "$SRV"
		Commande : "$CMD_WIN"
		res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
		Resultat : "$res"
		echo

		echo
		SRV="sw11203"
		USER=
		CMD="database status test MSSQL sw11203" 
		CMD_WIN="powershell ./database.ps1 status test MSSQL sw11203" 
		SSA : "$APPLI"
		Serveur : "$SRV"
		Commande : "$CMD_WIN"
		res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
		Resultat : "$res"
		echo

		echo
		SRV="sw11203"
		USER=
		CMD="database status test MSSQL sw11203" 
		CMD_WIN="powershell ./database.ps1 status test MSSQL sw11203" 
		SSA : "$APPLI"
		Serveur : "$SRV"
		Commande : "$CMD_WIN"
		res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
		Resultat : "$res"
		echo

		echo
		SRV="localhost"
		USER=
		CMD="service status bits  localhost" 
		CMD_WIN="powershell ./service.ps1 status bits  localhost" 
		SSA : "$APPLI"
		Serveur : "$SRV"
		Commande : "$CMD_WIN"
		res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
		Resultat : "$res"
		echo

}
 
######################################## MAIN ########################################
echo "# | Version TRANSFORMERS : 19/05/2021"
echo "# | Version PARPRE : 19/05/2021"
echo "# | Version EBO : 19/05/2021"
echo "# | Date creation : 19/05/2021"
case $TYPE_ACTION in
		Arret)
				Arret_App
				;;
				
		Relance)
				Relance_App
				;;
				
		Tests)
				Tests_App
				;;
				
esac

echo "FIN DU TRAITEMENT" >>$FIC_ETAT
