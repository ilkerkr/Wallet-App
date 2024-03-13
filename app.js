const ekleBtn = document.getElementById("ekle-btn");
const gelirInput = document.getElementById("gelir-input");
const ekleFormu = document.getElementById("ekle-formu");
const gelirinizTd = document.getElementById("geliriniz");
const giderinizTd = document.getElementById("gideriniz");
const kalanTd = document.getElementById("kalan");
const harcamaFormu = document.getElementById("harcama-formu");
const harcamaAlaniInput = document.getElementById("harcama-alani");
const tarihInput = document.getElementById("tarih");
const miktarInput = document.getElementById("miktar");
const harcamaBody = document.getElementById("harcama-body");
const temizleBtn = document.getElementById("temizle-btn");

let gelirler = 0;
let harcamaListesi = [];

ekleFormu.addEventListener("submit", (e) => {
  e.preventDefault();
  gelirler = gelirler + Number(gelirInput.value);
  ekleFormu.reset();
  localStorage.setItem("gelirler", gelirler);
  hesaplaVeGüncelle();
});

window.addEventListener("load", () => {
    gelirler = Number(localStorage.getItem("gelirler")) || 0;
    harcamaListesi = JSON.parse(localStorage.getItem("harcamalar")) || [];
    harcamaListesi.forEach(harcama => {
        harcamayiDomaYaz(harcama);
    });
    gelirinizTd.textContent = gelirler;
    tarihInput.valueAsDate = new Date();
    hesaplaVeGüncelle();
});

harcamaFormu.addEventListener("submit", (e) => {
    e.preventDefault();
    const yeniHarcama = {
        tarih: tarihInput.value,
        miktar: miktarInput.value,
        alan: harcamaAlaniInput.value,
        id: new Date().getTime()
    };

    harcamaFormu.reset();
    tarihInput.valueAsDate = new Date();
    harcamaListesi.push(yeniHarcama);
    localStorage.setItem("harcamalar", JSON.stringify(harcamaListesi));
    harcamayiDomaYaz(yeniHarcama);
    hesaplaVeGüncelle();
});

const harcamayiDomaYaz = ({id, miktar, tarih, alan}) => {
    harcamaBody.innerHTML += `
    <tr>
        <td>${tarih}</td>
        <td>${alan}</td>
        <td>${miktar}</td>
        <td><i id=${id} class="fa-solid fa-trash-can text-danger"  type="button"></i></td>
    </tr>
    `
};

const hesaplaVeGüncelle = () => {
    const giderler = harcamaListesi.reduce(
        (toplam,harcama) => toplam + Number(harcama.miktar),0
    );

    giderinizTd.textContent = giderler;
    gelirinizTd.textContent = gelirler;
    kalanTd.textContent = gelirler - giderler;
};


harcamaBody.addEventListener("click", (e) => {
  if(e.target.classList.contains("fa-trash-can")){
    e.target.parentElement.parentElement.remove();
    const id = e.target.id;
    harcamaListesi = harcamaListesi.filter((harcama)=> harcama.id != id);
    localStorage.setItem("harcamalar", JSON.stringify(harcamaListesi));
  };
});

temizleBtn.addEventListener("click",()=>{
    if (confirm("Tüm veriler silinecek. Devam etmek istiyor musun?")) {
        harcamaListesi = [];
        gelirler = 0;
        harcamaBody.innerHTML = "";
        localStorage.removeItem("gelirler") ;
        localStorage.removeItem("harcamalar"); 
        hesaplaVeGüncelle();
    };
});