const BMIData = [
  { name: "Maigreur", color: "midnightblue", range: [0, 18.5] },
  { name: "Bonne santé", color: "green", range: [18.5, 25] },
  { name: "Surpoids", color: "lightcoral", range: [25, 30] },
  { name: "Obésité modérée", color: "orange", range: [30, 35] },
  { name: "Obésité sévère", color: "crimson", range: [35, 40] },
  { name: "Obésité morbide", color: "purple", range: 40 },
];

document.querySelector('button').addEventListener('click',calculateImc);
// IMC = poids en kg / taille² en m
function calculateImc() {
  const height = document.querySelectorAll('input')[0].value;
  const weight = document.querySelectorAll('input')[1].value;
  if (height && weight && height > 100 && height < 250 && weight > 20 && weight < 250) {
    const imc = Math.round((weight / ((height/100) ** 2))*10) / 10;
     const ImcNumber = document.querySelector('h3');
     ImcNumber.textContent = imc;
    const BMI = BMIData.filter(e => e.range[0] < imc);
    const BMIobject = imc > 40 ? BMIData[5] : BMI[BMI.length - 1];
    ImcNumber.style.color = BMIobject.color;
    document.querySelector('p').textContent = BMIobject.name === 'Bonne santé' ? 'Vous êtes en bonne santé' : `Attention : ${BMIobject.name}`;
  } else {
    document.querySelector('p').textContent = "remplissez correctement tous les champs";
  }
}