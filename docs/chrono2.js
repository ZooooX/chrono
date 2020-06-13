/*Fonctions */
//creation dynamique d'un chrono
//constructeur de l'objet Chrono
//startChrono
//stopChrono
//pauseChrono
//raffraichir affichage du chrono

/*attributs de l'objet chrono*/
//boutons stop , pause , start
//fonctions associées




/*Evenements*/
//clic sur start
//clic sur pause
//clic sur stop

/************************************************************/
var nombreChrono=0; //Nombre de chrono actuel
var btnValues = ["Start","Pause","Stop","Reprendre"];  // VAleurs possibles de boutons
var chronos=[];  // Tableau contenant les chronoHTML

//constantes d'état du chronometre
const eteint=0;
const enCours=1;
const repris=2;
const enPause=3;

window.addEventListener("load",function (){
  document.getElementById('nouveauChrono').addEventListener("click",createChrono);
});


class Chronometer {
  constructor() {
    this.timeElapsed = 0;  //temps écoulé du chronomètre
    this.actualTime =0;
  }


  count(pSpan){
     // algo de calcul de nombre heures, minutes et secondes écoulées
     var startTime = new Date();
     var self=this;
     this.decompte = setInterval(function() {
        // 1- Convertir en secondes :
        var seconds = Math.round((new Date().getTime() - startTime.getTime()) / 1000 + self.timeElapsed );
        //var seconds = self.timeElapsed;

        // 2- Extraire les heures:
        var hours = parseInt( seconds / 3600 );
        seconds = seconds % 3600; // secondes restantes
        // 3- Extraire les minutes:
        var minutes = parseInt( seconds / 60 );
        seconds = seconds % 60; // secondes restantes
        // 4- afficher dans le span
        pSpan.innerHTML = ajouteUnZero(hours)+":"+ajouteUnZero(minutes)+":"+ajouteUnZero(seconds);
        // 5- incrémenter le nombre de secondes
        self.actualTime +=1;
        //self.timeElapsed +=1;
      }, 1000); // fin de function anonyme dans setInterval()
  }

  pauseCount(){
    clearInterval(this.decompte);
    this.timeElapsed=this.actualTime;
  }

  stopCount(){
    clearInterval(this.decompte);
    this.timeElapsed=0;
    this.actualTime=0;
  }
}


class ChronoHTML {
  constructor(pNC) {
    this.nbChrono = pNC; // Numéro du chronometre

    this.btnStart   =document.getElementById('btn'+0+''+this.nbChrono);
    this.btnPause   =document.getElementById('btn'+1+''+this.nbChrono);
    this.btnStop    =document.getElementById('btn'+2+''+this.nbChrono);
    this.spanTimer  =document.getElementById('timer'+this.nbChrono);
    this.btnDelete  = document.getElementById('chronoDeleteButton'+this.nbChrono);

    this.chronoState = eteint; // etat du chronomètre ??? on est dans l'element??? pas dans le chrono mais pourquoi pas
    this.chrono = new Chronometer(); //Chrono fonctionnel
  }

  //initialise les evenement btnStart et btnDelete
  initEvent(){
    var tutu = this;
    console.log(this);
    this.btnStart.addEventListener("click",this.startTimer);
    this.btnDelete.addEventListener('click',removeChrono);
  }

  startTimer = () => {
    console.log(this);
    if (this.chronoState==eteint) {
      console.log('salut :'+this.chronoState);
      this.chronoState=enCours;
      this.chrono.count(this.spanTimer);
      this.btnPause.addEventListener("click",this.pauseTimer);
      this.btnStop.addEventListener("click",this.stopTimer);
      rafraichir(this);
      this.btnStart.removeEventListener("click",this.startTimer);
    }
  }

  pauseTimer = () => {
    if (this.chronoState==enCours || this.chronoState==repris){
      this.chronoState=enPause;
      this.chrono.pauseCount();
    }
    else {
      this.chrono.count(this.spanTimer);
      this.chronoState=repris;
    }
    rafraichir(this);
  }

  stopTimer = () => {
    this.btnPause.removeEventListener("click",this.pauseTimer);
    this.btnStop.removeEventListener("click",this.stopTimer);
    this.chrono.stopCount();
    this.btnStart.addEventListener("click",this.startTimer);
    this.chronoState=eteint;
    rafraichir(this);
  }
}


//Création du html chrono
//-- Boutons de chaque chrono ont pour id 'btn ' +  0 pour start 1 pour Pause et 2 pour Stop + le nombre de chrono
//-- Exemple : id du bouton pause du 3 eme chrono = btn23
//-- Le timer a pour id 'timer' + nombre du chrono
//-- Exemple timer du chrono 4 = timer4
function createHTMLChrono(){
  var main = document.getElementById('chronos');
  var chronoContainer = document.createElement('fieldset');
  chronoContainer.setAttribute("id",'chronoContainer'+nombreChrono);
  main.appendChild(chronoContainer);
  var chronoLegend = document.createElement('legend');
  chronoContainer.appendChild(chronoLegend);
  var chronoDeleteButton = document.createElement('input');
  chronoDeleteButton.setAttribute('class','chronoDeleteButton');
  chronoDeleteButton.setAttribute('id','chronoDeleteButton'+nombreChrono);
  chronoDeleteButton.setAttribute('type','button');
  chronoDeleteButton.setAttribute('value','x');
  chronoDeleteButton.nbDelete = nombreChrono;
  chronoContainer.appendChild(chronoDeleteButton);
  chronoLegend.innerHTML = "Chrono " + nombreChrono;
  var btns = document.createElement('div');
  btns.setAttribute('class','btns');
  chronoContainer.appendChild(btns);

  for (var i = 0; i < 3; i++) {
    var btn = document.createElement('input');
    btn.setAttribute("type","button");
    btn.setAttribute("id","btn"+i+""+nombreChrono);
    btn.setAttribute("value",btnValues[i]);
    if (i>0) {
      btn.setAttribute("class","hide");
    }
    btn.classList.add('btn');
    btns.appendChild(btn);
  }
  var timer = document.createElement('span');
  timer.setAttribute("id","timer"+nombreChrono);
  timer.innerHTML="00:00:00";
  chronoContainer.appendChild(timer);
}


// Creer un nouveau chrono (appelé sur le clic bouton nouveau chrono)
function createChrono(){
  nombreChrono+=1;
  createHTMLChrono();
  chronos[nombreChrono-1] = new ChronoHTML(nombreChrono);
  chronos[nombreChrono-1].initEvent();
}

//A le bouton clické comme this. + Ne supprime pas l'objet mais que le composant graphique.
function removeChrono (){
  var nbChrono = this.nbDelete;
  document.getElementById('chronos').removeChild(document.getElementById('chronoContainer'+nbChrono)); //Supprime le fieldset entier de la page
}

//ajoute un 0 avant le temps si temps a 1 chiffre .
function ajouteUnZero(temps){
  if(temps<10){
    return("0"+temps);
  }
  else {
    return(temps);
  }
}


//gere tout l'affichage du timer en fonction de l'etat du timer
function rafraichir(unChronoHTML){
  if (unChronoHTML.chronoState==enCours) {
    unChronoHTML.btnStart.classList.toggle('hide');
    unChronoHTML.btnPause.classList.toggle('hide');
    unChronoHTML.btnStop.classList.toggle('hide');
    unChronoHTML.spanTimer.classList.add('enCours');
  }
  else if (unChronoHTML.chronoState==repris) {
    unChronoHTML.spanTimer.classList.add('enCours');
    unChronoHTML.spanTimer.classList.remove('enPause');
    unChronoHTML.btnPause.value="Pause"
  }
  else if (unChronoHTML.chronoState==enPause) {
    unChronoHTML.btnPause.value="Reprendre";
    unChronoHTML.spanTimer.classList.remove('enCours');
    unChronoHTML.spanTimer.classList.add('enPause');
  }
  else if(unChronoHTML.chronoState==eteint) {
    unChronoHTML.btnStart.classList.toggle('hide');
    unChronoHTML.btnPause.classList.toggle('hide');
    unChronoHTML.btnStop.classList.toggle('hide');
    unChronoHTML.spanTimer.innerHTML ="00:00:00";
    unChronoHTML.spanTimer.classList.remove('enPause');
    unChronoHTML.spanTimer.classList.remove('enCours');
    unChronoHTML.btnPause.value="Pause";
  }
}
