TYPE_ACTION=$1
TYPE_ENVIRONNEMENT=$2
BUILD_JENKINS_USER=$3
LOCAL_DIR=/tmp
LOG_DIR=/tmp
TIME_OUT=600
################################ VARIABLES ################################
APPLI=APP2747_TREMA
case $TYPE_ENVIRONNEMENT in 
		PROD)
				sw50648=sw50648
				sw50649=sw50649
				P00028E0=P00028E0
				REBOND_WIN=sw15298
				;;
		HPROD)
				sw50648=sw50639
				sw50649=sw50640
				P00028E0=H00044E0
				REBOND_WIN=sw15272
				;;
		HPROD2)
				sw50648=
				sw50649=
				P00028E0=
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
		NB_ETAPE=6
 
		#Les environnements sur lesquels vont s'executer la commande
		$ENVS=(PROD HPROD HPROD2 DEV)
		
		if [[ ${ENVS[@]} =~ $TYPE_ENVIRONNEMENT ]] 
		then
				ETAPE=Etape1
				SRV=sw50649
				USER=
				CMD="database START P00028E0 mssql sw50649" 
				CMD_WIN="powershell ./database.ps1 START P00028E0 mssql sw50649" 
				echo
				echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
				echo "Commande : "$CMD_WIN
				res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
				retval=$?
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
				echo "FIN : $(date +'%d/%m/%Y %H:%M:%S')"
				echo
		fi
		
		#Les environnements sur lesquels vont s'executer la commande
		$ENVS=(PROD HPROD HPROD2 DEV)
		
		if [[ ${ENVS[@]} =~ $TYPE_ENVIRONNEMENT ]] 
		then
				ETAPE=Etape2
				SRV=sw50649
				USER=
				CMD="database STATUS P00028E0 mssql sw50649" 
				CMD_WIN="powershell ./database.ps1 STATUS P00028E0 mssql sw50649" 
				echo
				echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
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
		fi
		
		#Les environnements sur lesquels vont s'executer la commande
		$ENVS=(PROD HPROD HPROD2 DEV)
		
		if [[ ${ENVS[@]} =~ $TYPE_ENVIRONNEMENT ]] 
		then
				ETAPE=Etape3
				SRV=sw50648
				USER=
				CMD="service START World Wide Web Publishing Service  sw50648" 
				CMD_WIN="powershell ./service.ps1 START World Wide Web Publishing Service  sw50648" 
				echo
				echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
				echo "Commande : "$CMD_WIN
				res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
				retval=$?
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
				echo "FIN : $(date +'%d/%m/%Y %H:%M:%S')"
				echo
		fi
		
		#Les environnements sur lesquels vont s'executer la commande
		$ENVS=(PROD HPROD HPROD2 DEV)
		
		if [[ ${ENVS[@]} =~ $TYPE_ENVIRONNEMENT ]] 
		then
				ETAPE=Etape4
				SRV=sw50648
				USER=
				CMD="service STATUS World Wide Web Publishing Service  sw50648" 
				CMD_WIN="powershell ./service.ps1 STATUS World Wide Web Publishing Service  sw50648" 
				echo
				echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
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
		fi
		
		#Les environnements sur lesquels vont s'executer la commande
		$ENVS=(PROD HPROD HPROD2 DEV)
		
		if [[ ${ENVS[@]} =~ $TYPE_ENVIRONNEMENT ]] 
		then
				ETAPE=Etape5
				SRV=sw50648
				USER=
				CMD="service START IIS Admin Service  sw50648" 
				CMD_WIN="powershell ./service.ps1 START IIS Admin Service  sw50648" 
				echo
				echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
				echo "Commande : "$CMD_WIN
				res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
				retval=$?
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
				echo "FIN : $(date +'%d/%m/%Y %H:%M:%S')"
				echo
		fi
		
		#Les environnements sur lesquels vont s'executer la commande
		$ENVS=(PROD HPROD HPROD2 DEV)
		
		if [[ ${ENVS[@]} =~ $TYPE_ENVIRONNEMENT ]] 
		then
				ETAPE=Etape6
				SRV=sw50648
				USER=
				CMD="service STATUS IIS Admin Service  sw50648" 
				CMD_WIN="powershell ./service.ps1 STATUS IIS Admin Service  sw50648" 
				echo
				echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
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
		fi
		
}
 
######################################## RELANCE ########################################
Arret_App()
{
		NB_ETAPE=10
 
		#Les environnements sur lesquels vont s'executer la commande
		$ENVS=(PROD HPROD HPROD2 DEV)
		
		if [[ ${ENVS[@]} =~ $TYPE_ENVIRONNEMENT ]] 
		then
				ETAPE=Etape1
				SRV=sw50648
				USER=
				CMD="service STOP IIS Admin Service  sw50648" 
				CMD_WIN="powershell ./service.ps1 STOP IIS Admin Service  sw50648" 
				echo
				echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
				echo "Commande : "$CMD_WIN
				res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
				retval=$?
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
				echo "FIN : $(date +'%d/%m/%Y %H:%M:%S')"
				echo
		fi
		
		#Les environnements sur lesquels vont s'executer la commande
		$ENVS=(PROD HPROD HPROD2 DEV)
		
		if [[ ${ENVS[@]} =~ $TYPE_ENVIRONNEMENT ]] 
		then
				ETAPE=Etape2
				SRV=sw50648
				USER=
				CMD="service STATUS IIS Admin Service  sw50648" 
				CMD_WIN="powershell ./service.ps1 STATUS IIS Admin Service  sw50648" 
				echo
				echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
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
		fi
		
		#Les environnements sur lesquels vont s'executer la commande
		$ENVS=(PROD HPROD HPROD2 DEV)
		
		if [[ ${ENVS[@]} =~ $TYPE_ENVIRONNEMENT ]] 
		then
				ETAPE=Etape3
				SRV=sw50648
				USER=
				CMD="service STOP World Wide Web Publishing Service  sw50648" 
				CMD_WIN="powershell ./service.ps1 STOP World Wide Web Publishing Service  sw50648" 
				echo
				echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
				echo "Commande : "$CMD_WIN
				res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
				retval=$?
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
				echo "FIN : $(date +'%d/%m/%Y %H:%M:%S')"
				echo
		fi
		
		#Les environnements sur lesquels vont s'executer la commande
		$ENVS=(PROD HPROD HPROD2 DEV)
		
		if [[ ${ENVS[@]} =~ $TYPE_ENVIRONNEMENT ]] 
		then
				ETAPE=Etape4
				SRV=sw50648
				USER=
				CMD="service STATUS World Wide Web Publishing Service  sw50648" 
				CMD_WIN="powershell ./service.ps1 STATUS World Wide Web Publishing Service  sw50648" 
				echo
				echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
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
		fi
		
		#Les environnements sur lesquels vont s'executer la commande
		$ENVS=(PROD HPROD HPROD2 DEV)
		
		if [[ ${ENVS[@]} =~ $TYPE_ENVIRONNEMENT ]] 
		then
				ETAPE=Etape5
				SRV=sw50649
				USER=
				CMD="database STOP P00028E0  sw50649" 
				CMD_WIN="powershell ./database.ps1 STOP P00028E0  sw50649" 
				echo
				echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
				echo "Commande : "$CMD_WIN
				res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
				retval=$?
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
				echo "FIN : $(date +'%d/%m/%Y %H:%M:%S')"
				echo
		fi
		
		#Les environnements sur lesquels vont s'executer la commande
		$ENVS=(PROD HPROD HPROD2 DEV)
		
		if [[ ${ENVS[@]} =~ $TYPE_ENVIRONNEMENT ]] 
		then
				ETAPE=Etape6
				SRV=sw50649
				USER=
				CMD="database STATUS P00028E0  sw50649" 
				CMD_WIN="powershell ./database.ps1 STATUS P00028E0  sw50649" 
				echo
				echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
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
		fi
		
		#Les environnements sur lesquels vont s'executer la commande
		$ENVS=(PROD HPROD HPROD2 DEV)
		
		if [[ ${ENVS[@]} =~ $TYPE_ENVIRONNEMENT ]] 
		then
				ETAPE=Etape7
				SRV=sw50649
				USER=
				CMD="script    sw50649" 
				CMD_WIN="powershell ./script.ps1    sw50649" 
				echo
				echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
				echo "Commande : "$CMD_WIN
				res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
				retval=$?
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
				echo "FIN : $(date +'%d/%m/%Y %H:%M:%S')"
				echo
		fi
		
		#Les environnements sur lesquels vont s'executer la commande
		$ENVS=(PROD HPROD HPROD2 DEV)
		
		if [[ ${ENVS[@]} =~ $TYPE_ENVIRONNEMENT ]] 
		then
				ETAPE=Etape8
				SRV=sw50649
				USER=
				CMD="ps grep ef " 
				CMD="su - $USER -c $CMD " 
				echo
				echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
				echo "Commande : "$CMD
				res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q root@$SRV "$CMD")
				retval=$?
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
				echo "FIN : $(date +'%d/%m/%Y %H:%M:%S')"
				echo
		fi
		
		#Les environnements sur lesquels vont s'executer la commande
		$ENVS=(PROD HPROD HPROD2 DEV)
		
		if [[ ${ENVS[@]} =~ $TYPE_ENVIRONNEMENT ]] 
		then
				ETAPE=Etape9
				SRV=sw50649
				USER=
				CMD="ps grep ef" 
				CMD="su - $USER -c $CMD " 
				echo
				echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
				echo "Commande : "$CMD
				res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q root@$SRV "$CMD")
				retval=$?
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
				echo "FIN : $(date +'%d/%m/%Y %H:%M:%S')"
				echo
		fi
		
		#Les environnements sur lesquels vont s'executer la commande
		$ENVS=(PROD HPROD HPROD2 DEV)
		
		if [[ ${ENVS[@]} =~ $TYPE_ENVIRONNEMENT ]] 
		then
				ETAPE=Etape10
				SRV=sw50649
				USER=
				CMD="process stop java.exe  sw50649" 
				CMD_WIN="powershell ./process.ps1 stop java.exe  sw50649" 
				echo
				echo "DEBUT : $(date +'%d/%m/%Y %H:%M:%S')"
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
				echo "Commande : "$CMD_WIN
				res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
				retval=$?
				echo "Serveur "$SRV" - ["$TYPE_ACTION":"$APPLI":"$ETAPE"/"$NB_ETAPE"]" 
				echo "FIN : $(date +'%d/%m/%Y %H:%M:%S')"
				echo
		fi
		
}
 
######################################## Tests ########################################
Tests_App()
{
		echo
		SRV="sw50648"
		USER=
		CMD="service STATUS IIS Admin Service  sw50648" 
		CMD_WIN="powershell ./service.ps1 STATUS IIS Admin Service  sw50648" 
		SSA : "$APPLI"
		Serveur : "$SRV"
		Commande : "$CMD_WIN"
		res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
		Resultat : "$res"
		echo

		echo
		SRV="sw50648"
		USER=
		CMD="service STATUS World Wide Web Publishing Service  sw50648" 
		CMD_WIN="powershell ./service.ps1 STATUS World Wide Web Publishing Service  sw50648" 
		SSA : "$APPLI"
		Serveur : "$SRV"
		Commande : "$CMD_WIN"
		res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
		Resultat : "$res"
		echo

		echo
		SRV="sw50649"
		USER=
		CMD="database STATUS P00028E0  sw50649" 
		CMD_WIN="powershell ./database.ps1 STATUS P00028E0  sw50649" 
		SSA : "$APPLI"
		Serveur : "$SRV"
		Commande : "$CMD_WIN"
		res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
		Resultat : "$res"
		echo

		echo
		SRV="sw50649"
		USER=
		CMD="database STATUS P00028E0 mssql sw50649" 
		CMD_WIN="powershell ./database.ps1 STATUS P00028E0 mssql sw50649" 
		SSA : "$APPLI"
		Serveur : "$SRV"
		Commande : "$CMD_WIN"
		res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
		Resultat : "$res"
		echo

		echo
		SRV="sw50648"
		USER=
		CMD="service STATUS World Wide Web Publishing Service  sw50648" 
		CMD_WIN="powershell ./service.ps1 STATUS World Wide Web Publishing Service  sw50648" 
		SSA : "$APPLI"
		Serveur : "$SRV"
		Commande : "$CMD_WIN"
		res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
		Resultat : "$res"
		echo

		echo
		SRV="sw50648"
		USER=
		CMD="service STATUS IIS Admin Service  sw50648" 
		CMD_WIN="powershell ./service.ps1 STATUS IIS Admin Service  sw50648" 
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
