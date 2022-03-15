
let currentDate = new Date();

let txt_year = document.getElementById('txt_year');
let cbo_grupo = document.getElementById('cbo_grupo');
let cbo_subgrupo = document.getElementById('cbo_subgrupo');

let dias_semana = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
let tabla = Array.from(document.querySelectorAll('.tabla-calendario > div > div'));
let btn = document.getElementById('btn_buscar');
btn.addEventListener('click', () => nuevaFecha());

//Variables usadas para los libres
let day_init_year;
let total_libres;
let secuencia_libres;
let total_trabajo;
let indice_trabajo;
let secuencia_trabajo;
let primer_libre_mes;
const fechas_grupos = [new Date('2020-01-01'), new Date('2020-01-03'), new Date('2020-01-04'), new Date('2020-01-05'), new Date('2020-01-08')];

//arrays para el calculo de los dias subgrupo
//se cambian los subgrupos a partir del año 2020
//se crea un array por cada grupo y cada posición del array corresponde a su letra a,b,c,d...
//se guarda en cada posición la fecha de inicio de su respectiva letra
const grupo1 = [new Date(2020, 2, 4), new Date(2020, 1, 3), new Date(2020, 0, 9), new Date(2020, 1, 13),
  new Date(2020, 2, 19), new Date(2020, 1, 4), new Date(2020, 2, 10), new Date(2020, 0, 29)];
  
  const grupo2 = [new Date(2020, 1, 26), new Date(2020, 0, 27), new Date(2020, 0, 2), new Date(2020, 1, 6),
  new Date(2020, 2, 12), new Date(2020, 0, 28), new Date(2020, 2, 3), new Date(2020, 0, 22)];
  
  const grupo3 = [new Date(2020, 1, 19), new Date(2020, 2, 25), new Date(2020, 1, 24), new Date(2020, 0, 30),
  new Date(2020, 2, 5), new Date(2020, 0, 21), new Date(2020, 1, 25), new Date(2020, 0, 15)];
  
  const grupo4 = [new Date(2020, 1, 12), new Date(2020, 0, 13), new Date(2020, 1, 17), new Date(2020, 1, 23),
  new Date(2020, 1, 27), new Date(2020, 0, 14), new Date(2020, 1, 18), new Date(2020, 2, 24)];
  
  const grupo5 = [new Date(2020, 1, 5), new Date(2020, 2, 11), new Date(2020, 1, 10), new Date(2020, 2, 16),
  new Date(2020, 1, 20), new Date(2020, 2, 26), new Date(2020, 1, 11), new Date(2020, 2, 17)];


//----------------------------------------------------------------------------------------------------------------------------------------------------------------

/*Escribe el calendario con la fecha actual del sistema */
writeMonths();

/**Es llamada cada vez que pulsamos 'buscar' e inicia un nuevo calendario */
function writeMonths() {
  let year = currentDate.getFullYear();
  let grupo = cbo_grupo.value;
  let subgrupo = cbo_subgrupo.value;

  //establee el año fecha del sistema
  txt_year.value = year;

  //resetear las variables para los libres
  restablecerVariablesLibres(year, grupo);

   //obtener la lista de dias subgrupo del año
   const lista_dias_subgrupo = getListaDiasSubgrupo(grupo, subgrupo, year);

  //escribir en cada mes sus dias de la semana
  let com;
  let dia_subgrupo = null;
  for (let a = 0; a < tabla.length; a++) {
    com = tabla[a];

    //añade las etiquetas del día de la semana
    for (let i = 0; i < dias_semana.length; i++) {
      com.innerHTML += ` <div class="dates_week color_dias"> ${dias_semana[i]} </div> `;
    } 

    //deja los espacios en blanco antes de escribir el día 1 de cada mes
    let dia_inicial = startDay(a + 1);
    for (let i = dia_inicial; i > 0; i--) {
      com.innerHTML += ` <div class="dates_week"></div> `;
    }

    //escribe los números de los días
    let total_dias_mes = getTotalDays(a + 1);
    
    for (let i = 1; i <= total_dias_mes; i++) {
      let tipo_dia;

      //si son libres se le añade la clase libres
      tipo_dia = establecerLibres(a, i);
        
      //si son subgrupo clase sub, el tipo_dia no debe estar definido como libre
        if(tipo_dia == undefined){
          if(dia_subgrupo == undefined){
              dia_subgrupo = lista_dias_subgrupo.shift();
          }
          tipo_dia = comprobarDiaSubgrupo(dia_subgrupo, a, i);  //dia, mes, dia_del_mes
          if(tipo_dia != undefined){
            dia_subgrupo = undefined;
          }
        }

      //para los subgrupos de fines de semana amarillo=sub1 azul=sub2
      if(tipo_dia == undefined){

      }
        
      com.innerHTML += ` <div class="dates_week ${tipo_dia}">${i}</div> `;
    }
  }
}




/**---------------------------------------------------  Calculos Libres --------------------------------------- */
/**
 * Establece si un día es un libre 
 * @param {*} a equivale al mes
 * @param {*} i equivale al dia del mes
 * @returns clase libres para colorear el dia en verde
 */
function establecerLibres(a, i) {
  if (a == 0 && i == day_init_year) {
    primer_libre_mes = true;
    secuencia_libres--;
    return 'libres';
  } else if (primer_libre_mes) {
    if (secuencia_libres > 0) {
      secuencia_libres--;
      return 'libres';
    } else {
      secuencia_trabajo--;
    }
  } 

  if (secuencia_libres == 0 && secuencia_trabajo == 0) {
    if (total_libres == 2) {
      secuencia_libres = 3;
    } else {
      secuencia_libres = 2;
    }
    total_libres = secuencia_libres;

    if (indice_trabajo >= 3) {
      indice_trabajo = -1;
    }
    secuencia_trabajo = total_trabajo[++indice_trabajo];
  }
}

/**
 * Inicia las variables que se usan para el calculo de libres
 */
function restablecerVariablesLibres(year, grupo) {
  primer_libre_mes = false;
  let fecha_grupo_2020 = getFechaGrupo(year, grupo);
  let fecha_init = getFechaInitLibre(fecha_grupo_2020);
  let ciclo_libres = fecha_init.getDay();

  if (ciclo_libres == 3 || ciclo_libres == 6) {
    total_libres = 2;
  } else {
    total_libres = 3;
  }

  day_init_year = fecha_init.getDate();
  secuencia_libres = total_libres;
  total_trabajo = getTotalDiasTrabajo(ciclo_libres);
  indice_trabajo = 0;
  secuencia_trabajo = total_trabajo[indice_trabajo];
}


/**Establece la secuencia de dias de trabajo
 * Se tiene en cuenta a partir del primer libre que es el parametro
 */
function getTotalDiasTrabajo(primer_libre) {
  let array;
  switch (primer_libre) {
    case 3: array = [7, 5, 6, 7]; break;
    case 5: array = [5, 6, 7, 7]; break;
    case 6: array = [6, 7, 7, 5]; break;
    case 0: array = [7, 7, 5, 6]; break;
  }
  return array;
}


/**Devuelve fecha del mismo libre que inicio en 2020 */
function getFechaGrupo(year, grupo) {
  let fecha_init = fechas_grupos[grupo - 1];
  let fecha_fin = new Date(year, 0, 1);

  let diff = (fecha_fin.getTime() - fecha_init.getTime()) / 1000;
  diff /= (60 * 60 * 24);
  let re = parseFloat(diff / 35);
  let p_dec = parseFloat(re % 1);
  let t_dias = parseFloat(0.35 * (1 - p_dec)) * 100;
  fecha_fin.setDate(fecha_fin.getDate() + (Math.round(t_dias)));

  return fecha_fin;
}


/**Calcula la primera fecha del año que se empieza a librar por su grupo */
function getFechaInitLibre(fecha_grupo) {
  let nueva_fecha = new Date(fecha_grupo);
  let retroceso = new Array(2);
  retroceso[0] = [10, 8, 8, 9];   //empieza en miercoles(3)
  retroceso[1] = [9, 10, 8, 8];   //empieza en viernes(5)
  retroceso[2] = [8, 9, 10, 8];   //empieza en sabado(6)
  retroceso[3] = [8, 8, 9, 10];   //empieza en domingo(0)

  let dia_semana = fecha_grupo.getDay();
  let fila;
  let columna = 0;
  switch (dia_semana) {
    case 3: fila = 0; break;
    case 5: fila = 1; break;
    case 6: fila = 2; break;
    case 0: fila = 3; break;
  }

  let continuar = true;
  do {
    nueva_fecha.setDate(fecha_grupo.getDate() - retroceso[fila][columna++]);
    if (nueva_fecha.getFullYear() == fecha_grupo.getFullYear()) {
      fecha_grupo = new Date(nueva_fecha);
    } else {
      continuar = false;
    }
    if (columna > 3) {
      columna = 0;
    }
  } while (continuar);
  return fecha_grupo;
}



/**---------------------------------------------------  Calculos Dias Subgrupo --------------------------------------- */

/**
 * Comprueba si es un dia de subgrupo, si es asi se le añade la classe del css que pinta los dias subgrupo
 * @param {*} dia_subgrupo 
 * @param {*} a 
 * @param {*} i 
 */
 function comprobarDiaSubgrupo(dia_subgrupo, a, i){
    let dia = new Date(dia_subgrupo);
    let mes = dia.getMonth();
    let dia_mes = dia.getDate();
    if(mes == a && dia_mes == i){
        return 'sub';
    }
    return undefined;
}


/**
* Se cambian los dias de subgrupo apartir del año 2020
* calcula le primer día de subgrupo y va añdiendo a la lista el resto de dias del año
* @param grupo_libres (int)
* @param letra        (String)
* @param year         (int)
* @return lista de fechas con los dias de subgrupo
*/
function getListaDiasSubgrupo(grupo_libres, letra, year) {
  const lista_subgrupo = [];
  //distancias entre dias, la secuencia de dias es jueves, lunes, miercoles y martes
  //el array sigue la misma secuencia
  let secu = [60, 65, 76, 79];
  let l = getLetraSubgrupo(letra);
  let fecha_init_subgrupo = getFechaSubgrupoNuevo(grupo_libres, l);         //obtiene la primera fecha subgrupo del año 2020
  let fecha_init = getFechaInitYearSubgrupo(fecha_init_subgrupo, year);     //calcula el primer libre subgrupo del año del parametro
  let day = fecha_init.getDay();

  let contador = 0;
  if (day == 1) {
    contador = 1;
  }
  if (day == 3) {
    contador = 2;
  }
  if (day == 2) {
    contador = 3;
  }
  //si es jueves contador vale 0
  while (fecha_init.getFullYear() == year) {
    if (contador > 3) {
      contador = 0;
    }
    lista_subgrupo.push(new Date(fecha_init));
    fecha_init.setDate(fecha_init.getDate() + (secu[contador++]));
  }
  return lista_subgrupo;
}


/**
     * el valor de letra referencia la poaisción en el array
     * @param grupo
     * @param letra
     * @return 
     */
function getFechaSubgrupoNuevo(grupo, letra) {
  let fecha;
    switch (grupo) {
      case "1":
        fecha = grupo1[letra];
        break;
      case "2":
        fecha = grupo2[letra];
        break;
      case "3":
        fecha = grupo3[letra];
        break;
      case "4":
        fecha = grupo4[letra];
        break;
      case "5":
        fecha = grupo5[letra];
        break;
    }
  return fecha;
}


/**
     * La fecha_init es la primera fecha del subgrupo del año 2020
     * El year es el año que vamos a calcular
     * @param fecha_init
     * @param year
     * @return la primera fecha del subgrupo ese año(year)
     */
function getFechaInitYearSubgrupo(fecha_init_subgrupo, year) {
  //secuencia de días que hay que retroceder
  //de jueves a martes, de martes a miércoles, de miércoles a lunes
  let secu = [79, 76, 65, 60];
  //se crea el día del año que queremos calcular
  let fecha_fin = new Date(year, 0, 1);

  if (year == 2020) {
    return fecha_init_subgrupo;
  } else {
    let dias = (fecha_fin.getTime() - fecha_init_subgrupo.getTime());
    dias /= (1000 * 60 * 60 * 24);
    let re = parseFloat(dias / 280);
    let p_dec = parseFloat(re % 1);
    let t_dias = parseFloat((2.8 * (1 - p_dec)) * 100);
    fecha_fin.setDate(fecha_fin.getDate() + Math.round(t_dias));
    //devuelve la fecha que corresponde al día que se inicia en el 2020
    //pero en el año que se quiere calcular pueden existir fechas anteriores
    let contador = 0;
    if (fecha_fin.getDay() == 2) {
      contador = 1;
    }
    if (fecha_fin.getDay() == 3) {
      contador = 2;
    }
    if (fecha_fin.getDay() == 1) {
      contador = 3;
    }
    let continuar = true;
    while (continuar) {
      if (contador > 3) {
        contador = 0;
      }
      let dias_descontar = secu[contador++];
      fecha_fin.setDate(fecha_fin.getDate() - dias_descontar);
      if (fecha_fin.getFullYear() != year) {
        fecha_fin.setDate(fecha_fin.getDate() + dias_descontar);
        continuar = false;
      }
    }
  }
  return fecha_fin;
}

function getLetraSubgrupo(letra) {
  let l;
  switch (letra) {
      case "A":
          l = 0;
          break;
      case "B":
          l = 1;
          break;
      case "C":
          l = 2;
          break;
      case "D":
          l = 3;
          break;
      case "E":
          l = 4;
          break;
      case "F":
          l = 5;
          break;
      case "G":
          l = 6;
          break;
      case "H":
          l = 7;
          break;
  }
  return l;
}



/**---------------------------------------------------  Calculos Calendario --------------------------------------- */

/*total dias de mes*/
function getTotalDays(month) {
  if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
    return 31;
  } else if (month == 4 || month == 6 || month == 9 || month == 11) {
    return 30;
  } else {
    return isLeap() ? 29 : 28;
  }
}

/*Año bisiesto*/
function isLeap() {
  return ((currentDate.getFullYear() % 100 !== 0) && (currentDate.getFullYear() % 4 == 0)
    || (currentDate.getFullYear() % 400 == 0));
}

/*dia que empieza el mes*/
function startDay(monthNumber) {
  let start = new Date(currentDate.getFullYear() + '-' + monthNumber + '-' + 1);
  return ((start.getDay() - 1) == -1) ? 6 : start.getDay() - 1;
}

/** Inicia un nuevo calendario borrando el anterior */
function nuevaFecha() {
  let dates = Array.from(document.getElementsByClassName("dates_week"));
  for (let i = 0; i < dates.length; i++) {
    dates[i].textContent = '';
  }
  let nuevo_year = txt_year.value;
  currentDate = new Date(nuevo_year + '-' + 01 + '-' + 01);
  writeMonths();
}
