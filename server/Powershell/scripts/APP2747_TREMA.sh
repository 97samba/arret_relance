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
sw50648.toUpper()=sw50648
sw50649.toUpper()=sw50649
P00028E0.toUpper()=P00028E0
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
sw50648.toUpper()=sw50648
sw50649.toUpper()=sw50649
P00028E0.toUpper()=P00028E0
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
