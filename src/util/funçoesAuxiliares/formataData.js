export default date => {
  let createdAt = new Date(date);
  let ano = createdAt.getFullYear();
  let mes = createdAt.getMonth() + 1;
  let dia = createdAt.getDate();
  let hora = createdAt.getHours();
  let minuto = createdAt.getMinutes();
  //let segundo = createdAt.getSeconds()
  mes = mes < 10 ? "0" + mes : mes;
  dia = dia < 10 ? "0" + dia : dia;
  hora = hora < 10 ? "0" + hora : hora;
  minuto = minuto < 10 ? "0" + minuto : minuto;
  //segundo = segundo<10?'0'+segundo:segundo
  return `${dia}/${mes}/${ano} - ${hora}:${minuto}`;
};
