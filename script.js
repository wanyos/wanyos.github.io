
let currentDate = new Date();

let txt_year = document.getElementById('txt_year');
let cbo_grupo = document.getElementById('cbo_grupo');
let scbo_ubgrupo = document.getElementById('cbo_subgrupo');

let dias_semana = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
let tabla = Array.from(document.querySelectorAll('.tabla-calendario > div > div'));
let btn = document.getElementById('btn_buscar');
btn.addEventListener('click', ()=>nuevaFecha());

/*Escribe el calendario con la fecha actual de sistema */
writeMonths();

function writeMonths() {
     //escribir en cada mes sus dias de la semana
     let com;
     for(let a = 0; a < tabla.length; a++){
        com = tabla[a];
        for (let i = 0; i < dias_semana.length; i++) {
          com.innerHTML += ` <div class="dates_week"> ${dias_semana[i]} </div> `;
        }
        for(let i = startDay(a+1); i > 0; i--){
          com.innerHTML += ` <div class="dates_week"></div> `;
        }
        for(let i = 1; i <= getTotalDays(a+1); i++){
          //si son libres se le añade la clase libres

          //si son subgrupo clase sub
          
          //para los subgrupos de fines de semana amarillo=sub1 azul=sub2
           com.innerHTML += ` <div class="dates_week">${i}</div> `;
        }
     }  
}


/*total dias de mes*/
function getTotalDays(month){
  if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12){
    return 31;
  } else if (month == 4 || month == 6 || month == 9 || month == 11) {
    return 30;
  } else {
    return isLeap() ? 29 : 28;
  }
}

/*Año bisiesto*/
function isLeap(){
  return ((currentDate.getFullYear() % 100 !== 0) && (currentDate.getFullYear() % 4 == 0)
          || (currentDate.getFullYear() % 400 == 0));
}

/*dia que empieza el mes*/
function startDay(monthNumber){
  let start = new Date(currentDate.getFullYear()+'-'+monthNumber+'-'+1);
  return ((start.getDay()-1) == -1) ? 6 : start.getDay()-1;
}

function nuevaFecha(){
  let dates = Array.from(document.getElementsByClassName("dates_week"));
  for(let i = 0; i < dates.length; i++){
      dates[i].textContent = '';
  }
  let nuevo_year = txt_year.value;
  currentDate = new Date(nuevo_year+'-'+01+'-'+01);
  writeMonths();
}
